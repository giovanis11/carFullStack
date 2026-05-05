import urllib.request
import urllib.error
import ssl
import os
import time
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
    {
        "name": "720S Spider",
        "brand": "McLaren",
        "category": "sports",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 710,
        "seats": 2,
        "year": 2022,
        "price_per_day": 1450,
        "sale_price": 295000,
        "min_driver_age": 28,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Ανοιχτό supercar με ανθρακονημάτινο monocoque και εκρηκτικές επιδόσεις στην κατηγορία του.",
        "description_en": "Open-top supercar with a carbon-fibre monocage and explosive performance.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:FilePath/McLaren_720S_Spider_(2022)_(53332391959).jpg",
        ],
    },
    {
        "name": "R8 V10 Performance",
        "brand": "Audi",
        "category": "sports",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 620,
        "seats": 2,
        "year": 2023,
        "price_per_day": 1180,
        "sale_price": 198000,
        "min_driver_age": 27,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Το ατμοσφαιρικό V10 της Audi σε ένα καθημερινά χρηστικό αλλά αυθεντικά εξωτικό supercar.",
        "description_en": "Audi's naturally aspirated V10 in a supercar that balances drama with everyday usability.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Audi_R8_V10_Performance.jpg",
        ],
    },
    {
        "name": "M8 Competition Coupe",
        "brand": "BMW",
        "category": "sports",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 625,
        "seats": 4,
        "year": 2023,
        "price_per_day": 650,
        "sale_price": 166000,
        "min_driver_age": 25,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Μεγάλο GT coupe με twin-turbo V8, τετρακίνηση και premium χαρακτήρα για ταξίδι ή γρήγορη οδήγηση.",
        "description_en": "High-performance GT coupe with a twin-turbo V8, all-wheel drive and premium long-distance comfort.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/BMW_M8_Competition_Coup%C3%A9_(52502025936).jpg?width=1600",
        ],
    },
    {
        "name": "Cullinan Black Badge",
        "brand": "Rolls-Royce",
        "category": "luxury",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 600,
        "seats": 5,
        "year": 2023,
        "price_per_day": 1850,
        "sale_price": 425000,
        "min_driver_age": 30,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Η πιο δυναμική εκδοχή του Cullinan με απόλυτη ησυχία, πολυτέλεια και παρουσία δρόμου.",
        "description_en": "The boldest Cullinan variant, combining serene comfort, luxury and imposing road presence.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/2021_Rolls_Royce_Cullinan_Black_Badge.jpg?width=1600",
        ],
    },
    {
        "name": "S 580 4MATIC",
        "brand": "Mercedes-Benz",
        "category": "luxury",
        "fuel_type": "hybrid",
        "transmission": "automatic",
        "horsepower": 503,
        "seats": 5,
        "year": 2023,
        "price_per_day": 560,
        "sale_price": 168000,
        "min_driver_age": 25,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Η flagship S-Class με κορυφαία άνεση, τεχνολογία και 4MATIC πρόσφυση για VIP μετακινήσεις.",
        "description_en": "Flagship S-Class luxury with top-tier comfort, technology and 4MATIC stability for VIP travel.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_W223_S_580_4matic_black_(1).jpg",
        ],
    },
    {
        "name": "Cayenne Turbo GT",
        "brand": "Porsche",
        "category": "suv",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 640,
        "seats": 5,
        "year": 2023,
        "price_per_day": 590,
        "sale_price": 215000,
        "min_driver_age": 25,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "SUV υψηλών επιδόσεων που μεταφέρει τον χαρακτήρα GT της Porsche σε οικογενειακό αμάξωμα.",
        "description_en": "High-performance SUV that brings Porsche GT character into a practical family-bodied package.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:FilePath/2022_Porsche_Cayenne_Turbo_GT.jpg",
        ],
    },
    {
        "name": "Roma",
        "brand": "Ferrari",
        "category": "luxury",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 620,
        "seats": 4,
        "year": 2023,
        "price_per_day": 1280,
        "sale_price": 258000,
        "min_driver_age": 28,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Κομψό grand tourer της Ferrari με V8 δύναμη και πιο διακριτική ιταλική αισθητική.",
        "description_en": "Elegant Ferrari grand tourer pairing V8 power with a more understated Italian design language.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ferrari_Roma.jpg?width=1600",
        ],
    },
    {
        "name": "Vantage V12 Roadster",
        "brand": "Aston Martin",
        "category": "convertible",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 700,
        "seats": 2,
        "year": 2023,
        "price_per_day": 1320,
        "sale_price": 265000,
        "min_driver_age": 28,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Σπάνιο ανοιχτό Aston Martin με V12 ήχο και εκλεπτυσμένη βρετανική αισθητική.",
        "description_en": "Rare open-top Aston Martin with V12 theatre and unmistakable British style.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/2023_Aston_Martin_Vantage_V12_Roadster.jpg?width=1600",
        ],
    },
    {
        "name": "Flying Spur Speed",
        "brand": "Bentley",
        "category": "luxury",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 635,
        "seats": 5,
        "year": 2023,
        "price_per_day": 1380,
        "sale_price": 298000,
        "min_driver_age": 30,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Σπορ λιμουζίνα της Bentley που συνδυάζει χειροποίητη πολυτέλεια με W12 επιδόσεις.",
        "description_en": "Bentley's sporting limousine, blending handcrafted luxury with W12 performance.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bentley_Flying_Spur_Speed_(2023)_(52956830267).jpg?width=1600",
        ],
    },
    {
        "name": "MC20",
        "brand": "Maserati",
        "category": "sports",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 621,
        "seats": 2,
        "year": 2023,
        "price_per_day": 1220,
        "sale_price": 235000,
        "min_driver_age": 28,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Νέας γενιάς ιταλικό supercar με Nettuno V6 και επιθετική αλλά κομψή σχεδίαση.",
        "description_en": "Next-generation Italian supercar with the Nettuno V6 and a sharp yet elegant design.",
        "images": [
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/Maserati_MC20.jpg?width=1600",
        ],
    },
    {
        "name": "RS 6 Avant Performance",
        "brand": "Audi",
        "category": "sedan",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 605,
        "seats": 5,
        "year": 2022,
        "price_per_day": 480,
        "sale_price": 138000,
        "min_driver_age": 25,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Το απόλυτο performance wagon της Audi με V8 ισχύ και τεράστια πρακτικότητα.",
        "description_en": "Audi's ultimate performance wagon, mixing V8 power with real everyday practicality.",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Audi_RS6_Avant_performance_%28C7%29_front.jpg/1280px-Audi_RS6_Avant_performance_%28C7%29_front.jpg",
        ],
    },
    {
        "name": "SL 63",
        "brand": "Mercedes-AMG",
        "category": "convertible",
        "fuel_type": "petrol",
        "transmission": "automatic",
        "horsepower": 577,
        "seats": 4,
        "year": 2023,
        "price_per_day": 980,
        "sale_price": 199000,
        "min_driver_age": 28,
        "listing_type": "both",
        "is_featured": False,
        "description_el": "Πολυτελές roadster υψηλών επιδόσεων με AMG V8 δύναμη και καθημερινή άνεση.",
        "description_en": "High-performance luxury roadster with AMG V8 power and everyday grand-touring comfort.",
        "images": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2022_Mercedes-Benz_SL63_AMG_in_Patagonia_Red_Metallic%2C_front_right.jpg/1280px-2022_Mercedes-Benz_SL63_AMG_in_Patagonia_Red_Metallic%2C_front_right.jpg",
        ],
    },
]


