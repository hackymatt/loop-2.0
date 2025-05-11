from .channel import QUEUE_NAME, setup_channel


def start_consumer(callback):
    channel = setup_channel()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
    print(f"Waiting for messages in {QUEUE_NAME}. To exit press CTRL+C")

    channel.start_consuming()
