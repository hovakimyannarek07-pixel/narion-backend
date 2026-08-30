from rest_framework import viewsets, permissions, generics
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Region, City, District, Developer, Project, Agent,
    Property, Favorite, Inquiry,
)
from .filters import PropertyFilter
from .serializers import (
    RegionSerializer, CitySerializer, DistrictSerializer,
    DeveloperSerializer, ProjectSerializer, AgentSerializer,
    PropertyListSerializer, PropertyDetailSerializer, PropertyWriteSerializer,
    PropertyMapSerializer, FavoriteSerializer, InquirySerializer,
)


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.select_related("region").all()
    serializer_class = CitySerializer
    filterset_fields = ["region"]


class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.select_related("city").all()
    serializer_class = DistrictSerializer
    filterset_fields = ["city"]


class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related("developer", "district").all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["developer", "district"]


class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PropertyViewSet(viewsets.ModelViewSet):
    """
    Public: list (catalog, combinable filters) + retrieve (full detail page).
    Authenticated (admin/staff): create/update/delete.
    """
    queryset = Property.objects.filter(is_published=True).select_related(
        "district", "district__city", "developer", "project", "agent"
    ).prefetch_related("images", "videos")
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PropertyFilter

    def get_queryset(self):
        qs = super().get_queryset()
        # Staff can see unpublished/draft properties too (for the admin dashboard)
        if self.request.user.is_staff:
            qs = Property.objects.all().select_related(
                "district", "district__city", "developer", "project", "agent"
            ).prefetch_related("images", "videos")
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return PropertyListSerializer
        if self.action == "retrieve":
            return PropertyDetailSerializer
        return PropertyWriteSerializer


class PropertyMapView(generics.ListAPIView):
    """
    GET /api/properties/map/?min_lat=&max_lat=&min_lng=&max_lng=&...filters
    Lightweight payload for map markers — never returns full property objects.
    """
    queryset = Property.objects.filter(is_published=True).select_related("district")
    serializer_class = PropertyMapSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PropertyFilter
    pagination_class = None


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class InquiryViewSet(viewsets.ModelViewSet):
    serializer_class = InquirySerializer
    queryset = Inquiry.objects.all()

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
