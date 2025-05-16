python -m black .
python -m pylint . --recursive=true

PYTHONUNBUFFERED=1 python -m main

docker build -t loopedupl/python-sandbox:latest sandbox/python
docker push loopedupl/python-sandbox:latest
