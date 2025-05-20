import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";
import { QUEUE_NAME } from "../../src/message-queue/const";

describe("consumer.ts", () => {
  let connectStub: sinon.SinonStub;
  let createChannelStub: sinon.SinonStub;
  let assertExchangeStub: sinon.SinonStub;
  let assertQueueStub: sinon.SinonStub;
  let bindQueueStub: sinon.SinonStub;
  let consumeStub: sinon.SinonStub;
  let ackStub: sinon.SinonStub;
  let sendDataToClientStub: sinon.SinonStub;

  const fakeChannel = {} as any;
  const fakeConnection = {} as any;

  beforeEach(() => {
    assertExchangeStub = sinon.stub().resolves();
    assertQueueStub = sinon.stub().resolves({
      queue: QUEUE_NAME,
      messageCount: 0,
      consumerCount: 0,
    });
    bindQueueStub = sinon.stub().resolves();
    ackStub = sinon.stub();
    consumeStub = sinon.stub();
    sendDataToClientStub = sinon.stub();

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
    const ROUTING_KEY = "results.*.*";
    const QUEUE_NAME = "results_queue";
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
      "../ws": { sendDataToClient: sendDataToClientStub },
    });

    await consumeResults();

    expect(connectStub.calledWith(RABBITMQ_URL)).to.be.true;
    expect(assertExchangeStub.calledWith(EXCHANGE_NAME, "topic", { durable: true })).to.be.true;
    expect(
      assertQueueStub.calledWith(QUEUE_NAME, {
        durable: true,
        exclusive: false,
      })
    ).to.be.true;
    expect(bindQueueStub.calledWith(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY)).to.be.true;
    expect(consumeStub.calledWith(QUEUE_NAME)).to.be.true;

    const fakeMsg = { content: Buffer.from("test"), fields: {}, properties: {} };
    consumeCallback?.(fakeMsg);

    expect(sendDataToClientStub.calledWith(fakeMsg)).to.be.true;
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
      "../ws": { sendDataToClient: sendDataToClientStub },
    });

    await consumeResults();

    const fakeMsg = { content: Buffer.from("fail"), fields: {}, properties: {} };
    sendDataToClientStub.throws(new Error("WebSocket error"));
    consumeCallback?.(fakeMsg);

    expect(consoleErrorStub.calledWith("Error processing message:", sinon.match.any)).to.be.true;
    expect(ackStub.called).to.be.false;

    consoleErrorStub.restore();
  });
});
