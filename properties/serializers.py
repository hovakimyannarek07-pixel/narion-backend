from rest_framework import serializers

from .models import (
    Region, City, District, Developer, Project, Agent,
    Property, PropertyImage, PropertyVideo, Favorite, Inquiry,
)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ["id", "name"]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name", "region"]


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ["id", "name", "city"]


class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ["id", "name", "logo", "description", "phone", "email"]


class ProjectSerializer(serializers.ModelSerializer):
    developer = DeveloperSerializer(read_only=True)
    developer_id = serializers.PrimaryKeyRelatedField(
        queryset=Developer.objects.all(), source="developer", write_only=True
    )

    class Meta:
        model = Project
        fields = ["id", "name", "description", "district", "cover_image", "completion_date", "developer", "developer_id"]


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ["id", "name", "phone", "email", "photo"]


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image", "is_main", "order"]


class PropertyVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyVideo
        fields = ["id", "video", "order"]


class PropertyListSerializer(serializers.ModelSerializer):
    """Used for catalog/list views — the property-card payload."""
    title = serializers.CharField(read_only=True)
    primary_image = serializers.SerializerMethodField()
    district_name = serializers.CharField(source="district.name", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id", "title", "primary_image", "district_name", "price", "currency",
            "area_sqm", "rooms", "bedrooms", "listing_type", "market_type",
            "property_type", "is_featured",
        ]

    def get_primary_image(self, obj):
        return obj.primary_image_url


class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    videos = PropertyVideoSerializer(many=True, read_only=True)
    developer = DeveloperSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    agent = AgentSerializer(read_only=True)
    district = DistrictSerializer(read_only=True)
    title = serializers.CharField(read_only=True)

    class Meta:
        model = Property
        fields = "__all__"


class PropertyWriteSerializer(serializers.ModelSerializer):
    """Used by admin/API clients to create or update a property."""

    class Meta:
        model = Property
        fields = "__all__"


class PropertyMapSerializer(serializers.ModelSerializer):
    """Lightweight payload for map markers — keep this small."""
    title = serializers.CharField(read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id", "latitude", "longitude", "title", "price", "currency",
            "area_sqm", "primary_image", "market_type",
        ]

    def get_primary_image(self, obj):
        return obj.primary_image_url


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["id", "property", "created_at"]
        read_only_fields = ["user"]


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ["id", "property", "name", "phone", "email", "message", "created_at"]
        read_only_fields = ["is_resolved", "created_at"]
