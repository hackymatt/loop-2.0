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
    print("Error: USER_ID environment variable is required.", file=sys.stderr)
    sys.exit(1)


def callback(ch, method, properties, body):
    try:
        payload = json.loads(body)
        job_id = payload.get("job_id")
        print(f"Received job {job_id} message")

        result = process_job(body)

        if isinstance(result, dict):
            publish(ch, result, job_id, properties)
        else:
            for partial in result:
                publish(ch, partial, job_id, properties)

        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print("Callback error:", str(e))
        ch.basic_ack(delivery_tag=method.delivery_tag)


def main():
    start_consumer(callback)

if __name__ == "__main__":
    main()
