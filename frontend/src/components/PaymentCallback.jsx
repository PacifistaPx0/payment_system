import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../services/paymentService';
import './PaymentCallback.css';

/**
 * PaymentCallback Component
 * Handles the callback after a payment attempt and displays the transaction status
 */
const PaymentCallback = () => {
    // State to track payment verification status and display message
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('');
    // Hooks for accessing URL parameters and navigation
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Function to verify the payment transaction
        const verifyTransaction = async () => {
            try {
                // Get reference from URL params first, then fallback to localStorage
                const queryParams = new URLSearchParams(location.search);
                const reference = queryParams.get('reference') || localStorage.getItem('payment_reference');
        
                // Check if we have a valid reference
                if (!reference) {
                    setStatus('error');
                    setMessage('Invalid payment reference');
                    return;
                }
        
                // Call the payment verification API
                const response = await verifyPayment(reference);

        
                // Handle successful payment verification
                if (response?.status === true && response.data?.status === 'success') {
                    setStatus('success');
                    setMessage(response.message || 'Payment completed successfully!');
                    // Clean up stored reference after successful verification
                    localStorage.removeItem('payment_reference');
                } else {
                    // Handle failed payment verification
                    setStatus('error');
                    setMessage(response.message || 'Payment verification failed');
                }
            } catch (error) {
                // Handle any errors during verification
                setStatus('error');
                setMessage(error.message || 'An error occurred while verifying payment');
            }
        };        

        // Call verifyTransaction when component mounts or URL changes
        verifyTransaction();
    }, [location.search]);

    // Handler for the return button click
    const handleReturn = () => {
        navigate('/dashboard');
    };

    return (
        <div className="payment-callback-container">
            <div className={`payment-status ${status}`}>
                {/* Processing State UI */}
                {status === 'processing' && (
                    <>
                        <div className="loading-spinner"></div>
                        <h2>Verifying Payment...</h2>
                    </>
                )}

                {/* Success State UI */}
                {status === 'success' && (
                    <>
                        <div className="success-icon">✓</div>
                        <h2>Payment Successful!</h2>
                    </>
                )}

                {/* Error State UI */}
                {status === 'error' && (
                    <>
                        <div className="error-icon">✕</div>
                        <h2>Payment Failed</h2>
                    </>
                )}

                {/* Display status message */}
                <p>{message}</p>

                {/* Return to dashboard button */}
                <button onClick={handleReturn} className="return-button">
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentCallback;
