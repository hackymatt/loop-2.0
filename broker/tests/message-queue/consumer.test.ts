import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";

describe("consumer.ts", () => {
  let connectStub: sinon.SinonStub;
  let createChannelStub: sinon.SinonStub;
  let assertExchangeStub: sinon.SinonStub;
  let assertQueueStub: sinon.SinonStub;
  let bindQueueStub: sinon.SinonStub;
  let consumeStub: sinon.SinonStub;
  let ackStub: sinon.SinonStub;

  const fakeChannel = {} as any;
  const fakeConnection = {} as any;

  beforeEach(() => {
    assertExchangeStub = sinon.stub().resolves();
    assertQueueStub = sinon.stub().resolves();
    bindQueueStub = sinon.stub().resolves();
    ackStub = sinon.stub();
    consumeStub = sinon.stub();

    fakeChannel.assertExchange = assertExchangeStub;
    fakeChannel.assertQueue = assertQueueStub;
    fakeChannel.bindQueue = bindQueueStub;
    fakeChannel.consume = consumeStub;
    fakeChannel.ack = ackStub;

    createChannelStub = sinon.stub().resolves(fakeChannel);
    fakeConnection.createChannel = createChannelStub;
    connectStub = sinon.stub().resolves(fakeConnection);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should setup exchange, queue, bind and consume messages", async () => {
    const RESULT_QUEUE = "results.*.*";
    const EXCHANGE_NAME = "my.exchange";
    const RABBITMQ_URL = "amqp://localhost";

    let consumeCallback: ((msg: any) => void) | undefined;
    consumeStub.callsFake((_queue, cb) => {
      consumeCallback = cb;
    });

    const { consumeResults } = proxyquire("../../src/message-queue/consumer", {
      amqplib: { connect: connectStub },
      "./const": { EXCHANGE_NAME },
      "../const": { RABBITMQ_URL },
    });

    await consumeResults();

    expect(connectStub.calledWith(RABBITMQ_URL)).to.be.true;
    expect(assertExchangeStub.calledWith(EXCHANGE_NAME, "direct")).to.be.true;
    expect(assertQueueStub.calledWith(RESULT_QUEUE)).to.be.true;
    expect(bindQueueStub.calledWith(RESULT_QUEUE, EXCHANGE_NAME, RESULT_QUEUE)).to.be.true;
    expect(consumeStub.calledWith(RESULT_QUEUE)).to.be.true;

    const fakeMsg = { content: Buffer.from("test"), fields: {}, properties: {} };
    consumeCallback?.(fakeMsg);

    expect(ackStub.calledWith(fakeMsg)).to.be.true;
  });

  it("should log error and exit on connection failure", async () => {
    const consoleErrorStub = sinon.stub(console, "error");
    const processExitStub = sinon.stub(process, "exit");

    const failingConnectStub = sinon.stub().rejects(new Error("Connection failed"));

    const { consumeResults } = proxyquire("../../src/message-queue/consumer", {
      amqplib: { connect: failingConnectStub },
      "./const": { EXCHANGE_NAME: "x" },
      "../const": { RABBITMQ_URL: "y" },
    });

    await consumeResults();

    expect(consoleErrorStub.calledWithMatch("Failed to connect to RabbitMQ:")).to.be.true;
    expect(processExitStub.calledWith(1)).to.be.true;

    consoleErrorStub.restore();
    processExitStub.restore();
  });

  it("should log error when message processing fails", async () => {
    const EXCHANGE_NAME = "my.exchange";
    const RABBITMQ_URL = "amqp://localhost";

    let consumeCallback: ((msg: any) => void) | undefined;

    consumeStub.callsFake((_queue, cb) => {
      consumeCallback = cb;
    });

    // Tym razem ack rzuca wyjątek
    const fakeError = new Error("ack failed");
    ackStub.throws(fakeError);

    const consoleErrorStub = sinon.stub(console, "error");

    const { consumeResults } = proxyquire("../../src/message-queue/consumer", {
      amqplib: { connect: connectStub },
      "./const": { EXCHANGE_NAME },
      "../const": { RABBITMQ_URL },
    });

    await consumeResults();

    const fakeMsg = { content: Buffer.from("fail"), fields: {}, properties: {} };
    consumeCallback?.(fakeMsg);

    expect(ackStub.calledWith(fakeMsg)).to.be.true;
    expect(consoleErrorStub.calledWith("Error processing message:", fakeError)).to.be.true;

    consoleErrorStub.restore();
  });
});
