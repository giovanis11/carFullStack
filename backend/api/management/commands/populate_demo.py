import urllib.request
import ssl
import os
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from api.models import Car, CarImage


CARS = [
    {
        "name": "Huracán EVO",
        "brand": "Lamborghini",
        "category": "sports",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 640,
        "seats": 2,
        "year": 2023,
        "price_per_day": 1500,
        "sale_price": None,
        "min_driver_age": 28,
        "listing_type": "rent",
        "is_featured": True,
        "description_el": "Το εμβληματικό σπορ αυτοκίνητο της Lamborghini με 640 ίππους και απίστευτες επιδόσεις.",
        "description_en": "Lamborghini's iconic mid-engine supercar with 640hp and breathtaking performance.",
        "images": [
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=85",
            "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=85",
        ],
    },
    {
        "name": "911 Turbo S",
        "brand": "Porsche",
        "category": "sports",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 650,
        "seats": 4,
        "year": 2023,
        "price_per_day": 700,
        "sale_price": None,
        "min_driver_age": 25,
        "listing_type": "rent",
        "is_featured": True,
        "description_el": "Το 911 Turbo S είναι η απόλυτη έκφραση της τεχνολογίας Porsche.",
        "description_en": "The 911 Turbo S is the ultimate expression of Porsche engineering.",
        "images": [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85",
            "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200&q=85",
        ],
    },
    {
        "name": "GLE 63 S AMG",
        "brand": "Mercedes-Benz",
        "category": "suv",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 612,
        "seats": 5,
        "year": 2023,
        "price_per_day": 350,
        "sale_price": None,
        "min_driver_age": 25,
        "listing_type": "rent",
        "is_featured": True,
        "description_el": "Πολυτελές SUV υψηλών επιδόσεων για κάθε περιστάσεις.",
        "description_en": "High-performance luxury SUV combining power with everyday practicality.",
        "images": [
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=85",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=85",
        ],
    },
    {
        "name": "Continental GT",
        "brand": "Bentley",
        "category": "luxury",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 542,
        "seats": 4,
        "year": 2022,
        "price_per_day": 900,
        "sale_price": 260000,
        "min_driver_age": 30,
        "listing_type": "both",
        "is_featured": True,
        "description_el": "Η απόλυτη πολυτέλεια σε grand tourer. Χειροποίητο εσωτερικό και εκπληκτικές επιδόσεις.",
        "description_en": "The ultimate grand tourer. Hand-crafted interior and remarkable performance.",
        "images": [
            "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1200&q=85",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=85",
        ],
    },
    {
        "name": "Model S Plaid",
        "brand": "Tesla",
        "category": "sedan",
        "fuel_type": "electric",
        "transmission": "automatic",
        "horsepower": 1020,
        "seats": 5,
        "year": 2023,
        "price_per_day": 280,
        "sale_price": None,
        "min_driver_age": 21,
        "listing_type": "rent",
        "is_featured": True,
        "description_el": "Το ταχύτερο sedan παραγωγής στον κόσμο. 0-100 σε 2.1 δευτερόλεπτα.",
        "description_en": "The fastest production sedan ever. 0-100 km/h in just 2.1 seconds.",
        "images": [
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=85",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=85",
        ],
    },
    {
        "name": "F8 Tributo",
        "brand": "Ferrari",
        "category": "sports",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 710,
        "seats": 2,
        "year": 2022,
        "price_per_day": 1300,
        "sale_price": None,
        "min_driver_age": 28,
        "listing_type": "rent",
        "is_featured": False,
        "description_el": "Το F8 Tributo είναι αφιερωμένο στο V8 κινητήρα της Ferrari.",
        "description_en": "The F8 Tributo is a tribute to Ferrari's most powerful V8 engine.",
        "images": [
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=85",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=85",
        ],
    },
    {
        "name": "Range Rover Autobiography",
        "brand": "Land Rover",
        "category": "suv",
        "fuel_type": "diesel",
        "transmission": "automatic",
        "horsepower": 350,
        "seats": 5,
        "year": 2023,
        "price_per_day": 420,
        "sale_price": 145000,
        "min_driver_age": 25,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Το πιο πολυτελές SUV στον κόσμο. Άνεση και επιδόσεις σε ένα.",
        "description_en": "The world's most luxurious SUV. Unrivalled comfort meets off-road capability.",
        "images": [
            "https://images.unsplash.com/photo-1519245160810-f9a9f02697d0?w=1200&q=85",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=85",
        ],
    },
    {
        "name": "DB11 Volante",
        "brand": "Aston Martin",
        "category": "convertible",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 510,
        "seats": 4,
        "year": 2022,
        "price_per_day": 1100,
        "sale_price": 220000,
        "min_driver_age": 28,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Ανοιχτό grand tourer με βρετανική κομψότητα και αθλητικό DNA.",
        "description_en": "Open-top grand touring with British elegance and sporting DNA.",
        "images": [
            "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=85",
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=85",
        ],
    },
]


class Command(BaseCommand):
    help = 'Populate database with demo cars and download images from Unsplash'

    def handle(self, *args, **options):
        if Car.objects.exists():
            self.stdout.write(self.style.WARNING('Cars already exist — clearing and repopulating...'))
            Car.objects.all().delete()

        media_cars = os.path.join(settings.MEDIA_ROOT, 'cars')
        os.makedirs(media_cars, exist_ok=True)

        for car_data in CARS:
            image_urls = car_data.pop('images')
            car = Car.objects.create(**car_data)

            for idx, url in enumerate(image_urls):
                filename = f"{car.brand.lower().replace(' ', '_')}_{car.name.lower().replace(' ', '_')}_{idx+1}.jpg"
                filepath = os.path.join(media_cars, filename)

                try:
                    self.stdout.write(f"  Downloading {filename}...")
                    ctx = ssl._create_unverified_context()
                    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=15, context=ctx) as response:
                        with open(filepath, 'wb') as f:
                            f.write(response.read())

                    car_image = CarImage(car=car, is_primary=(idx == 0), order=idx)
                    car_image.image.name = f'cars/{filename}'
                    car_image.save()

                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'    Could not download image: {e}'))

            self.stdout.write(self.style.SUCCESS(f'✓ {car.brand} {car.name}'))

        self.stdout.write(self.style.SUCCESS(f'\nDone! {Car.objects.count()} cars created.'))