class Command(BaseCommand):
    help = 'Populate or update demo cars and download their images'

    def handle(self, *args, **options):
        media_cars = os.path.join(settings.MEDIA_ROOT, 'cars')
        os.makedirs(media_cars, exist_ok=True)

        for template in CARS:
            car_data = template.copy()
            image_urls = car_data.pop('images')
            brand = car_data['brand']
            name = car_data['name']
            car, created = Car.objects.update_or_create(
                brand=brand,
                name=name,
                defaults=car_data,
            )

            if car.images.exists():
                status_label = 'updated' if not created else 'created'
                self.stdout.write(self.style.SUCCESS(f'✓ {car.brand} {car.name} ({status_label}, images kept)'))
                continue

            for idx, url in enumerate(image_urls):
                filename = f"{car.brand.lower().replace(' ', '_')}_{car.name.lower().replace(' ', '_')}_{idx+1}.jpg"
                filepath = os.path.join(media_cars, filename)

                try:
                    self.stdout.write(f"  Downloading {filename}...")
                    ctx = ssl._create_unverified_context()
                    downloaded = False
                    for attempt in range(4):
                        try:
                            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                            with urllib.request.urlopen(req, timeout=20, context=ctx) as response:
                                with open(filepath, 'wb') as f:
                                    f.write(response.read())
                            downloaded = True
                            break
                        except urllib.error.HTTPError as exc:
                            if exc.code == 429 and attempt < 3:
                                wait_seconds = 3 * (attempt + 1)
                                self.stdout.write(f"    Rate limited, retrying in {wait_seconds}s...")
                                time.sleep(wait_seconds)
                                continue
                            raise

                    if not downloaded:
                        raise RuntimeError('Image download failed after retries.')

                    car_image = CarImage(car=car, is_primary=(idx == 0), order=idx)
                    car_image.image.name = f'cars/{filename}'
                    car_image.save()

                    time.sleep(1)

                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'    Could not download image: {e}'))

            status_label = 'created' if created else 'updated'
            self.stdout.write(self.style.SUCCESS(f'✓ {car.brand} {car.name} ({status_label})'))

        self.stdout.write(self.style.SUCCESS(f'\nDone! {Car.objects.count()} cars created.'))
