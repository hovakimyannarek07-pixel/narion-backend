from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegionViewSet, CityViewSet, DistrictViewSet,
    DeveloperViewSet, ProjectViewSet, AgentViewSet,
    PropertyViewSet, PropertyMapView, FavoriteViewSet, InquiryViewSet,
)

router = DefaultRouter()
router.register("regions", RegionViewSet)
router.register("cities", CityViewSet)
router.register("districts", DistrictViewSet)
router.register("developers", DeveloperViewSet)
router.register("projects", ProjectViewSet)
router.register("agents", AgentViewSet)
router.register("properties", PropertyViewSet, basename="property")
router.register("favorites", FavoriteViewSet, basename="favorite")
router.register("inquiries", InquiryViewSet, basename="inquiry")

urlpatterns = [
    # Must come before the router's properties/<pk> pattern
    path("properties/map/", PropertyMapView.as_view(), name="property-map"),
    path("", include(router.urls)),
]
