# Narion Backend (Django + DRF + PostgreSQL + Cloudinary)

## Local development
```bash
cp .env.example .env   # fill in real values
docker compose up --build
docker compose exec web python manage.py migrate
docker compose exec web python manage.py createsuperuser
docker compose exec web python manage.py seed_demo
```
API: http://localhost:8000/api/
Admin: http://localhost:8000/admin/
Docs: http://localhost:8000/api/docs/

## Key endpoints
- `GET /api/properties/` — catalog (filterable, paginated)
- `GET /api/properties/{id}/` — full property page
- `GET /api/properties/map/?min_lat=&max_lat=&min_lng=&max_lng=` — lightweight map markers
- `GET /api/developers/`, `/api/projects/`, `/api/agents/`
- `GET /api/regions/`, `/api/cities/`, `/api/districts/`
- `POST /api/inquiries/` — contact/inquiry form
- `/admin/` — manage everything (properties, photos, videos, developers, projects, locations)
- `/api/docs/` — Swagger UI

## Filters (combinable, on /api/properties/ and /api/properties/map/)
`listing_type`, `market_type`, `property_type`, `region`, `city`, `district`,
`min_price`, `max_price`, `min_area`, `max_area`, `rooms`, `bedrooms`, `bathrooms`,
`parking`, `furnished`, `balcony`, `terrace`, `pool`, `elevator`, `security`, `renovated`,
`search`, and for the map: `min_lat`, `max_lat`, `min_lng`, `max_lng`.

## Environment variables (set on Railway)
See `.env.example`. `DATABASE_URL` and Cloudinary vars are required in production.
