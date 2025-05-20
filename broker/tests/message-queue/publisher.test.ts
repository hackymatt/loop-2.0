import { expect } from "chai";
import sinon from "sinon";
import proxyquire from "proxyquire";

describe("publisher.ts", () => {
  let amqpMock: any;
  let uuidStub: sinon.SinonStub;
  let getSandboxNameStub: sinon.SinonStub;
  let publisher: any;
  let channelMock: any;
  let connectionMock: any;

  beforeEach(() => {
    channelMock = {
      assertExchange: sinon.stub().resolves(),
      assertQueue: sinon.stub().resolves({ queue: "reply-queue" }),
      consume: sinon.stub(),
      publish: sinon.stub().returns(true),
    };

    connectionMock = {
      createChannel: sinon.stub().resolves(channelMock),
      close: sinon.stub(),
    };

    amqpMock = {
      connect: sinon.stub().resolves(connectionMock),
    };

    uuidStub = sinon.stub();
    uuidStub.onFirstCall().returns("job-uuid");
    uuidStub.onSecondCall().returns("corr-uuid");

    getSandboxNameStub = sinon.stub().returns("python");

    publisher = proxyquire("../../src/message-queue/publisher", {
      amqplib: amqpMock,
      uuid: { v4: uuidStub },
      "./const": { EXCHANGE_NAME: "test-exchange" },
      "../const": { RABBITMQ_URL: "amqp://test" },
      "../sandbox": { getSandboxName: getSandboxNameStub },
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should publish with reply and resolve on correct correlationId", async () => {
    // Setup consume callback before making the publish call
    let consumeCallback: Function | null = null;
    channelMock.consume.callsFake((_queue: string, cb: Function) => {
      consumeCallback = cb;
      return Promise.resolve();
    });

    // Track the correlationId that will be used in the publish call
    let publishCorrelationId: string | undefined;
    channelMock.publish.callsFake(
      (_exchange: string, _routing: string, _buffer: Buffer, options: any) => {
        publishCorrelationId = options.correlationId;
        return true;
      }
    );

    const publishPromise = publisher.publish(
      "user1",
      "job1",
      "python",
      10,
      "run",
      { "main.py": "print(1)" },
      false,
      true
    );

    // Wait for the next tick to allow consume to be set up
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify consume was set up
    expect(consumeCallback).to.not.be.null;
    expect(publishCorrelationId).to.not.be.undefined;

    // Simulate receiving a message with the actual correlationId
    (consumeCallback as unknown as Function)({
      properties: { correlationId: publishCorrelationId },
      content: Buffer.from(JSON.stringify({ result: "ok" })),
    });

    const result = await publishPromise;
    expect(result).to.deep.equal({ result: "ok" });

    // Verify all the calls
    expect(getSandboxNameStub.calledWith("python")).to.be.true;
    expect(amqpMock.connect.calledWith("amqp://test")).to.be.true;
    expect(channelMock.assertExchange.calledWith("test-exchange", "topic", { durable: true })).to.be
      .true;
    expect(channelMock.assertQueue.calledWith("", { exclusive: true })).to.be.true;
    expect(
      channelMock.publish.calledWith(
        "test-exchange",
        "jobs.python.user1",
        sinon.match.instanceOf(Buffer),
        sinon.match({
          persistent: true,
          correlationId: publishCorrelationId,
          replyTo: "reply-queue",
        })
      )
    ).to.be.true;
  });

  it("should publish without reply and return jobId", async () => {
    const result = await publisher.publish(
      "user2",
      "job2",
      "python",
      10,
      "run",
      { "main.py": "print(2)" },
      false,
      false
    );

    expect(result).to.deep.equal({ jobId: "job2" });
    expect(getSandboxNameStub.calledWith("python")).to.be.true;
    expect(amqpMock.connect.calledWith("amqp://test")).to.be.true;
    expect(channelMock.assertExchange.calledWith("test-exchange", "topic", { durable: true })).to.be
      .true;
    expect(
      channelMock.publish.calledWith(
        "test-exchange",
        "jobs.python.user2",
        sinon.match.instanceOf(Buffer),
        sinon.match({ persistent: true })
      )
    ).to.be.true;
  });

  it("should publish with stream=true", async () => {
    const result = await publisher.publish(
      "user3",
      "job3",
      "python",
      10,
      "run",
      { "main.py": "print(3)" },
      true, // explicitly testing stream=true
      false
    );

    expect(result).to.deep.equal({ jobId: "job3" });
    expect(
      channelMock.publish.calledWith(
        "test-exchange",
        "jobs.python.user3",
        sinon.match((buffer: Buffer) => {
          const payload = JSON.parse(buffer.toString());
          return payload.stream === true;
        }),
        sinon.match({ persistent: true })
      )
    ).to.be.true;
  });

  it("should publish with default parameters", async () => {
    // Setup consume callback before making the publish call
    let consumeCallback: Function | null = null;
    channelMock.consume.callsFake((_queue: string, cb: Function) => {
      consumeCallback = cb;
      return Promise.resolve();
    });

    // Track the correlationId that will be used in the publish call
    let publishCorrelationId: string | undefined;
    channelMock.publish.callsFake(
      (_exchange: string, _routing: string, _buffer: Buffer, options: any) => {
        publishCorrelationId = options.correlationId;
        return true;
      }
    );

    const publishPromise = publisher.publish(
      "user4",
      "job4",
      "python",
      10,
      "run",
      { "main.py": "print(4)" }
      // Let stream and useReply use their default values
    );

    // Wait for the next tick to allow consume to be set up
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify consume was set up
    expect(consumeCallback).to.not.be.null;
    expect(publishCorrelationId).to.not.be.undefined;

    // Simulate receiving a message with the actual correlationId
    (consumeCallback as unknown as Function)({
      properties: { correlationId: publishCorrelationId },
      content: Buffer.from(JSON.stringify({ result: "ok" })),
    });

    const result = await publishPromise;
    expect(result).to.deep.equal({ result: "ok" });

    expect(
      channelMock.publish.calledWith(
        "test-exchange",
        "jobs.python.user4",
        sinon.match((buffer: Buffer) => {
          const payload = JSON.parse(buffer.toString());
          return payload.stream === false;
        }),
        sinon.match({
          persistent: true,
          correlationId: publishCorrelationId,
          replyTo: "reply-queue",
        })
      )
    ).to.be.true;
  });

  it("should ignore messages without properties", async () => {
    let consumeCallback: Function | null = null;
    channelMock.consume.callsFake((_queue: string, cb: Function) => {
      consumeCallback = cb;
      return Promise.resolve();
    });

    // Track the correlationId that will be used in the publish call
    let publishCorrelationId: string | undefined;
    channelMock.publish.callsFake(
      (_exchange: string, _routing: string, _buffer: Buffer, options: any) => {
        publishCorrelationId = options.correlationId;
        return true;
      }
    );

    const publishPromise = publisher.publish(
      "user5",
      "job5",
      "python",
      10,
      "run",
      { "main.py": "print(5)" },
      false,
      true
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(consumeCallback).to.not.be.null;
    expect(publishCorrelationId).to.not.be.undefined;

    // Simulate receiving a message with undefined msg object
    (consumeCallback as unknown as Function)(undefined);

    // Simulate receiving a message without correlationId
    (consumeCallback as unknown as Function)({
      properties: {},
      content: Buffer.from(JSON.stringify({ result: "wrong" })),
    });

    // Simulate receiving a message with wrong correlationId
    (consumeCallback as unknown as Function)({
      properties: { correlationId: "wrong-id" },
      content: Buffer.from(JSON.stringify({ result: "wrong" })),
    });

    // Simulate receiving a valid message with correct correlationId
    (consumeCallback as unknown as Function)({
      properties: { correlationId: publishCorrelationId },
      content: Buffer.from(JSON.stringify({ result: "ok" })),
    });

    const result = await publishPromise;
    expect(result).to.deep.equal({ result: "ok" });
  });
});
