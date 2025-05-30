import amqp from "amqplib";
import { v4 as uuid } from "uuid";

import { EXCHANGE_NAME } from "./const";
import { RABBITMQ_URL } from "../const";
import { getSandboxName } from "../sandbox";

import type { Technology } from "../sandbox";

type File = { name: string; path: string | null; code: string };

type Payload = {
  jobId: string;
  command: string;
  timeout: number;
  files: File[];
  technology: Technology;
  language: string;
};

type MessagePayload = Omit<Payload, "jobId"> & { job_id: string; stream: boolean };
export async function publish(
  userId: string,
  payload: Payload,
  stream: boolean = false,
  useReply: boolean = true
): Promise<Pick<Payload, "jobId">> {
  const { jobId, technology, ...rest } = payload;

  const sandboxName = getSandboxName(technology);

  const messagePayload: MessagePayload = {
    ...rest,
    technology,
    job_id: jobId,
    stream,
  };

  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });

  const routingKey = `jobs.${sandboxName}.${userId}`;

  if (useReply) {
    // temporary queue + correlationId + replyTo
    const correlationId = uuid();
    const { queue: replyQueue } = await channel.assertQueue("", {
      exclusive: true,
    });

    return new Promise((resolve, reject) => {
      channel.consume(
        replyQueue,
        (msg) => {
          if (msg?.properties.correlationId === correlationId) {
            const result = JSON.parse(msg.content.toString());
            resolve(result);
            setTimeout(() => connection.close(), 500);
          }
        },
        { noAck: true }
      );

      channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(messagePayload)), {
        persistent: true,
        correlationId,
        replyTo: replyQueue,
      });
    });
  } else {
    // no replyTo — results will go to persistent results queue
    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(messagePayload)), {
      persistent: true,
    });

    setTimeout(() => connection.close(), 500);
    return { jobId };
  }
}
