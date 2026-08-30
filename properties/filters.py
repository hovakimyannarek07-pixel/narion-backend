import django_filters as df

from .models import Property


class PropertyFilter(df.FilterSet):
    min_price = df.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = df.NumberFilter(field_name="price", lookup_expr="lte")
    min_area = df.NumberFilter(field_name="area_sqm", lookup_expr="gte")
    max_area = df.NumberFilter(field_name="area_sqm", lookup_expr="lte")

    region = df.NumberFilter(field_name="district__city__region_id")
    city = df.NumberFilter(field_name="district__city_id")
    district = df.NumberFilter(field_name="district_id")

    rooms = df.NumberFilter(field_name="rooms")
    bedrooms = df.NumberFilter(field_name="bedrooms")
    bathrooms = df.NumberFilter(field_name="bathrooms")

    parking = df.BooleanFilter(field_name="has_parking")
    furnished = df.BooleanFilter(field_name="is_furnished")
    balcony = df.BooleanFilter(field_name="has_balcony")
    terrace = df.BooleanFilter(field_name="has_terrace")
    pool = df.BooleanFilter(field_name="has_pool")
    elevator = df.BooleanFilter(field_name="has_elevator")
    security = df.BooleanFilter(field_name="has_security")
    renovated = df.BooleanFilter(field_name="is_renovated")

    # Map viewport bounding box
    min_lat = df.NumberFilter(field_name="latitude", lookup_expr="gte")
    max_lat = df.NumberFilter(field_name="latitude", lookup_expr="lte")
    min_lng = df.NumberFilter(field_name="longitude", lookup_expr="gte")
    max_lng = df.NumberFilter(field_name="longitude", lookup_expr="lte")

    search = df.CharFilter(method="filter_search")

    class Meta:
        model = Property
        fields = [
            "listing_type", "market_type", "property_type", "developer", "project",
        ]

    def filter_search(self, queryset, name, value):
        from django.db.models import Q
        return queryset.filter(
            Q(title_en__icontains=value)
            | Q(title_ru__icontains=value)
            | Q(title_hy__icontains=value)
            | Q(address__icontains=value)
            | Q(district__name__icontains=value)
            | Q(district__city__name__icontains=value)
            | Q(developer__name__icontains=value)
            | Q(project__name__icontains=value)
        )
