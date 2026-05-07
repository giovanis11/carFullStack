from django.db import models
from cloudinary.models import CloudinaryField


class Car(models.Model):
    CATEGORY_CHOICES = [
        ('sports', 'Sports Car'),
        ('suv', 'SUV'),
        ('sedan', 'Sedan'),
        ('convertible', 'Convertible'),
        ('luxury', 'Luxury'),
        ('van', 'Van'),
    ]
    FUEL_CHOICES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
    ]
    TRANSMISSION_CHOICES = [
        ('automatic', 'Automatic'),
        ('manual', 'Manual'),
    ]
    LISTING_CHOICES = [
        ('rent', 'For Rent'),
        ('buy', 'For Sale'),
        ('both', 'Rent & Sale'),
    ]

    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES)
    horsepower = models.IntegerField()
    seats = models.IntegerField()
    year = models.IntegerField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sale_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    min_driver_age = models.IntegerField(default=18)
    listing_type = models.CharField(max_length=10, choices=LISTING_CHOICES, default='rent')
    description_el = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand} {self.name} ({self.year})"

    @property
    def primary_image(self):
        img = self.images.filter(is_primary=True).first()
        if not img:
            img = self.images.first()
        return img


class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image')
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.car} - Image {self.id}"


class RequestStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    DECLINED = 'declined', 'Declined'


class RentalRequest(models.Model):
    car = models.ForeignKey(Car, on_delete=models.SET_NULL, null=True, related_name='rental_requests')
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    driver_age = models.PositiveIntegerField()
    pickup_date = models.DateField()
    return_date = models.DateField()
    pickup_location = models.CharField(max_length=300)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Rental: {self.full_name} - {self.car} ({self.status})"


class SaleInquiry(models.Model):
    car = models.ForeignKey(Car, on_delete=models.SET_NULL, null=True, related_name='sale_inquiries')
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Sale Inquiry: {self.full_name} - {self.car} ({self.status})"


class TransferRequest(models.Model):
    TRANSFER_TYPE_CHOICES = [
        ('vip', 'VIP Transfer'),
        ('airport', 'Airport Transfer'),
    ]
    SECURITY_CHOICES = [
        ('no', 'No Security'),
        ('yes', 'Security / Bodyguards'),
    ]
    AIRPORT_DIRECTION_CHOICES = [
        ('from_airport', 'From Airport'),
        ('to_airport', 'To Airport'),
    ]

    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    transfer_type = models.CharField(max_length=20, choices=TRANSFER_TYPE_CHOICES, default='vip')
    pickup_location = models.CharField(max_length=300)
    dropoff_location = models.CharField(max_length=300)
    datetime = models.DateTimeField()
    passengers = models.IntegerField()
    flight_number = models.CharField(max_length=50, blank=True)
    security_option = models.CharField(max_length=10, choices=SECURITY_CHOICES, default='no')
    airport_direction = models.CharField(max_length=20, choices=AIRPORT_DIRECTION_CHOICES, blank=True, default='')
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Transfer: {self.full_name} ({self.status})"
