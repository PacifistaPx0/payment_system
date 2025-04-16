import { useEffect, useState } from 'react';
import { authService } from '../api/authService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                console.log(userData);
                setUser(userData);
            } catch (err) {
                setError(err.message || 'Failed to fetch user data');
                navigate('/login'); // Redirect to login if there's an error
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <h2>User Profile</h2>
            {error && <div className="error-message">{error}</div>}
            {user ? (
                <div>
                    <p>Email: {user.user.email}</p>
                    <p>First Name: {user.user.first_name}</p>
                    <p>Last Name: {user.user.last_name}</p>
                    {/* Add more user details as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Dashboard;
