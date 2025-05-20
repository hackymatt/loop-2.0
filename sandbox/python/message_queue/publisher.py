import json
import pika

from .channel import RESULT_QUEUE, EXCHANGE_NAME


def publish(channel, result, job_id, props=None):
    print(f"Sending result to broker for job {job_id}")
    routing_key = props.reply_to if props and props.reply_to else RESULT_QUEUE
    try:
        response_message = json.dumps({"job_id": job_id, "result": result})

        channel.basic_publish(
            exchange=EXCHANGE_NAME,
            routing_key=routing_key,
            properties=pika.BasicProperties(
                correlation_id=props.correlation_id if props else None, delivery_mode=2
            ),
            body=response_message,
        )
        print(f"Result for job {job_id} sent to {routing_key}")
    except Exception as error:
        print(f"Error sending result: {error}")
