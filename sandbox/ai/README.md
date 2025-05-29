python -m black .
python -m pylint . --recursive=true

pytest
coverage run -m pytest

PYTHONUNBUFFERED=1 python -m main

docker build -t loopedupl/ai-sandbox:latest sandbox/ai
docker push loopedupl/ai-sandbox:latest
