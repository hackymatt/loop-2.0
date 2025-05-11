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
    console.log(
      `Consumer is waiting for messages from the result queue: ${RESULT_QUEUE}`
    );
    channel.consume(RESULT_QUEUE, async (msg) => {
      if (msg) {
        const messageContent = msg.content.toString();
        try {
          const result = JSON.parse(messageContent);
          handleResult(result, msg.fields.routingKey); // Process the result
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

// Function to handle the result (you can modify this as needed)
function handleResult(result: any, routingKey: string) {
  // Extract runner and userId from the routingKey
  const [_, runner, userId] = routingKey.split(".");

  console.log(`Received result for runner: ${runner}, userId: ${userId}`);
  console.log("Result:", JSON.stringify(result, null, 2));

  // You can process or store the result based on the extracted runner and userId
  // For example, update a database or trigger another workflow
}
