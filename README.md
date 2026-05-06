# RideFlow

RideFlow is a premium, full-stack ride-hailing web application. It features a modern, high-fidelity React frontend coupled with a robust Flask/MySQL backend. The project models the complete lifecycle of a ride platform: user authentication, ride booking, driver assignment, trip completion, payments, ratings, wallet payouts, admin reporting, and role-based access control.

## Tech Stack

**Frontend**
- React 18 (TypeScript)
- Vite 5
- Tailwind CSS 3 (Dark Mode Premium Aesthetics)
- GSAP 3.12 + ScrollTrigger + Framer Motion (Animations & Smooth Scrolling)
- Three.js r160 (3D Hero Scenes)
- React Hook Form + Zod (Validation)
- Zustand (State Management)
- Chart.js (Admin Dashboards)

**Backend & Database**
- Python 3.12
- Flask 3.x
- MySQL 8.x
- mysql-connector-python
- werkzeug.security (Password Hashing)

## Architecture

The system is separated into three logical tiers:
1. **Frontend**: A React application served via Vite on `http://localhost:5173`. It provides dedicated dashboards for Riders, Drivers, and Admins.
2. **API Proxy**: The Vite server proxies all `/api/*` and `/logout` requests to the Flask backend running on `http://127.0.0.1:5000`.
3. **Backend & DB**: The Flask app (`app.py`) provides JSON endpoints, manages session cookies, and handles all transactions with the MySQL database using defined procedures and triggers.

## Project Layout

```
RideFlow/
├── src/                    # React Frontend
│   ├── components/         # Reusable UI elements and layout
│   ├── lib/                # API client, validators, animation variants
│   ├── pages/              # Landing, Auth, Rider, Driver, and Admin pages
│   ├── store/              # Zustand state management
│   ├── styles/             # Global CSS, tokens, glassmorphism utilities
│   ├── App.tsx             # Routing & Auth Guards
│   └── main.tsx            # React Entry
├── *.sql                   # MySQL Database Scripts (Schema, Seeds, Triggers, etc.)
├── app.py                  # Flask Backend Application
├── config.py               # Flask Configuration
├── requirements.txt        # Python Dependencies
├── package.json            # Node Dependencies
├── vite.config.ts          # Vite Config (Proxy rules)
└── .env.example            # Environment variables template
```

## Requirements

- Node.js (v18+)
- Python 3.12
- MySQL Server 8.x local

## Configuration

1. Copy `.env.example` to `.env` (or set environment variables manually).
2. Configure your MySQL credentials and a secure Flask secret key:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=rideflow
   SECRET_KEY=your_secret_key_here
   ```

## Setup & Running

### 1. Initialize the Database

Run the setup file first as a MySQL root user to create the database:
```powershell
mysql.exe -u root -p --execute="source C:/absolute/path/to/RideFlow/00_setup.sql"
```

Then load the full schema, seed data, triggers, procedures, views, permissions, indexes, and reports using the master runner:
```powershell
mysql.exe -u root -p rideflow --execute="source C:/absolute/path/to/RideFlow/run_all.sql"
```

### 2. Start the Flask Backend

Install Python dependencies and start the Flask server:
```powershell
python -m pip install -r requirements.txt
python app.py
```
*The Flask server starts on `http://127.0.0.1:5000` with debug mode enabled.*

### 3. Start the React Frontend

Open a new terminal, install Node dependencies, and start the Vite dev server:
```powershell
npm install
npm run dev
```
*The React app starts on `http://localhost:5173`.*

## Demo Logins

The application is seeded with demo accounts for testing all roles. The system uses bcrypt hashing.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rideflow.test | Admin1234 |
| Rider | rider@rideflow.test | Rider1234 |
| Driver | driver@rideflow.test | Driver123 |

*(Note: You can also create a new account via the `/signup` page. Driver accounts require a license number and CNIC).*

## Main Features

### Admin
- Live platform stats: users, completed rides, active rides, revenue, open complaints, online drivers
- Revenue charts by city and by payment method
- Driver leaderboard and top-driver listings
- Active ride monitoring
- Complaint resolution or dismissal
- User suspension and reactivation
- Vehicle inventory view

### Rider
- Interactive, dark-themed dashboard
- Book a ride by choosing pickup, drop-off, and vehicle type
- Automatic driver assignment for matching requests
- Ride history with status badges
- Rate a driver after a completed ride
- File complaints and review complaint status

### Driver
- Switch availability online/offline
- View assigned rides and progress them from accepted to completed
- See earnings, wallet balance, commission, and completed ride count
- Request a payout from the wallet
- Review rider ratings and comments
