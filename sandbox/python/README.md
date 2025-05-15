python -m black .
python -m pylint . --recursive=true

PYTHONUNBUFFERED=1 python -m main
