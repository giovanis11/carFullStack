from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    CarViewSet,
    RentalRequestCreateView,
    SaleInquiryCreateView,
    TransferRequestCreateView,
    AdminRequestListView,
    AdminRequestStatusUpdateView,
)

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')

urlpatterns = [
    path('', include(router.urls)),
    path('rental-requests/', RentalRequestCreateView.as_view(), name='rental-request-create'),
    path('sale-inquiries/', SaleInquiryCreateView.as_view(), name='sale-inquiry-create'),
    path('transfer-requests/', TransferRequestCreateView.as_view(), name='transfer-request-create'),
    path('admin/requests/', AdminRequestListView.as_view(), name='admin-requests'),
    path('admin/requests/<str:request_type>/<int:pk>/', AdminRequestStatusUpdateView.as_view(), name='admin-request-update'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
