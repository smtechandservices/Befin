# Befin Backend

Befin is a youth-focused financial literacy platform. This repository contains the Django-based backend responsible for authentication, wallet management, and investment simulation.

## Features

- **JWT Authentication**: Secure user registration, login, and profile management.
- **Custom User Model**: Includes personal details like Date of Birth and Phone Number.
- **Wallet System**: Automatic wallet creation and transaction history tracking.
- **Modular Architecture**: Clean separation of concerns with `users` and `wallet` apps.

## Tech Stack

- **Framework**: Django 6.x
- **API**: Django REST Framework (DRF)
- **Authentication**: SimpleJWT
- **Database**: SQLite (Development)

## Getting Started

### Prerequisites

- Python 3.10+
- `pip`

### Setup

1. **Clone the repository and navigate to the backend folder**:
   ```bash
   cd Befin/backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: Requirements file should be generated using `pip freeze > requirements.txt`)*

4. **Apply migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Run the development server**:
   ```bash
   python manage.py runserver
   ```

## API Documentation

The backend exposes several endpoints under the `/api/` prefix.

### Authentication (`/api/users/`)
- `POST /register/`: Register a new user.
- `POST /login/`: Obtain JWT access and refresh tokens.
- `POST /token/refresh/`: Refresh an expired access token.
- `GET /profile/`: Get the authenticated user's profile.
- `PUT /profile/`: Update the authenticated user's profile.

### Wallet (`/api/wallet/`)
- `GET /balance/`: View the current wallet balance.
- `GET /transactions/`: View transaction history.

## Development

### Creating a Superuser
To access the Django Admin interface (`/admin/`):
```bash
python manage.py createsuperuser
```
