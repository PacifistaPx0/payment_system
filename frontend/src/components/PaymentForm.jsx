import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializePayment } from '../services/paymentService';
import { authService } from '../api/authService';
import './PaymentForm.css';

const PaymentForm = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const paymentData = await initializePayment(amount);
            
            // Backend returns authorization_url in data object
            if (paymentData.authorization_url) {
                // Store reference for verification
                localStorage.setItem('payment_reference', paymentData.reference);
                window.location.href = paymentData.authorization_url;
            } else {
                setError('Payment initialization failed. Please try again.');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Handle unauthorized access
                authService.logout();
                navigate('/login');
            } else {
                setError(error.message || 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-form-container">
            <h2>School Fees Payment</h2>
            <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                    <label htmlFor="amount">Amount (NGN)</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                        min="100"
                        step="0.01"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading || !amount}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm; 