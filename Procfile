web: gunicorn narion_backend.wsgi --bind 0.0.0.0:$PORT --log-file -
release: python manage.py migrate --noinput
