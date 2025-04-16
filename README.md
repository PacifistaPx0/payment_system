# Paystack Payment System

Utilising paystack api for one time payment, built with Django and React
Documentation: https://paystack.com/docs/


## Features

- 🔐 Secure email-based authentication
- 🎫 JWT token-based authorization
- 💰 School fee payment processing
- 👤 User profile management
- 🔄 Real-time payment status updates
- 🛡️ Protected routes and API endpoints


## Tech Stack

### Backend
- Django 5.2
- Django REST Framework 3.14
- Django CORS Headers 4.3
- Python-dotenv 1.0
- Argon2 password hashing
- SQLite (development) / PostgreSQL (production)

### Frontend
- React 19
- React Router DOM 7.5
- Axios 1.8
- Vite 6.2
- Modern CSS with responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd payment_system
   ```

2. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create .env file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install  # or npm install
   ```

3. Create .env file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   yarn dev  # or npm run dev
   ```

## Project Structure

```
payment_system/
├── backend/
│   ├── accounts/          # User authentication and profile management
│   ├── payments/          # Payment processing logic
│   ├── core/              # Core application settings
│   └── manage.py
│
└── frontend/
    ├── public/
    └── src/
        ├── api/           # API service layer
        ├── components/    # React components
        ├── services/      # Business logic services
        └── App.jsx        # Root component
```

## API Endpoints

### Authentication
- POST `/api/accounts/register/` - User registration
- POST `/api/accounts/token/` - Login and token generation
- GET `/api/accounts/profile/` - Get user profile
- PUT `/api/accounts/profile/` - Update user profile

### Payments
- POST `/api/payments/pay/initiate/` - Initialize payment
- GET `/api/payments/pay/verify/<reference>/` - Verify payment status

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## Security Features

- JWT token authentication
- Argon2 password hashing
- CORS protection
- CSRF protection
- Protected routes
- Secure password reset flow
- Input validation and sanitization

## Development

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
yarn test  # or npm test
```

### Code Linting
```bash
# Backend
flake8 .

# Frontend
yarn lint  # or npm run lint
```

