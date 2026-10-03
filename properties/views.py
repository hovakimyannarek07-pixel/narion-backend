import os

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

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

User = get_user_model()


def _user_payload(user):
    return {
        "id": user.id,
        "email": user.email or user.username,
        "name": user.first_name or "",
        "is_staff": user.is_staff,
    }


class PublicConfigView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        whatsapp = "".join(ch for ch in os.getenv("WHATSAPP_NUMBER", "") if ch.isdigit())
        return Response({
            "whatsapp_number": whatsapp,
            "yandex_maps_api_key": os.getenv("YANDEX_MAPS_API_KEY", "").strip(),
        })


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))
        name = str(request.data.get("name", "")).strip()

        if not email or "@" not in email:
            return Response({"email": ["Enter a valid email address."]}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({"password": ["Password is required."]}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username__iexact=email).exists():
            return Response({"email": ["An account with this email already exists."]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except DjangoValidationError as exc:
            return Response({"password": list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name[:150],
        )
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": _user_payload(user)}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))
        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": _user_payload(user)})


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"user": _user_payload(request.user)})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
