#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

touch /var/log/cron.log
printenv | grep -Ev 'BASHOPTS|BASH_VERSINFO|EUID|PPID|SHELLOPTS|UID|LANG|PWD|GPG_KEY|_=' >> /etc/environment

python manage.py crontab remove
python manage.py crontab add
service cron start

python manage.py migrate

python manage.py collectstatic --no-input

gunicorn -c gunicorn.py 

exec "$@"