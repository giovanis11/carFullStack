from django.contrib import admin
from django.utils.html import format_html
from .models import Car, CarImage, RentalRequest, SaleInquiry, TransferRequest


class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1
    fields = ['preview', 'image', 'is_primary', 'order']
    readonly_fields = ['preview']

    def preview(self, obj):
        if not obj.pk or not obj.image:
            return 'Upload an image to preview it here.'
        return format_html(
            '<img src="{}" alt="Car image preview" style="height: 80px; width: auto; border-radius: 6px;" />',
            obj.image.url,
        )
    preview.short_description = 'Preview'


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ['brand', 'name', 'year', 'category', 'listing_type', 'price_per_day', 'sale_price', 'is_available', 'is_featured']
    list_filter = ['category', 'listing_type', 'fuel_type', 'transmission', 'is_available', 'is_featured']
    search_fields = ['name', 'brand']
    list_editable = ['is_available', 'is_featured']
    inlines = [CarImageInline]


@admin.register(RentalRequest)
class RentalRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'driver_age', 'car', 'pickup_date', 'return_date', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'phone', 'email']
    list_editable = ['status']
    readonly_fields = ['created_at']


@admin.register(SaleInquiry)
class SaleInquiryAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'car', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'phone', 'email']
    list_editable = ['status']
    readonly_fields = ['created_at']


@admin.register(TransferRequest)
class TransferRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'pickup_location', 'dropoff_location', 'datetime', 'passengers', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'phone', 'email']
    list_editable = ['status']
    readonly_fields = ['created_at']
