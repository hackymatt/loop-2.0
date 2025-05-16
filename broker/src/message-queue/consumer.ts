import amqp from "amqplib";

import { EXCHANGE_NAME } from "./const";
import { RABBITMQ_URL } from "../const";

const RESULT_QUEUE = `results.*.*`;

export async function consumeResults() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Assert the exchange (direct)
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });

    // Assert the result queue
    await channel.assertQueue(RESULT_QUEUE, { durable: true });

    // Bind the result queue to the exchange
    await channel.bindQueue(RESULT_QUEUE, EXCHANGE_NAME, RESULT_QUEUE);

    // Start consuming the messages
    console.log(`Consumer is waiting for messages from the result queue: ${RESULT_QUEUE}`);
    channel.consume(RESULT_QUEUE, async (msg) => {
      if (msg) {
        try {
          channel.ack(msg); // Acknowledge the message
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    process.exit(1);
  }
}
