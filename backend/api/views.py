from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Car, RentalRequest, SaleInquiry, TransferRequest
from .serializers import (
    CarListSerializer, CarDetailSerializer,
    RentalRequestSerializer, SaleInquirySerializer,
    TransferRequestSerializer, RequestStatusUpdateSerializer,
)
from .filters import CarFilter


class CarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Car.objects.prefetch_related('images').filter()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CarFilter
    search_fields = ['name', 'brand', 'description_el', 'description_en']
    ordering_fields = ['price_per_day', 'sale_price', 'year', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CarDetailSerializer
        return CarListSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = self.get_queryset().filter(is_featured=True)[:4]
        serializer = CarListSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def brands(self, request):
        brands = Car.objects.values_list('brand', flat=True).distinct().order_by('brand')
        return Response(list(brands))


class RentalRequestCreateView(generics.CreateAPIView):
    serializer_class = RentalRequestSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(status='pending')


class SaleInquiryCreateView(generics.CreateAPIView):
    serializer_class = SaleInquirySerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(status='pending')


class TransferRequestCreateView(generics.CreateAPIView):
    serializer_class = TransferRequestSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(status='pending')


class AdminRequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rentals = RentalRequestSerializer(
            RentalRequest.objects.select_related('car').all(),
            many=True, context={'request': request}
        ).data
        sales = SaleInquirySerializer(
            SaleInquiry.objects.select_related('car').all(),
            many=True, context={'request': request}
        ).data
        transfers = TransferRequestSerializer(
            TransferRequest.objects.all(),
            many=True, context={'request': request}
        ).data

        return Response({
            'rentals': rentals,
            'sales': sales,
            'transfers': transfers,
            'counts': {
                'pending_rentals': RentalRequest.objects.filter(status='pending').count(),
                'pending_sales': SaleInquiry.objects.filter(status='pending').count(),
                'pending_transfers': TransferRequest.objects.filter(status='pending').count(),
            }
        })


class AdminRequestStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    MODEL_MAP = {
        'rental': RentalRequest,
        'sale': SaleInquiry,
        'transfer': TransferRequest,
    }

    def patch(self, request, request_type, pk):
        model = self.MODEL_MAP.get(request_type)
        if not model:
            return Response({'detail': 'Invalid request type.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            obj = model.objects.get(pk=pk)
        except model.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RequestStatusUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        obj.status = serializer.validated_data['status']
        obj.save(update_fields=['status'])

        # Return updated object using appropriate serializer
        serializer_map = {
            'rental': RentalRequestSerializer,
            'sale': SaleInquirySerializer,
            'transfer': TransferRequestSerializer,
        }
        response_serializer = serializer_map[request_type](obj, context={'request': request})
        return Response(response_serializer.data)
