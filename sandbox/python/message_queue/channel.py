import os
import pika
from dotenv import load_dotenv

load_dotenv()

# Configuration from environment
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")

USER_ID = os.getenv("USER_ID")
EXCHANGE_NAME = "sandboxExchange"
RUNNER_NAME = "python-sandbox"
ROUTING_KEY = QUEUE_NAME = f"jobs.{RUNNER_NAME}.{USER_ID}"
RESULT_QUEUE = f"results.{RUNNER_NAME}.{USER_ID}"


def setup_channel():
    print(f"Connecting to RabbitMQ at {RABBITMQ_HOST}")
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=credentials
        )
    )
    channel = connection.channel()

    # Declare the exchange for job messages
    channel.exchange_declare(
        exchange=EXCHANGE_NAME, exchange_type="topic", durable=True
    )
    print(f"Exchange {EXCHANGE_NAME} declared")

    # Declare the sandbox queue (required before binding)
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    print(f"Queue {QUEUE_NAME} declared")

    # Bind the sandbox queue to the exchange
    channel.queue_bind(
        exchange=EXCHANGE_NAME, queue=QUEUE_NAME, routing_key=ROUTING_KEY
    )
    print(
        f"Queue {QUEUE_NAME} bound to exchange {EXCHANGE_NAME} with routing key {ROUTING_KEY}"
    )

    # Optional: declare result queue if you're planning to send results (not consume here)
    # You might instead publish to it from process_job
    channel.queue_declare(queue=RESULT_QUEUE, durable=True)
    print(f"Result queue {RESULT_QUEUE} declared")

    return channel
