import html
import json
import os
from urllib import parse, request as urlrequest

from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Region, City, District, Developer, Project, Agent,
    Property, PropertyImage, PropertyVideo, Favorite, Inquiry,
)


LANG_CODES = {"hy": "hy", "ru": "ru", "en": "en", "es": "es"}


def _google_translate(text, source_lang, target_lang):
    key = os.getenv("GOOGLE_TRANSLATE_API_KEY", "").strip()
    if not key or not text or source_lang == target_lang:
        return ""
    endpoint = f"https://translation.googleapis.com/language/translate/v2?key={parse.quote(key)}"
    payload = parse.urlencode({
        "q": text,
        "source": source_lang,
        "target": target_lang,
        "format": "text",
    }).encode("utf-8")
    req = urlrequest.Request(endpoint, data=payload, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
    with urlrequest.urlopen(req, timeout=12) as response:
        body = json.loads(response.read().decode("utf-8"))
    translated = body.get("data", {}).get("translations", [{}])[0].get("translatedText", "")
    return html.unescape(translated).strip()


def _fill_missing_language_group(obj, prefix):
    source_lang = None
    source_text = ""
    for code in ("hy", "ru", "en", "es"):
        value = (getattr(obj, f"{prefix}_{code}", "") or "").strip()
        if value:
            source_lang, source_text = code, value
            break
    if not source_text:
        return
    for code in ("hy", "ru", "en", "es"):
        field = f"{prefix}_{code}"
        if (getattr(obj, field, "") or "").strip():
            continue
        translated = _google_translate(source_text, LANG_CODES[source_lang], LANG_CODES[code])
        if translated:
            setattr(obj, field, translated)


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ["preview", "image", "is_main", "order"]
    readonly_fields = ["preview"]

    @admin.display(description="Preview")
    def preview(self, obj):
        if obj and obj.image:
            return format_html(
                '<img src="{}" style="width:112px;height:76px;object-fit:cover;border-radius:12px;display:block" />',
                obj.image.url,
            )
        return "—"


class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 0
    fields = ["preview", "video", "order"]
    readonly_fields = ["preview"]

    @admin.display(description="Preview")
    def preview(self, obj):
        if obj and obj.video:
            return format_html(
                '<video src="{}" controls muted playsinline style="width:180px;max-height:110px;border-radius:12px;background:#050505"></video>',
                obj.video.url,
            )
        return "—"


@admin.action(description="Publish selected properties")
def publish_properties(modeladmin, request, queryset):
    queryset.update(is_published=True)


@admin.action(description="Unpublish selected properties")
def unpublish_properties(modeladmin, request, queryset):
    queryset.update(is_published=False)


@admin.action(description="Mark as featured")
def feature_properties(modeladmin, request, queryset):
    queryset.update(is_featured=True)


@admin.action(description="Remove featured status")
def unfeature_properties(modeladmin, request, queryset):
    queryset.update(is_featured=False)


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        "cover_thumb", "id", "title", "market_type", "listing_type", "property_type",
        "district", "price", "currency", "is_published", "is_featured", "updated_at",
    ]
    list_display_links = ["cover_thumb", "id", "title"]
    list_filter = [
        "is_published", "is_featured", "listing_type", "market_type", "property_type",
        "district__city", "district", "currency",
    ]
    search_fields = ["title_en", "title_ru", "title_hy", "title_es", "address", "project__name"]
    list_editable = ["is_published", "is_featured"]
    autocomplete_fields = ["district", "developer", "project", "agent"]
    inlines = [PropertyImageInline, PropertyVideoInline]
    save_on_top = True
    list_per_page = 30
    date_hierarchy = "created_at"
    actions = [publish_properties, unpublish_properties, feature_properties, unfeature_properties]

    fieldsets = (
        ("01 · Main information", {
            "fields": (("title_hy", "title_ru"), ("title_en", "title_es")),
            "description": "Write the title in one language. When Google Translation is connected, Narion can fill the empty languages automatically on save.",
        }),
        ("02 · Selling description", {
            "fields": (("description_hy", "description_ru"), ("description_en", "description_es")),
            "description": "Keep it short and benefit-led. Empty translations can be generated automatically when translation is enabled.",
        }),
        ("03 · Status & classification", {
            "fields": (("listing_type", "market_type", "property_type"), ("is_published", "is_featured")),
        }),
        ("04 · Location", {
            "fields": ("district", "address", ("latitude", "longitude")),
        }),
        ("05 · Price & specifications", {
            "fields": (("price", "currency"), ("area_sqm", "rooms"), ("bedrooms", "bathrooms"), ("floor", "total_floors")),
        }),
        ("06 · Features", {
            "fields": (
                ("has_parking", "is_furnished", "has_balcony", "has_terrace"),
                ("has_pool", "has_elevator", "has_security", "is_renovated"),
            ),
        }),
        ("07 · Project & contact", {
            "fields": ("developer", "project", "agent"),
        }),
    )

    def save_model(self, request, obj, form, change):
        if os.getenv("AUTO_TRANSLATE_PROPERTIES", "True").lower() in {"1", "true", "yes"} and os.getenv("GOOGLE_TRANSLATE_API_KEY"):
            try:
                _fill_missing_language_group(obj, "title")
                _fill_missing_language_group(obj, "description")
            except Exception:
                pass
        super().save_model(request, obj, form, change)

    @admin.display(description="Cover")
    def cover_thumb(self, obj):
        url = obj.primary_image_url
        if not url:
            return format_html('<span style="color:#8d8d93">No photo</span>')
        return format_html(
            '<img src="{}" style="width:72px;height:52px;object-fit:cover;border-radius:10px;display:block" />',
            url,
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
    readonly_fields = ["created_at"]


admin.site.register(Favorite)

admin.site.site_header = "Narion Manager"
admin.site.site_title = "Narion Manager"
admin.site.index_title = "Property operations"
admin.site.site_url = "https://narion.am"
