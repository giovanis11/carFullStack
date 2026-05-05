import django_filters
from .models import Car


class CarFilter(django_filters.FilterSet):
    brand = django_filters.CharFilter(field_name='brand', lookup_expr='iexact')
    brands = django_filters.BaseInFilter(field_name='brand', lookup_expr='in')
    category = django_filters.CharFilter(field_name='category', lookup_expr='iexact')
    transmission = django_filters.CharFilter(field_name='transmission', lookup_expr='iexact')
    fuel_type = django_filters.CharFilter(field_name='fuel_type', lookup_expr='iexact')
    seats = django_filters.NumberFilter(field_name='seats')
    min_price = django_filters.NumberFilter(field_name='price_per_day', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price_per_day', lookup_expr='lte')
    min_sale_price = django_filters.NumberFilter(field_name='sale_price', lookup_expr='gte')
    max_sale_price = django_filters.NumberFilter(field_name='sale_price', lookup_expr='lte')
    listing_type = django_filters.CharFilter(method='filter_listing_type')
    is_available = django_filters.BooleanFilter(field_name='is_available')
    min_year = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    max_year = django_filters.NumberFilter(field_name='year', lookup_expr='lte')
    max_mileage = django_filters.NumberFilter(method='filter_noop')  # placeholder for future mileage field
    min_driver_age = django_filters.NumberFilter(field_name='min_driver_age', lookup_expr='lte')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')

    class Meta:
        model = Car
        fields = [
            'brand', 'category', 'transmission', 'fuel_type', 'seats',
            'listing_type', 'is_available', 'is_featured',
        ]

    def filter_listing_type(self, queryset, name, value):
        if value == 'rent':
            return queryset.filter(listing_type__in=['rent', 'both'])
        if value == 'buy':
            return queryset.filter(listing_type__in=['buy', 'both'])
        return queryset.filter(listing_type=value)

    def filter_noop(self, queryset, name, value):
        return queryset
