import amqp from "amqplib";

import { RABBITMQ_URL } from "../const";
import { sendDataToClient } from "../ws";
import { QUEUE_NAME, EXCHANGE_NAME } from "./const";

const ROUTING_KEY = "results.*.*";

export async function consumeResults() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Assert the exchange (topic)
    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });

    const q = await channel.assertQueue(QUEUE_NAME, {
      durable: true,
      exclusive: false,
    });

    // Bind the queue to the exchange with wildcard routing key
    await channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEY);

    // Start consuming the messages
    console.log(`Consumer is waiting for messages from the result queue: ${q.queue}`);
    channel.consume(q.queue, async (msg) => {
      if (msg) {
        console.log("Received message:", msg.content.toString());
        try {
          sendDataToClient(msg);
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
