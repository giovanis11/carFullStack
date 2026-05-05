from django.contrib import admin
from .models import Car, CarImage, RentalRequest, SaleInquiry, TransferRequest


class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 3
    fields = ['image', 'is_primary', 'order']


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ['brand', 'name', 'year', 'category', 'listing_type', 'price_per_day', 'sale_price', 'is_available', 'is_featured']
    list_filter = ['category', 'listing_type', 'fuel_type', 'transmission', 'is_available', 'is_featured']
    search_fields = ['name', 'brand']
    list_editable = ['is_available', 'is_featured']
    inlines = [CarImageInline]


@admin.register(RentalRequest)
class RentalRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'car', 'pickup_date', 'return_date', 'status', 'created_at']
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
