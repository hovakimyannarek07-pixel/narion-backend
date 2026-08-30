FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py shell -c \"import os; from django.contrib.auth import get_user_model; User=get_user_model(); username=os.environ.get('DJANGO_SUPERUSER_USERNAME'); username and (User.objects.filter(username=username).exists() or User.objects.create_superuser(username=username, email=os.environ.get('DJANGO_SUPERUSER_EMAIL',''), password=os.environ['DJANGO_SUPERUSER_PASSWORD']))\" && gunicorn narion_backend.wsgi --bind 0.0.0.0:8000"]
