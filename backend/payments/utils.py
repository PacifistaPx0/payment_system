"""
This module handles payment processing utilities using the Paystack payment gateway.
It provides functions to initialize and manage payment transactions.
"""

import requests
from django.conf import settings

def initialize_payment(email, amount, callback_url):
    """
    Initialize a new payment transaction with Paystack payment gateway.
    
    Args:
        email (str): The customer's email address
        amount (float): The payment amount in the main currency unit (e.g., Naira, USD)
        callback_url (str): The URL Paystack will redirect to after payment completion
        
    Returns:
        dict: JSON response from Paystack containing:
            - authorization_url: URL to redirect user for payment
            - access_code: Unique payment session code
            - reference: Transaction reference
            
    Note:
        Amount is automatically converted to the lowest currency unit (kobo)
        as required by Paystack's API.
    """
    # Set up the headers required for Paystack API authentication
    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    
    # Prepare the payment data
    # Convert amount to kobo (multiply by 100) as Paystack expects amount in smallest currency unit
    data = {
        "email": email,
        "amount": int(amount * 100),  # Convert to kobo (1 Naira = 100 kobo)
        "callback_url": callback_url,  # URL for payment verification after completion
    }
    
    # Make API request to Paystack to initialize the transaction
    response = requests.post("https://api.paystack.co/transaction/initialize", headers=headers, json=data)
    return response.json()

def verify_payment(reference):
    """
    Verify a payment transaction using its reference.
    
    Args:
        reference (str): The transaction reference to verify
        
    Returns:
        dict: JSON response from Paystack containing:
            - status: boolean indicating if the request was successful
            - data: transaction details including:
                - status: transaction status (success, failed, etc.)
                - reference: transaction reference
                - amount: transaction amount
                - paid_at: payment timestamp
                - channel: payment channel used
                - currency: transaction currency
                - customer: customer details
    """
    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    
    # Make API request to Paystack to verify the transaction
    response = requests.get(
        f"https://api.paystack.co/transaction/verify/{reference}",
        headers=headers
    )
    return response.json()

