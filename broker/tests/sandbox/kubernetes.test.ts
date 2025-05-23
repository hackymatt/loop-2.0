import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";

describe("kubernetes.ts", () => {
  let fakeReadPod: sinon.SinonStub;
  let fakeCreatePod: sinon.SinonStub;
  let fakeDeletePod: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let clock: sinon.SinonFakeTimers;
  let podManager: any;

  const podStatus = {
    metadata: { name: "sandbox-js-user123" },
    status: {
      phase: "Running",
      containerStatuses: [{ ready: true }],
    },
  };

  beforeEach(() => {
    sinon.restore();

    fakeReadPod = sinon.stub();
    fakeCreatePod = sinon.stub();
    fakeDeletePod = sinon.stub();
    consoleErrorStub = sinon.stub(console, "error");
    consoleLogStub = sinon.stub(console, "log");

    clock = sinon.useFakeTimers();

    podManager = proxyquire("../../src/sandbox/kubernetes", {
      "@kubernetes/client-node": {
        KubeConfig: class {
          loadFromDefault() {}
          makeApiClient() {
            return {
              readNamespacedPod: fakeReadPod,
              createNamespacedPod: fakeCreatePod,
              deleteNamespacedPod: fakeDeletePod,
            };
          }
        },
      },
      "../sandbox": {
        getSandboxName: (tech: string) => `sandbox-${tech}`,
        getSandboxImage: (tech: string) => `image-${tech}`,
      },
      "../const": {
        RABBITMQ_HOST: "rabbitmq",
        RABBITMQ_PORT: "5672",
      },
    });
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  describe("createUserPod", () => {
    it("does not create pod if it exists and is ready", async () => {
      fakeReadPod.resolves({ body: podStatus });

      await podManager.createUserPod("user123", "js", 100);

      expect(fakeCreatePod.called).to.be.false;
      expect(fakeDeletePod.called).to.be.false;
      expect(consoleLogStub.calledWith("Pod sandbox-js-user123 is already running and ready.")).to
        .be.true;
    });

    it("creates pod if not found", async () => {
      fakeReadPod.rejects({ response: { statusCode: 404 } });
      fakeCreatePod.resolves();
      fakeReadPod.onSecondCall().resolves({ body: podStatus });

      await podManager.createUserPod("user123", "js", 100);

      expect(fakeCreatePod.calledOnce).to.be.true;
    });

    it("creates pod with correct spec", async () => {
      fakeReadPod.rejects({ response: { statusCode: 404 } });
      fakeCreatePod.resolves();
      fakeReadPod.onSecondCall().resolves({ body: podStatus });

      await podManager.createUserPod("user123", "js", 100);

      expect(
        fakeCreatePod.calledWith(
          "sandbox",
          sinon.match({
            metadata: { name: "sandbox-js-user123" },
            spec: {
              containers: [
                sinon.match({
                  name: "sandbox-js",
                  image: "image-js",
                  env: [
                    { name: "USER_ID", value: "user123" },
                    { name: "RABBITMQ_HOST", value: "rabbitmq.default" },
                    { name: "RABBITMQ_PORT", value: "5672" },
                  ],
                }),
              ],
            },
          })
        )
      ).to.be.true;
    });

    it("handles pod creation errors", async () => {
      fakeReadPod.rejects({ response: { statusCode: 404 } });
      fakeCreatePod.rejects(new Error("Creation failed"));

      try {
        await podManager.createUserPod("user123", "js", 100);
        expect.fail("Should throw");
      } catch (err: any) {
        expect(consoleErrorStub.calledWith("Error creating user pod: Error: Creation failed")).to.be
          .true;
        expect(err.message).to.equal("Creation failed");
      }
    });

    it("schedules pod deletion after 1 hour", async () => {
      fakeReadPod
        .onFirstCall()
        .rejects({ response: { statusCode: 404 } })
        .onSecondCall()
        .resolves({ body: podStatus });

      fakeCreatePod.resolves();

      const expectedDeleteTime = new Date(Date.now() + 3600000).toISOString();

      await podManager.createUserPod("user123", "js", 100);
      await clock.tickAsync(3600000);
      await Promise.resolve();

      const logs = [
        `Pod sandbox-js-user123 will be deleted at ${expectedDeleteTime}.`,
        "Creating pod sandbox-js-user123...",
        "Pod sandbox-js-user123 is running and ready.",
        "Pod for user user123 created successfully.",
        "Deleting pod sandbox-js-user123...",
        "Pod sandbox-js-user123 deleted after timeout.",
      ];

      logs.forEach((msg, idx) => {
        expect(consoleLogStub.getCall(idx)?.args[0]).to.equal(msg);
      });

      expect(fakeDeletePod.calledOnce).to.be.true;
    });

    it("handles errors during scheduled deletion", async () => {
      fakeReadPod
        .onFirstCall()
        .rejects({ response: { statusCode: 404 } })
        .onSecondCall()
        .resolves({ body: podStatus });

      fakeCreatePod.resolves();
      fakeDeletePod.rejects(new Error("Deletion failed"));

      await podManager.createUserPod("user123", "js", 100);
      await clock.tickAsync(3600000);
      await Promise.resolve();

      expect(fakeDeletePod.calledOnce).to.be.true;
      expect(
        consoleErrorStub.calledWith(
          "Error deleting pod sandbox-js-user123 on timeout:",
          sinon.match.instanceOf(Error)
        )
      ).to.be.true;
    });

    it("recreates pod if not ready", async function () {
      this.timeout(20000);

      let readCount = 0;
      const podOps: string[] = [];

      fakeReadPod.callsFake(async () => {
        readCount++;
        if (readCount === 1) {
          podOps.push("ReadPod");
          return { body: podStatus };
        } else if (readCount === 2) {
          podOps.push("ReadPod (Not Ready)");
          return {
            body: {
              ...podStatus,
              status: { phase: "Pending", containerStatuses: [{ ready: false }] },
            },
          };
        } else if (readCount === 3) {
          podOps.push("ReadPod (404)");
          throw { response: { statusCode: 404 } };
        } else {
          podOps.push("ReadPod (Ready)");
          return { body: podStatus };
        }
      });

      fakeDeletePod.callsFake(async () => {
        podOps.push("DeletePod");
        await clock.tickAsync(100);
      });

      fakeCreatePod.callsFake(async () => {
        podOps.push("CreatePod");
        await clock.tickAsync(100);
      });

      const podPromise = podManager.createUserPod("user123", "js", 100);

      const flush = async () => {
        await clock.tickAsync(100);
        await new Promise((r) => setImmediate(r));
      };

      for (let i = 0; i < 100; i++) {
        const done = await Promise.race([podPromise.then(() => true), flush().then(() => false)]);
        if (done) break;
      }

      expect(podOps).to.deep.equal([
        "ReadPod",
        "ReadPod (Not Ready)",
        "DeletePod",
        "ReadPod (404)",
        "CreatePod",
        "ReadPod (Ready)",
      ]);
    });

    it("handles readPod error during ready check", async function () {
      this.timeout(5000);

      // Restore default clock and create new one with specific settings
      clock.restore();
      clock = sinon.useFakeTimers({
        now: new Date("2025-05-16T10:07:27.060Z"),
        shouldAdvanceTime: true,
        advanceTimeDelta: 20,
      });

      // Track operations
      const podOps: string[] = [];

      // First call for existence check
      fakeReadPod
        .onFirstCall()
        .callsFake(async () => {
          podOps.push("ReadPod (Exists)");
          return { body: podStatus };
        })
        // Second call for ready check throws error
        .onSecondCall()
        .callsFake(async () => {
          podOps.push("ReadPod (Error)");
          throw new Error("Failed to check pod status");
        });

      fakeDeletePod.callsFake(async () => {
        podOps.push("DeletePod");
        await clock.tickAsync(50);
      });

      const podPromise = podManager.createUserPod("user123", "js", 100);

      // Helper function to advance time
      const advanceTimeAndFlush = async () => {
        await clock.tickAsync(50);
        await Promise.resolve();
        await new Promise((resolve) => setImmediate(resolve));
      };

      // Wait for pod operations to complete
      for (let i = 0; i < 20; i++) {
        const done = await Promise.race([
          podPromise.then(() => true),
          advanceTimeAndFlush().then(() => false),
        ]);
        if (done) break;
      }

      // Verify operations
      expect(fakeReadPod.callCount).to.equal(3);
      expect(fakeCreatePod.called).to.be.false;
      expect(fakeDeletePod.called).to.be.true;
      expect(podOps).to.deep.equal(["ReadPod (Exists)", "ReadPod (Error)", "DeletePod"]);
      expect(
        consoleLogStub.calledWith("Pod sandbox-js-user123 exists but is not ready. Deleting...")
      ).to.be.true;
    });

    it("throws error when pod deletion times out", async function () {
      this.timeout(5000);

      // Setup clock
      clock.restore();
      clock = sinon.useFakeTimers({
        now: new Date("2025-05-16T10:07:27.060Z"),
        shouldAdvanceTime: true,
        advanceTimeDelta: 20,
      });

      // Track operations
      const podOps: string[] = [];

      // Pod exists check always returns true to simulate stuck pod
      fakeReadPod
        .onFirstCall()
        .resolves({ body: podStatus }) // Initial exists check
        .onSecondCall()
        .resolves({
          body: {
            // Not ready check
            ...podStatus,
            status: { phase: "Pending", containerStatuses: [{ ready: false }] },
          },
        });

      // Always return true for exists checks to simulate pod not being deleted
      fakeReadPod.callsFake(async () => {
        podOps.push("ReadPod");
        return { body: podStatus };
      });

      fakeDeletePod.callsFake(async () => {
        podOps.push("DeletePod");
        await clock.tickAsync(50);
      });

      try {
        // Set short timeout to trigger error faster
        await podManager.createUserPod("user123", "js", 100, 100); // 100ms deletion timeout
        expect.fail("Should throw timeout error");
      } catch (err: any) {
        expect(err.message).to.equal("Timeout waiting for pod sandbox-js-user123 to be deleted");
        expect(podOps).to.include("DeletePod");
        expect(fakeReadPod.callCount).to.be.greaterThan(1);
      }
    });

    it("handles pod readiness status check errors", async function () {
      this.timeout(10000);

      // Setup clock
      clock.restore();
      clock = sinon.useFakeTimers({
        now: new Date("2025-05-16T10:07:27.060Z"),
        shouldAdvanceTime: true,
        advanceTimeDelta: 20,
      });

      // Track operations
      const podOps: string[] = [];

      let readCount = 0;
      fakeReadPod.callsFake(async () => {
        readCount++;

        switch (readCount) {
          case 1:
            podOps.push("ReadPod (Exists)");
            return { body: podStatus };

          case 2:
            podOps.push("ReadPod (Missing Status)");
            return {
              body: {
                metadata: { name: "sandbox-js-user123" },
                // status field intentionally missing to test nullish coalescing
              },
            };

          case 3:
            podOps.push("ReadPod (404)");
            throw { response: { statusCode: 404 } };

          case 4:
            // Pod is in Pending state
            podOps.push("ReadPod (Pending)");
            return {
              body: {
                ...podStatus,
                status: { phase: "Pending", containerStatuses: [{ ready: false }] },
              },
            };

          case 5:
            // Error during ready check of new pod
            podOps.push("ReadPod (Error)");
            throw new Error("Network error during pod status check");

          default:
            podOps.push("ReadPod (Ready)");
            return { body: podStatus };
        }
      });

      fakeDeletePod.callsFake(async () => {
        podOps.push("DeletePod");
        await clock.tickAsync(50);
      });

      fakeCreatePod.callsFake(async () => {
        podOps.push("CreatePod");
        await clock.tickAsync(50);
      });

      const podPromise = podManager.createUserPod("user123", "js");

      // Helper function to advance time
      const advanceTimeAndFlush = async () => {
        await clock.tickAsync(50);
        await Promise.resolve();
        await new Promise((resolve) => setImmediate(resolve));
      };

      // Wait for operations to complete
      for (let i = 0; i < 10; i++) {
        await advanceTimeAndFlush();
      }

      try {
        await podPromise;
        expect.fail("Should throw timeout error");
      } catch (err: any) {
        // Verify operation sequence
        expect(podOps).to.deep.equal([
          "ReadPod (Exists)",
          "ReadPod (Missing Status)",
          "DeletePod",
          "ReadPod (404)",
          "CreatePod",
          "ReadPod (Pending)",
          "ReadPod (Error)",
          "ReadPod (Ready)",
        ]);

        // Verify error logging
        expect(
          consoleErrorStub.calledWith("Error reading pod status:", sinon.match.instanceOf(Error))
        ).to.be.true;

        // Verify status logging
        expect(
          consoleLogStub.calledWith("Pod sandbox-js-user123 exists but is not ready. Deleting...")
        ).to.be.true;
        expect(consoleLogStub.calledWith("Pod sandbox-js-user123 status: Pending. Waiting...")).to
          .be.true;
      }
    });

    it("handles pod readiness status check pending", async function () {
      this.timeout(10000);

      // Setup clock
      clock.restore();
      clock = sinon.useFakeTimers({
        now: new Date("2025-05-16T10:07:27.060Z"),
        shouldAdvanceTime: true,
        advanceTimeDelta: 20,
      });

      // Track operations
      const podOps: string[] = [];

      // First call - pod exists check
      fakeReadPod.onFirstCall().resolves({ body: podStatus });

      // Second call - initial readiness check throws error
      fakeReadPod.onSecondCall().resolves({
        body: {
          ...podStatus,
          status: { phase: "Pending", containerStatuses: [{ ready: false }] },
        },
      });

      // Third call - deletion verification
      fakeReadPod.onThirdCall().rejects({ response: { statusCode: 404 } });

      // Setup deletion
      fakeDeletePod.callsFake(async () => {
        podOps.push("DeletePod");
        await clock.tickAsync(50);
      });

      // Setup creation
      fakeCreatePod.callsFake(async () => {
        podOps.push("CreatePod");
        await clock.tickAsync(50);
      });

      // Subsequent ready checks for new pod
      let checkCount = 3; // Start after first 3 calls
      fakeReadPod.callsFake(async () => {
        checkCount++;
        if (checkCount === 4) {
          podOps.push("ReadPod (Not Ready)");
          return {
            body: {
              ...podStatus,
              status: { phase: "Pending", containerStatuses: [{ ready: false }] },
            },
          };
        }
        podOps.push("ReadPod (Not Ready)");
        return {
          body: {
            ...podStatus,
            status: { phase: "Pending", containerStatuses: [{ ready: false }] },
          },
        };
      });

      const podPromise = podManager.createUserPod("user123", "js", 100);

      // Helper function to advance time
      const advanceTimeAndFlush = async () => {
        await clock.tickAsync(50);
        await Promise.resolve();
        await new Promise((resolve) => setImmediate(resolve));
      };

      // Wait for operations to complete
      for (let i = 0; i < 10; i++) {
        await advanceTimeAndFlush();
      }

      try {
        await podPromise;
        expect.fail("Should throw timeout error");
      } catch (err: any) {
        // Verify logging from readNamespacedPod pending
        expect(consoleLogStub.getCalls().map((call) => call.args[0])).to.include(
          "Pod sandbox-js-user123 status: Pending. Waiting..."
        );

        // Verify operation sequence
        expect(podOps).to.deep.equal(["DeletePod", "CreatePod", "ReadPod (Not Ready)"]);
      }
    });
  });
});
