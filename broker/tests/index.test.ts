import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";

describe("index.ts", () => {
  let listenStub: sinon.SinonStub;
  let useStub: sinon.SinonStub;
  let consumeResultsStub: sinon.SinonStub;
  let startWebSocketServerStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    useStub = sinon.stub();
    listenStub = sinon.stub();
    consumeResultsStub = sinon.stub();
    startWebSocketServerStub = sinon.stub();
    consoleLogStub = sinon.stub(console, "log");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should start server on correct port and log startup message", () => {
    const fakeApp = {
      use: useStub,
      listen: listenStub,
    };

    const expressStub = sinon.stub().returns(fakeApp);

    // Replace modules with stubs using proxyquire
    proxyquire("../src/index", {
      express: expressStub,
      "./message-queue/consumer": {
        consumeResults: consumeResultsStub,
      },
      "./ws": {
        startWebSocketServer: startWebSocketServerStub,
      },
      "./const": {
        API_PORT: 1234,
      },
    });

    // The actual function passed to listen
    const callback = listenStub.firstCall.args[1];

    expect(listenStub.calledOnce).to.be.true;
    expect(listenStub.firstCall.args[0]).to.equal(1234);
    expect(callback).to.be.a("function");

    // Manually invoke the callback to simulate server starting
    callback();

    expect(consoleLogStub.calledWith("Broker service listening on port 1234")).to.be.true;
    expect(consumeResultsStub.calledOnce).to.be.true;
  });
});
