from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch
from decimal import Decimal

User = get_user_model()

class PaymentInitializationTests(APITestCase):
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
        self.initialize_url = reverse('payments:pay-initiate')

    @patch('payments.utils.requests.post')
    def test_successful_payment_initialization(self, mock_post):
        """Test successful payment initialization"""
        # Mock Paystack API response
        mock_post.return_value.json.return_value = {
            'status': True,
            'data': {
                'authorization_url': 'https://checkout.paystack.com/test',
                'access_code': 'test_access_code',
                'reference': 'test_reference'
            }
        }

        # Test data
        data = {
            'amount': '5000.00',
            'callback_url': 'http://localhost:3000/payment/callback'
        }

        response = self.client.post(self.initialize_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['status'])
        self.assertIn('authorization_url', response.data['data'])

    def test_invalid_amount(self):
        """Test payment initialization with invalid amount"""
        data = {
            'amount': '-100',
            'callback_url': 'http://localhost:3000/payment/callback'
        }

        response = self.client.post(self.initialize_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_missing_callback_url(self):
        """Test payment initialization without callback URL"""
        data = {
            'amount': '5000.00'
        }

        response = self.client.post(self.initialize_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

class PaymentVerificationTests(APITestCase):
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
        self.reference = 'test_reference'
        self.verify_url = reverse('payments:pay-verify', kwargs={'reference': self.reference})

    @patch('payments.utils.requests.get')
    def test_successful_payment_verification(self, mock_get):
        """Test successful payment verification"""
        # Mock Paystack API response
        mock_get.return_value.json.return_value = {
            'status': True,
            'data': {
                'status': 'success',
                'reference': self.reference,
                'amount': 500000,
                'paid_at': '2024-03-15T12:00:00Z'
            }
        }

        response = self.client.get(self.verify_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['status'])
        self.assertEqual(response.data['data']['reference'], self.reference)

    @patch('payments.utils.requests.get')
    def test_failed_payment_verification(self, mock_get):
        """Test failed payment verification"""
        # Mock failed Paystack API response
        mock_get.return_value.json.return_value = {
            'status': False,
            'message': 'Payment verification failed'
        }

        response = self.client.get(self.verify_url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_unauthenticated_access(self):
        """Test payment verification without authentication"""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.verify_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class PaymentUtilsTests(TestCase):
    @patch('payments.utils.requests.post')
    def test_initialize_payment(self, mock_post):
        """Test initialize_payment utility function"""
        from payments.utils import initialize_payment

        # Mock successful API response
        mock_post.return_value.json.return_value = {
            'status': True,
            'data': {
                'authorization_url': 'https://checkout.paystack.com/test',
                'access_code': 'test_access_code',
                'reference': 'test_reference'
            }
        }

        response = initialize_payment(
            email='test@example.com',
            amount=5000.00,
            callback_url='http://localhost:3000/payment/callback'
        )

        self.assertTrue(response['status'])
        self.assertIn('authorization_url', response['data'])

    @patch('payments.utils.requests.get')
    def test_verify_payment(self, mock_get):
        """Test verify_payment utility function"""
        from payments.utils import verify_payment

        # Mock successful API response
        mock_get.return_value.json.return_value = {
            'status': True,
            'data': {
                'status': 'success',
                'reference': 'test_reference',
                'amount': 500000
            }
        }

        response = verify_payment('test_reference')

        self.assertTrue(response['status'])
        self.assertEqual(response['data']['status'], 'success')
