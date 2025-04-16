from django.urls import path
from .views import InitializeSchoolFeesPayment, VerifySchoolFeesPayment

app_name = 'payments'

urlpatterns = [
    path('pay/initiate/', InitializeSchoolFeesPayment.as_view(), name='pay-initiate'),
    path('pay/verify/<str:reference>/', VerifySchoolFeesPayment.as_view(), name='pay-verify'),
]