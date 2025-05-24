import { expect } from "chai";
import sinon from "sinon";
import WebSocket from "ws";
import jwt from "jsonwebtoken";
import proxyquire from "proxyquire";
import rewire from "rewire";

describe("ws.ts", () => {
  describe("startWebSocketServer.ts", () => {
    let wsServer: WebSocket.Server;
    let createUserSandboxStub: sinon.SinonStub;
    let publishStub: sinon.SinonStub;
    let getSandboxNameStub: sinon.SinonStub;
    let ws: WebSocket;
    let testPort: number;

    beforeEach(async () => {
      createUserSandboxStub = sinon.stub().resolves();
      publishStub = sinon.stub().resolves();
      getSandboxNameStub = sinon.stub().returns("python");

      const tempServer = new WebSocket.Server({ port: 0 });

      await new Promise<void>((resolve, reject) => {
        tempServer.once("listening", () => {
          const address = tempServer.address();
          if (typeof address === "object" && address?.port) {
            testPort = address.port;
          }
          tempServer.close(() => resolve());
        });
        tempServer.once("error", reject);
      });

      const { startWebSocketServer } = proxyquire("../src/ws", {
        "./sandbox/utils": { createUserSandbox: createUserSandboxStub },
        "./message-queue/publisher": { publish: publishStub },
        "./sandbox": { getSandboxName: getSandboxNameStub },
        "./const": {
          WS_PORT: testPort,
          JWT_SECRET: "test-secret",
        },
      });

      wsServer = startWebSocketServer();
    });

    afterEach(async () => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close();
      }

      if (wsServer?.clients) {
        for (const client of wsServer.clients) {
          client.close();
        }
      }

      if (wsServer) {
        await new Promise<void>((resolve) => wsServer.close(() => resolve()));
      }

      sinon.restore();
    });

    it("should reject connection with invalid token", (done) => {
      let doneCalled = false;

      ws = new WebSocket(`ws://localhost:${testPort}?token=invalid`);

      ws.on("close", (code, reason) => {
        if (!doneCalled) {
          doneCalled = true;
          expect(code).to.equal(1008);
          expect(reason.toString()).to.equal("Invalid token");
          done();
        }
      });

      ws.on("error", (err) => {
        if (!doneCalled) {
          doneCalled = true;
          done(err); // zakończ test błędem
        }
      });
    });

    it("should reject connection with expired token", (done) => {
      let doneCalled = false;

      const expiredToken = jwt.sign({ user_id: "test-user" }, "test-secret", { expiresIn: -1 });

      ws = new WebSocket(`ws://localhost:${testPort}?token=${expiredToken}`);

      ws.on("close", (code, reason) => {
        if (!doneCalled) {
          doneCalled = true;
          expect(code).to.equal(1008);
          expect(reason.toString()).to.equal("Invalid token");
          done();
        }
      });

      ws.on("error", (err) => {
        if (!doneCalled) {
          doneCalled = true;
          done(err);
        }
      });
    });

    it("should accept connection with valid token", (done) => {
      const token = jwt.sign({ user_id: "test-user" }, "test-secret");
      ws = new WebSocket(`ws://localhost:${testPort}?token=${token}`);

      ws.on("open", () => {
        expect(ws.readyState).to.equal(WebSocket.OPEN);
        done();
      });

      ws.on("error", (err) => {
        done(err);
      });
    });

    it("should call createUserPod and publish when receiving valid message", (done) => {
      const token = jwt.sign({ user_id: "test-user" }, "test-secret");
      ws = new WebSocket(`ws://localhost:${testPort}?token=${token}`);

      ws.on("open", () => {
        const message = {
          technology: "python",
          timeout: 60,
          command: "print('Hello')",
          files: [{ name: "main.py", content: "print('Hello')" }],
        };

        ws.send(JSON.stringify(message));
      });

      setTimeout(() => {
        expect(createUserSandboxStub.calledOnce).to.be.true;
        expect(publishStub.calledOnce).to.be.true;
        done();
      }, 200);
    });

    it("should close connection on invalid JSON message", (done) => {
      const token = jwt.sign({ user_id: "test-user" }, "test-secret");
      ws = new WebSocket(`ws://localhost:${testPort}?token=${token}`);

      ws.on("open", () => {
        ws.send("this is not json");
      });

      ws.on("close", (code, reason) => {
        expect(code).to.equal(1003);
        expect(reason.toString()).to.equal("Invalid message format");
        done();
      });
    });
  });

  describe("sendDataToClient", () => {
    let sendStub: sinon.SinonStub;
    let closeStub: sinon.SinonStub;
    let sendDataToClient: any;
    let clients: Map<WebSocket, string>;
    let fakeClient: WebSocket;

    const sandboxName = "python";
    const userId = "user123";
    const jobId = "job456";
    const key = `${sandboxName}-${userId}-${jobId}`;
    const routingKey = `msg.${sandboxName}.${userId}`;

    function createFakeMsg(result: any) {
      return {
        fields: { routingKey },
        content: Buffer.from(JSON.stringify({ job_id: jobId, result })),
      };
    }

    beforeEach(() => {
      const wsModule = rewire("../src/ws");
      sendDataToClient = wsModule.__get__("sendDataToClient");
      clients = wsModule.__get__("clients");

      fakeClient = {
        send: () => {},
        close: () => {},
        readyState: WebSocket.OPEN,
      } as unknown as WebSocket;

      sendStub = sinon.stub(fakeClient, "send");
      closeStub = sinon.stub(fakeClient, "close");

      clients.clear();
      clients.set(fakeClient, key);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should send message to the correct client", () => {
      const msg = createFakeMsg({ output: "Hello" });

      sendDataToClient(msg);

      expect(sendStub.calledOnce).to.be.true;
      expect(sendStub.firstCall.args[0]).to.equal(JSON.stringify({ output: "Hello" }));
      expect(closeStub.called).to.be.false;
    });

    it("should close client if result is finish", () => {
      const msg = createFakeMsg("finish");

      sendDataToClient(msg);

      expect(sendStub.calledOnce).to.be.true;
      expect(closeStub.calledOnceWith(1000, "Finished")).to.be.true;
    });

    it("should not send if key does not match", () => {
      clients.clear();
      clients.set(fakeClient, "wrong-key");

      const msg = createFakeMsg({ output: "Hello" });
      sendDataToClient(msg);

      expect(sendStub.called).to.be.false;
      expect(closeStub.called).to.be.false;
    });
  });
});
