import json
import pika

from .channel import RESULT_QUEUE


def publish(channel, result, job_id, props=None):
    print(f"Sending result to broker for job {job_id}")
    try:
        response_message = json.dumps(result)

        channel.basic_publish(
            exchange="",
            routing_key=props.reply_to if props and props.reply_to else RESULT_QUEUE,
            properties=pika.BasicProperties(
                correlation_id=props.correlation_id if props else None, delivery_mode=2
            ),
            body=response_message,
        )
        print(
            f"Result for job {job_id} sent to {props.reply_to if props else RESULT_QUEUE}"
        )
    except Exception as error:
        print(f"Error sending result: {error}")
