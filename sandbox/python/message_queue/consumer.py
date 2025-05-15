from .channel import QUEUE_NAME, setup_channel


def start_consumer(callback, consume=True):
    channel = setup_channel()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)

    if consume:
        channel.start_consuming()  # pragma: no cover
