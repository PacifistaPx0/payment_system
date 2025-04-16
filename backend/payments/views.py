from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from .utils import initialize_payment, verify_payment



class InitializeSchoolFeesPayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        amount = request.data.get('amount')
        callback_url = request.data.get('callback_url')

        # Validate inputs
        if not amount or not callback_url:
            return Response({
                "error": "Amount and callback URL are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError()
        except ValueError:
            return Response({
                "error": "Invalid amount."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = initialize_payment(user.email, amount, callback_url)

            if not response.get('status'):
                # Paystack returned an error
                return Response({
                    "error": response.get('message', 'Failed to initialize payment')
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response(response)

        except Exception as e:
            return Response({
                "error": "An error occurred while initializing payment.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class VerifySchoolFeesPayment(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, reference):
        try:
            verification_response = verify_payment(reference)
            
            if not verification_response.get('status'):
                return Response({
                    "error": verification_response.get('message', 'Payment verification failed')
                }, status=status.HTTP_400_BAD_REQUEST)
                
            return Response(verification_response)
            
        except Exception as e:
            return Response({
                "error": "An error occurred while verifying payment.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

