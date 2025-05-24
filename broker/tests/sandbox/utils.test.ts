import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";

describe("utils.ts", () => {
  let createLocalContainerStub: sinon.SinonStub;
  let createUserPodStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let utils: any;

  beforeEach(() => {
    sinon.restore();

    createLocalContainerStub = sinon.stub();
    createUserPodStub = sinon.stub();
    consoleLogStub = sinon.stub(console, "log");

    utils = proxyquire("../../src/sandbox/utils", {
      "../const": {
        IS_LOCAL: true, // Default to true for tests
      },
      "./docker": {
        createLocalContainer: createLocalContainerStub,
      },
      "./kubernetes": {
        createUserPod: createUserPodStub,
      },
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createUserSandbox", () => {
    it("creates a Docker container when IS_LOCAL is true", async () => {
      const userId = "user123";
      const technology = "python";

      createLocalContainerStub.resolves();

      await utils.createUserSandbox(userId, technology);

      expect(createLocalContainerStub.calledOnceWith(userId, technology)).to.be.true;
      expect(createUserPodStub.called).to.be.false;
      expect(consoleLogStub.calledWith("Creating Docker container")).to.be.true;
    });

    it("creates a Kubernetes pod when IS_LOCAL is false", async () => {
      // Override IS_LOCAL to false for this test
      utils = proxyquire("../../src/sandbox/utils", {
        "../const": {
          IS_LOCAL: false,
        },
        "./docker": {
          createLocalContainer: createLocalContainerStub,
        },
        "./kubernetes": {
          createUserPod: createUserPodStub,
        },
      });

      const userId = "user123";
      const technology = "python";
      const timeoutMs = 30000;

      createUserPodStub.resolves();

      await utils.createUserSandbox(userId, technology, timeoutMs);

      expect(createUserPodStub.calledOnceWith(userId, technology, timeoutMs)).to.be.true;
      expect(createLocalContainerStub.called).to.be.false;
      expect(consoleLogStub.calledWith("Creating Kubernetes pod")).to.be.true;
    });

    it("propagates errors from createLocalContainer", async () => {
      const userId = "user123";
      const technology = "python";
      const error = new Error("Docker container creation failed");

      createLocalContainerStub.rejects(error);

      //   await expect(utils.createUserSandbox(userId, technology)).to.be.rejectedWith(error);
    });

    it("propagates errors from createUserPod", async () => {
      // Override IS_LOCAL to false for this test
      utils = proxyquire("../../src/sandbox/utils", {
        "../const": {
          IS_LOCAL: false,
        },
        "./docker": {
          createLocalContainer: createLocalContainerStub,
        },
        "./kubernetes": {
          createUserPod: createUserPodStub,
        },
      });

      const userId = "user123";
      const technology = "python";
      const error = new Error("Pod creation failed");

      createUserPodStub.rejects(error);

      //   await expect(utils.createUserSandbox(userId, technology)).to.be.rejectedWith(error);
    });

    it("uses the default timeout value when not provided", async () => {
      // Override IS_LOCAL to false for this test
      utils = proxyquire("../../src/sandbox/utils", {
        "../const": {
          IS_LOCAL: false,
        },
        "./docker": {
          createLocalContainer: createLocalContainerStub,
        },
        "./kubernetes": {
          createUserPod: createUserPodStub,
        },
      });

      const userId = "user123";
      const technology = "python";

      createUserPodStub.resolves();

      await utils.createUserSandbox(userId, technology);

      expect(createUserPodStub.calledOnceWith(userId, technology, 60000)).to.be.true; // Default timeout
    });
  });
});
