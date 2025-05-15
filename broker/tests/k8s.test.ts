import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";

describe("k8s.ts", () => {
  const fakeReadPod = sinon.stub();
  const fakeCreatePod = sinon.stub();

  const getSandboxName = sinon.stub().callsFake((tech) => `sandbox-${tech}`);
  const getSandboxImage = sinon.stub().callsFake((tech) => `image-${tech}`);

  const podStatus = {
    metadata: { name: "sandbox-js-user123" },
    status: { phase: "Running" },
  };

  let consoleErrorStub: sinon.SinonStub;

  const podManager = proxyquire("../src/k8s", {
    "@kubernetes/client-node": {
      KubeConfig: class {
        loadFromDefault() {}
        makeApiClient() {
          return {
            readNamespacedPod: fakeReadPod,
            createNamespacedPod: fakeCreatePod,
          };
        }
      },
    },
    "./sandbox": {
      getSandboxName,
      getSandboxImage,
    },
  });

  beforeEach(() => {
    fakeReadPod.reset();
    fakeCreatePod.reset();
    getSandboxName.resetHistory();
    getSandboxImage.resetHistory();
    consoleErrorStub = sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should not create a pod if it already exists", async () => {
    fakeReadPod.resolves({ body: podStatus });

    await podManager.createUserPod("user123", "js");

    expect(fakeCreatePod.called).to.be.false;
  });

  it("should create a pod if it does not exist", async function () {
    this.timeout(10000);
    fakeReadPod.onFirstCall().rejects(new Error("Not found"));
    fakeReadPod.onSecondCall().resolves({ body: { status: { phase: "Pending" } } });
    fakeReadPod.onThirdCall().resolves({ body: podStatus });

    fakeCreatePod.resolves();

    await podManager.createUserPod("user123", "js");

    expect(fakeCreatePod.calledOnce).to.be.true;
    expect(fakeReadPod.callCount).to.be.greaterThanOrEqual(3);
  });

  it("should throw if pod does not reach Running", async function () {
    this.timeout(10000);

    fakeReadPod.onFirstCall().rejects(new Error("Not found"));
    fakeReadPod.onSecondCall().resolves({ body: { status: { phase: "Pending" } } });

    const nowStub = sinon.stub(Date, "now");
    nowStub.onCall(0).returns(1000);
    nowStub.onCall(1).returns(1001);
    nowStub.onCall(2).returns(1001 + 61 * 1000); // Ensure that the error is triggered after 60 seconds

    fakeCreatePod.resolves();

    try {
      await podManager.createUserPod("user123", "js");
      throw new Error("Should have thrown timeout");
    } catch (err) {
      expect((err as any).message).to.contain("did not reach Running state");
      expect(
        consoleErrorStub.calledWithMatch("Error checking pod sandbox-js-user123: Error: Not found")
      ).to.be.true;
      expect(
        consoleErrorStub.calledWithMatch(
          "Error creating user pod: Error: Pod sandbox-js-user123 did not reach Running state within the timeout period."
        )
      ).to.be.true;
    }

    nowStub.restore();
  });

  it("should log error and throw when pod creation fails", async () => {
    fakeReadPod.rejects(new Error("Not found"));

    const creationError = new Error("Failed to create pod");
    fakeCreatePod.rejects(creationError);

    try {
      await podManager.createUserPod("user123", "js");
      throw new Error("Test should have thrown");
    } catch (err) {
      expect((err as any).message).to.equal("Failed to create pod");
      expect(consoleErrorStub.calledWithMatch("Error creating pod")).to.be.true;
    }
  });

  it("should log error and break if error occurs during pod status check", async function () {
    this.timeout(10000);

    fakeReadPod.onFirstCall().rejects(new Error("Not found"));

    fakeCreatePod.resolves();

    const readError = new Error("Connection timeout");
    fakeReadPod.onSecondCall().rejects(readError);

    try {
      await podManager.createUserPod("user123", "js");
      throw new Error("Test should have thrown due to pod not reaching Running state");
    } catch (err) {
      expect((err as any).message).to.contain("did not reach Running state");
      expect(consoleErrorStub.calledWithMatch("Error checking pod status:")).to.be.true;
      expect(consoleErrorStub.calledWithMatch(readError.message)).to.be.true;
    }
  });

  it("should return false if pod metadata is undefined", async function () {
    this.timeout(10000);
    fakeReadPod.onFirstCall().resolves({ body: {} }); // no metadata
    fakeReadPod.onSecondCall().resolves({ body: { status: { phase: "Pending" } } });
    fakeReadPod.onThirdCall().resolves({ body: podStatus });

    fakeCreatePod.resolves();

    await podManager.createUserPod("user123", "js");

    expect(fakeCreatePod.calledOnce).to.be.true;
    expect(fakeReadPod.callCount).to.be.greaterThanOrEqual(3);
  });

  it("should retry checking if status is undefined", async function () {
    this.timeout(10000);
    fakeReadPod.onFirstCall().resolves(podStatus);
    fakeReadPod.onSecondCall().resolves({ body: {} });
    fakeReadPod.onThirdCall().resolves({ body: podStatus });

    fakeCreatePod.resolves();

    await podManager.createUserPod("user123", "js");

    expect(fakeCreatePod.calledOnce).to.be.true;
    expect(fakeReadPod.callCount).to.be.greaterThanOrEqual(3);
  });
});
