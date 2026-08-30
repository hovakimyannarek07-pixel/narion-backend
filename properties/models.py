from django.conf import settings
from django.db import models


# ---------------------------------------------------------------------------
# Location hierarchy: Region -> City -> District
# ---------------------------------------------------------------------------

class Region(models.Model):
    name = models.CharField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class City(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="cities")
    name = models.CharField(max_length=120)

    class Meta:
        ordering = ["name"]
        unique_together = ("region", "name")

    def __str__(self):
        return self.name


class District(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="districts")
    name = models.CharField(max_length=120)

    class Meta:
        ordering = ["name"]
        unique_together = ("city", "name")

    def __str__(self):
        return f"{self.name}, {self.city.name}"


# ---------------------------------------------------------------------------
# Developers & Projects (new-build / primary market)
# ---------------------------------------------------------------------------

class Developer(models.Model):
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to="developers/logos/", blank=True, null=True)
    description = models.TextField(blank=True)
    phone = models.CharField(max_length=40, blank=True)
    email = models.EmailField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Project(models.Model):
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name="projects")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True, related_name="projects")
    cover_image = models.ImageField(upload_to="projects/covers/", blank=True, null=True)
    completion_date = models.DateField(blank=True, null=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.name


# ---------------------------------------------------------------------------
# Agents
# ---------------------------------------------------------------------------

class Agent(models.Model):
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=40, blank=True)
    email = models.EmailField(blank=True)
    photo = models.ImageField(upload_to="agents/photos/", blank=True, null=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


# ---------------------------------------------------------------------------
# Property
# ---------------------------------------------------------------------------

class Property(models.Model):
    MARKET_PRIMARY = "primary"
    MARKET_SECONDARY = "secondary"
    MARKET_CHOICES = [(MARKET_PRIMARY, "Primary"), (MARKET_SECONDARY, "Secondary")]

    LISTING_SALE = "sale"
    LISTING_RENT = "rent"
    LISTING_CHOICES = [(LISTING_SALE, "Sale"), (LISTING_RENT, "Rent")]

    PROPERTY_TYPE_CHOICES = [
        ("apartment", "Apartment"),
        ("house", "House"),
        ("villa", "Villa"),
        ("penthouse", "Penthouse"),
        ("townhouse", "Townhouse"),
        ("cottage", "Cottage"),
        ("commercial", "Commercial"),
        ("office", "Office"),
        ("land", "Land"),
        ("hotel", "Hotel"),
    ]

    CURRENCY_CHOICES = [("AMD", "AMD"), ("USD", "USD"), ("EUR", "EUR"), ("RUB", "RUB")]

    # Multilingual content (hy / ru / en / es)
    title_hy = models.CharField(max_length=255, blank=True)
    title_ru = models.CharField(max_length=255, blank=True)
    title_en = models.CharField(max_length=255, blank=True)
    title_es = models.CharField(max_length=255, blank=True)

    description_hy = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_es = models.TextField(blank=True)

    listing_type = models.CharField(max_length=10, choices=LISTING_CHOICES, db_index=True)
    market_type = models.CharField(max_length=10, choices=MARKET_CHOICES, db_index=True)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES, db_index=True)

    district = models.ForeignKey(District, on_delete=models.PROTECT, related_name="properties")
    address = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(db_index=True)
    longitude = models.FloatField(db_index=True)

    price = models.DecimalField(max_digits=14, decimal_places=2, db_index=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="AMD")

    area_sqm = models.FloatField(null=True, blank=True, db_index=True)
    rooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bathrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    floor = models.PositiveSmallIntegerField(null=True, blank=True)
    total_floors = models.PositiveSmallIntegerField(null=True, blank=True)

    # Features
    has_parking = models.BooleanField(default=False)
    is_furnished = models.BooleanField(default=False)
    has_balcony = models.BooleanField(default=False)
    has_terrace = models.BooleanField(default=False)
    has_pool = models.BooleanField(default=False)
    has_elevator = models.BooleanField(default=False)
    has_security = models.BooleanField(default=False)
    is_renovated = models.BooleanField(default=False)

    developer = models.ForeignKey(Developer, on_delete=models.SET_NULL, null=True, blank=True, related_name="properties")
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="properties")
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, blank=True, related_name="properties")

    is_published = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Properties"

    def __str__(self):
        return self.title_en or self.title_ru or self.title_hy or f"Property #{self.pk}"

    @property
    def title(self):
        return self.title_en or self.title_ru or self.title_hy or self.title_es

    @property
    def primary_image_url(self):
        first = self.images.order_by("order").first()
        return first.image.url if first and first.image else None


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="properties/images/")
    is_main = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Image #{self.pk} for {self.property_id}"


class PropertyVideo(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="videos")
    video = models.FileField(upload_to="properties/videos/")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Video #{self.pk} for {self.property_id}"


# ---------------------------------------------------------------------------
# User interactions
# ---------------------------------------------------------------------------

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "property")


class Inquiry(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="inquiries")
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=40, blank=True)
    email = models.EmailField(blank=True)
    message = models.TextField(blank=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Inquiries"

    def __str__(self):
        return f"Inquiry from {self.name} about #{self.property_id}"
