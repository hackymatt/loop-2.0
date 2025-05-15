import json
import os
import sys
from dotenv import load_dotenv

from message_queue.consumer import start_consumer
from message_queue.publisher import publish
from utils import process_job

load_dotenv()

USER_ID = os.getenv("USER_ID")

if not USER_ID:
    print(
        "Error: USER_ID environment variable is required.", file=sys.stderr
    )  # pragma: no cover
    sys.exit(1)  # pragma: no cover


def callback(channel, method, properties, body):
    try:
        payload = json.loads(body)
        job_id = payload.get("job_id")
        print(f"Received job {job_id} message")

        result = process_job(body)

        if isinstance(result, dict):
            publish(channel, result, job_id, properties)
        else:
            for partial in result:
                publish(channel, partial, job_id, properties)

        channel.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as error:
        print("Callback error:", str(error))
        channel.basic_ack(delivery_tag=method.delivery_tag)


def main():
    start_consumer(callback)  # pragma: no cover


if __name__ == "__main__":
    main()  # pragma: no cover
