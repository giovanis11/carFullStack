from rest_framework import serializers
from .models import Car, CarImage, RentalRequest, SaleInquiry, TransferRequest, RequestStatus


class CarImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CarImage
        fields = ['id', 'image_url', 'is_primary', 'order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            try:
                return request.build_absolute_uri(obj.image.url)
            except ValueError:
                return None
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
            try:
                return request.build_absolute_uri(img.image.url)
            except ValueError:
                return None
        return None


class CarDetailSerializer(serializers.ModelSerializer):
    images = CarImageSerializer(many=True, read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    fuel_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    transmission_display = serializers.CharField(source='get_transmission_display', read_only=True)
    approved_bookings = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = [
            'id', 'name', 'brand', 'category', 'category_display',
            'fuel_type', 'fuel_display', 'transmission', 'transmission_display',
            'horsepower', 'seats', 'year', 'price_per_day', 'sale_price',
            'is_available', 'min_driver_age', 'listing_type', 'is_featured',
            'description_el', 'description_en', 'images', 'approved_bookings', 'created_at',
        ]

    def get_approved_bookings(self, obj):
        bookings = obj.rental_requests.filter(status=RequestStatus.APPROVED).order_by('pickup_date')
        return [
            {
                'pickup_date': booking.pickup_date.isoformat(),
                'return_date': booking.return_date.isoformat(),
            }
            for booking in bookings
        ]


class RentalRequestSerializer(serializers.ModelSerializer):
    car_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = RentalRequest
        fields = [
            'id', 'car', 'car_name', 'full_name', 'phone', 'email', 'driver_age',
            'pickup_date', 'return_date', 'pickup_location', 'notes',
            'status', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']

    def get_car_name(self, obj):
        if obj.car:
            return f"{obj.car.brand} {obj.car.name}"
        return None

    def validate(self, data):
        pickup_date = data.get('pickup_date')
        return_date = data.get('return_date')
        car = data.get('car')
        driver_age = data.get('driver_age')

        if return_date and pickup_date and return_date <= pickup_date:
            raise serializers.ValidationError("Return date must be after pickup date.")

        if car and driver_age is not None and driver_age < car.min_driver_age:
            raise serializers.ValidationError({
                'driver_age': f'Driver must be at least {car.min_driver_age} years old for this car.'
            })

        if car and pickup_date and return_date:
            overlapping_bookings = RentalRequest.objects.filter(
                car=car,
                status=RequestStatus.APPROVED,
                pickup_date__lt=return_date,
                return_date__gt=pickup_date,
            )
            if self.instance:
                overlapping_bookings = overlapping_bookings.exclude(pk=self.instance.pk)

            if overlapping_bookings.exists():
                raise serializers.ValidationError(
                    'This car is already booked for the selected dates.'
                )

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
    transfer_type_display = serializers.CharField(source='get_transfer_type_display', read_only=True)
    airport_direction_display = serializers.CharField(source='get_airport_direction_display', read_only=True)

    class Meta:
        model = TransferRequest
        fields = [
            'id', 'full_name', 'phone', 'email',
            'transfer_type', 'transfer_type_display',
            'pickup_location', 'dropoff_location', 'datetime',
            'passengers', 'flight_number', 'security_option',
            'airport_direction', 'airport_direction_display',
            'notes', 'status', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']

    def validate(self, data):
        transfer_type = data.get('transfer_type') or getattr(self.instance, 'transfer_type', 'vip')
        airport_direction = data.get('airport_direction', getattr(self.instance, 'airport_direction', ''))

        if transfer_type == 'airport' and not airport_direction:
            raise serializers.ValidationError({
                'airport_direction': 'Airport direction is required for airport transfers.'
            })

        return data


class RequestStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['pending', 'approved', 'declined'])
