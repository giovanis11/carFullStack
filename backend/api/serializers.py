from rest_framework import serializers
from .models import Car, CarImage, RentalRequest, SaleInquiry, TransferRequest


class CarImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CarImage
        fields = ['id', 'image_url', 'is_primary', 'order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class CarListSerializer(serializers.ModelSerializer):
    primary_image_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    fuel_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    transmission_display = serializers.CharField(source='get_transmission_display', read_only=True)

    class Meta:
        model = Car
        fields = [
            'id', 'name', 'brand', 'category', 'category_display',
            'fuel_type', 'fuel_display', 'transmission', 'transmission_display',
            'horsepower', 'seats', 'year', 'price_per_day', 'sale_price',
            'is_available', 'min_driver_age', 'listing_type', 'is_featured',
            'primary_image_url', 'created_at',
        ]

    def get_primary_image_url(self, obj):
        request = self.context.get('request')
        img = obj.primary_image
        if img and img.image and request:
            return request.build_absolute_uri(img.image.url)
        return None


class CarDetailSerializer(serializers.ModelSerializer):
    images = CarImageSerializer(many=True, read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    fuel_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    transmission_display = serializers.CharField(source='get_transmission_display', read_only=True)

    class Meta:
        model = Car
        fields = [
            'id', 'name', 'brand', 'category', 'category_display',
            'fuel_type', 'fuel_display', 'transmission', 'transmission_display',
            'horsepower', 'seats', 'year', 'price_per_day', 'sale_price',
            'is_available', 'min_driver_age', 'listing_type', 'is_featured',
            'description_el', 'description_en', 'images', 'created_at',
        ]


class RentalRequestSerializer(serializers.ModelSerializer):
    car_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = RentalRequest
        fields = [
            'id', 'car', 'car_name', 'full_name', 'phone', 'email',
            'pickup_date', 'return_date', 'pickup_location', 'notes',
            'status', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']

    def get_car_name(self, obj):
        if obj.car:
            return f"{obj.car.brand} {obj.car.name}"
        return None

    def validate(self, data):
        if data.get('return_date') and data.get('pickup_date'):
            if data['return_date'] <= data['pickup_date']:
                raise serializers.ValidationError("Return date must be after pickup date.")
        return data


class SaleInquirySerializer(serializers.ModelSerializer):
    car_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SaleInquiry
        fields = [
            'id', 'car', 'car_name', 'full_name', 'phone', 'email',
            'notes', 'status', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']

    def get_car_name(self, obj):
        if obj.car:
            return f"{obj.car.brand} {obj.car.name}"
        return None


class TransferRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferRequest
        fields = [
            'id', 'full_name', 'phone', 'email',
            'pickup_location', 'dropoff_location', 'datetime',
            'passengers', 'flight_number', 'notes', 'status', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']


class RequestStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['pending', 'approved', 'declined'])
