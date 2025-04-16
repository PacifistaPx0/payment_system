import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../services/paymentService';
import './PaymentCallback.css';

const PaymentCallback = () => {
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyTransaction = async () => {
            try {
                // Get reference from URL params first, then fallback to localStorage
                const queryParams = new URLSearchParams(location.search);
                const reference = queryParams.get('reference') || localStorage.getItem('payment_reference');

                console.log(reference);

                if (!reference) {
                    setStatus('error');
                    setMessage('Invalid or missing payment reference');
                    return;
                }

                const response = await verifyPayment(reference);

                if (response.status === 'success') {
                    setStatus('success');
                    setMessage('Payment completed successfully!');
                    localStorage.removeItem('payment_reference'); // Clean up
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Payment verification failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'An error occurred while verifying payment');
            }
        };

        verifyTransaction();
    }, [location.search]);

    const handleReturn = () => {
        navigate('/dashboard');
    };

    return (
        <div className="payment-callback-container">
            <div className={`payment-status ${status}`}>
                {status === 'processing' && (
                    <>
                        <div className="loading-spinner"></div>
                        <h2>Verifying Payment...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="success-icon">✓</div>
                        <h2>Payment Successful!</h2>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="error-icon">✕</div>
                        <h2>Payment Failed</h2>
                    </>
                )}

                <p>{message}</p>

                <button onClick={handleReturn} className="return-button">
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentCallback;
