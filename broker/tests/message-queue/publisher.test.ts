import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";

describe("publisher.ts", () => {
  let connectStub: sinon.SinonStub;
  let createChannelStub: sinon.SinonStub;
  let assertExchangeStub: sinon.SinonStub;
  let assertQueueStub: sinon.SinonStub;
  let consumeStub: sinon.SinonStub;
  let publishStub: sinon.SinonStub;
  let closeStub: sinon.SinonStub;

  let uuidStub: sinon.SinonStub;
  let getRunnerNameStub: sinon.SinonStub;
  let clock: sinon.SinonFakeTimers;

  let fakeChannel: any;
  let fakeConnection: any;

  const fakeUUIDs = ["job-id-123", "correlation-id-456"];

  beforeEach(() => {
    clock = sinon.useFakeTimers();

    uuidStub = sinon
      .stub()
      .onCall(0)
      .returns(fakeUUIDs[0]) // jobId
      .onCall(1)
      .returns(fakeUUIDs[1]); // correlationId

    getRunnerNameStub = sinon.stub().returns("python");

    assertExchangeStub = sinon.stub().resolves();
    assertQueueStub = sinon.stub().resolves({ queue: "fake-reply-queue" });
    consumeStub = sinon.stub();
    publishStub = sinon.stub();
    closeStub = sinon.stub();

    fakeChannel = {
      assertExchange: assertExchangeStub,
      assertQueue: assertQueueStub,
      consume: consumeStub,
      publish: publishStub,
    };

    createChannelStub = sinon.stub().resolves(fakeChannel);

    fakeConnection = {
      createChannel: createChannelStub,
      close: closeStub,
    };

    connectStub = sinon.stub().resolves(fakeConnection);
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  it("should publish without reply and return jobId", async () => {
    const { publish } = proxyquire("../../src/message-queue/publisher", {
      amqplib: { connect: connectStub },
      uuid: { v4: uuidStub },
      "../../src/runner": { getRunnerName: getRunnerNameStub },
      "../../src/const": { RABBITMQ_URL: "amqp://localhost" },
      "../../src/message-queue/const": { EXCHANGE_NAME: "test.exchange" },
    });

    const result = await publish("u1", "python", "cmd", {}, false, false);

    // symulujemy działanie setTimeout z close()
    await clock.tickAsync(500);

    expect(result).to.deep.equal({ jobId: fakeUUIDs[0] });
    expect(connectStub.calledOnce).to.be.true;
    expect(publishStub.calledOnce).to.be.true;
    expect(closeStub.calledOnce).to.be.true;
    expect(consumeStub.called).to.be.false;
  });
});
