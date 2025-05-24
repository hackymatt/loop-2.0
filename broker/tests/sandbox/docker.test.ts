import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";

describe("docker.ts", () => {
  let execStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let dockerManager: any;
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    sinon.restore();
    clock = sinon.useFakeTimers();

    execStub = sinon.stub();
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");

    // Create a promisified version of the exec stub
    const execAsyncStub = (cmd: string) => {
      return new Promise((resolve, reject) => {
        const result = execStub(cmd);
        if (result instanceof Promise) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      });
    };

    dockerManager = proxyquire("../../src/sandbox/docker", {
      child_process: {
        exec: execStub,
      },
      util: {
        promisify: () => execAsyncStub,
      },
      "../sandbox": {
        getSandboxImage: (tech: string) => `sandbox-image-${tech}`,
      },
      "../const": {
        NETWORK: "sandbox-network",
        RABBITMQ_HOST: "rabbitmq",
        RABBITMQ_PORT: "5672",
        RABBITMQ_USER: "user",
        RABBITMQ_PASSWORD: "password",
      },
    });
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  describe("createLocalContainer", () => {
    it("creates a new container when none exists", async () => {
      const userId = "user123";
      const technology = "python";
      const containerName = `sandbox-${technology}-${userId}`;

      execStub
        .withArgs(`docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`)
        .resolves({ stdout: "" });

      execStub
        .withArgs(sinon.match(`docker run -d --name ${containerName}`))
        .resolves({ stdout: "new-container-id\n" });

      execStub
        .withArgs(`docker inspect -f '{{.State.Running}}' ${containerName}`)
        .resolves({ stdout: "true\n" });

      await dockerManager.createLocalContainer(userId, technology);

      expect(execStub.callCount).to.equal(3);
      expect(consoleLogStub.calledWith(`Creating local container: ${containerName}`)).to.be.true;
      expect(consoleLogStub.calledWith("Container started: new-container-id")).to.be.true;
      expect(consoleLogStub.calledWith(`Container ${containerName} is running.`)).to.be.true;
    });

    it("removes existing container and creates a new one", async () => {
      const userId = "user123";
      const technology = "python";
      const containerName = `sandbox-${technology}-${userId}`;

      execStub
        .withArgs(`docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`)
        .resolves({ stdout: containerName });

      execStub.withArgs(`docker rm -f ${containerName}`).resolves({ stdout: "" });

      execStub
        .withArgs(sinon.match(`docker run -d --name ${containerName}`))
        .resolves({ stdout: "new-container-id\n" });

      execStub
        .withArgs(`docker inspect -f '{{.State.Running}}' ${containerName}`)
        .resolves({ stdout: "true\n" });

      await dockerManager.createLocalContainer(userId, technology);

      expect(execStub.callCount).to.equal(4);
      expect(consoleLogStub.calledWith(`Container ${containerName} already exists. Removing...`)).to
        .be.true;
      expect(consoleLogStub.calledWith(`Container started: new-container-id`)).to.be.true;
    });

    it("throws an error if container fails to start", async () => {
      const userId = "user123";
      const technology = "python";
      const containerName = `sandbox-${technology}-${userId}`;

      execStub
        .withArgs(`docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`)
        .resolves({ stdout: "" });

      execStub
        .withArgs(sinon.match(`docker run -d --name ${containerName}`))
        .rejects(new Error("Docker run failed"));

      try {
        await dockerManager.createLocalContainer(userId, technology);
        expect.fail("Should have thrown an error");
      } catch (err: any) {
        expect(err.message).to.equal("Docker run failed");
        expect(consoleErrorStub.calledWith("Failed to start container:")).to.be.true;
      }
    });

    it("throws an error if container is not ready within timeout", async () => {
      const userId = "user123";
      const technology = "python";
      const containerName = `sandbox-${technology}-${userId}`;

      execStub
        .withArgs(`docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`)
        .resolves({ stdout: "" });

      execStub
        .withArgs(sinon.match(`docker run -d --name ${containerName}`))
        .resolves({ stdout: "new-container-id\n" });

      execStub
        .withArgs(`docker inspect -f '{{.State.Running}}' ${containerName}`)
        .resolves({ stdout: "false\n" });

      const containerPromise = dockerManager.createLocalContainer(userId, technology);

      // Advance time past the timeout
      await clock.tickAsync(31000);

      try {
        await containerPromise;
        expect.fail("Should have thrown an error");
      } catch (err: any) {
        expect(err.message).to.equal(`Timeout: Container ${containerName} not running`);
        expect(consoleLogStub.calledWith(`Waiting for container ${containerName}...`)).to.be.true;
      }
    });

    it("includes all required environment variables in container creation", async () => {
      const userId = "user123";
      const technology = "python";

      execStub
        .withArgs(
          `docker ps -a --filter "name=sandbox-${technology}-${userId}" --format "{{.Names}}"`
        )
        .resolves({ stdout: "" });

      execStub.withArgs(sinon.match(`docker run -d`)).resolves({ stdout: "new-container-id\n" });

      execStub
        .withArgs(`docker inspect -f '{{.State.Running}}' sandbox-${technology}-${userId}`)
        .resolves({ stdout: "true\n" });

      await dockerManager.createLocalContainer(userId, technology);

      const runCommand = execStub.secondCall.args[0];
      expect(runCommand).to.include("-e USER_ID=user123");
      expect(runCommand).to.include("-e RABBITMQ_HOST=rabbitmq");
      expect(runCommand).to.include("-e RABBITMQ_PORT=5672");
      expect(runCommand).to.include("-e RABBITMQ_USER=user");
      expect(runCommand).to.include("-e RABBITMQ_PASSWORD=password");
    });
  });
});
