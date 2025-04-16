// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PaymentForm from './components/PaymentForm';
import PaymentCallback from './components/PaymentCallback';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Login />} /> {/* Redirect to login by default */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/payment" 
                        element={
                            <ProtectedRoute>
                                <PaymentForm />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/payment/callback" 
                        element={
                            <ProtectedRoute>
                                <PaymentCallback />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;