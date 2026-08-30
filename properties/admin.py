from django.contrib import admin

from .models import (
    Region, City, District, Developer, Project, Agent,
    Property, PropertyImage, PropertyVideo, Favorite, Inquiry,
)


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ["image", "is_main", "order"]


class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 0
    fields = ["video", "order"]


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        "id", "title", "market_type", "listing_type", "property_type",
        "district", "price", "currency", "is_published", "is_featured", "created_at",
    ]
    list_filter = [
        "market_type", "listing_type", "property_type", "is_published",
        "is_featured", "district__city", "currency",
    ]
    search_fields = ["title_en", "title_ru", "title_hy", "address"]
    list_editable = ["is_published", "is_featured"]
    autocomplete_fields = ["district", "developer", "project", "agent"]
    inlines = [PropertyImageInline, PropertyVideoInline]
    fieldsets = (
        ("Titles (multilingual)", {
            "fields": (("title_hy", "title_ru"), ("title_en", "title_es")),
        }),
        ("Descriptions", {
            "fields": (("description_hy", "description_ru"), ("description_en", "description_es")),
            "classes": ("collapse",),
        }),
        ("Classification", {
            "fields": ("listing_type", "market_type", "property_type", "is_published", "is_featured"),
        }),
        ("Location", {
            "fields": ("district", "address", ("latitude", "longitude")),
        }),
        ("Price & size", {
            "fields": (("price", "currency"), "area_sqm", ("rooms", "bedrooms", "bathrooms"), ("floor", "total_floors")),
        }),
        ("Features", {
            "fields": (
                ("has_parking", "is_furnished", "has_balcony", "has_terrace"),
                ("has_pool", "has_elevator", "has_security", "is_renovated"),
            ),
            "classes": ("collapse",),
        }),
        ("Relations", {
            "fields": ("developer", "project", "agent"),
        }),
    )


@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ["name", "phone", "email"]
    search_fields = ["name"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "developer", "district", "completion_date"]
    list_filter = ["developer", "district__city"]
    search_fields = ["name"]
    autocomplete_fields = ["developer", "district"]


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ["name", "phone", "email"]
    search_fields = ["name"]


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    search_fields = ["name"]


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ["name", "region"]
    list_filter = ["region"]
    search_fields = ["name"]
    autocomplete_fields = ["region"]


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ["name", "city"]
    list_filter = ["city__region", "city"]
    search_fields = ["name"]
    autocomplete_fields = ["city"]


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ["name", "property", "phone", "email", "is_resolved", "created_at"]
    list_filter = ["is_resolved", "created_at"]
    list_editable = ["is_resolved"]
    search_fields = ["name", "phone", "email"]


admin.site.register(Favorite)

admin.site.site_header = "Narion Admin"
admin.site.site_title = "Narion Admin"
admin.site.index_title = "Manage properties, developers, projects & locations"
