# RideFlow

RideFlow is a ride-hailing database project built with MySQL 8 and a Flask web app. It models the full flow of a small ride platform: authentication, ride booking, driver assignment, trip completion, payments, ratings, complaints, wallet payouts, admin reporting, and role-based access control.

## Stack

- MySQL 8.x
- Python 3.12
- Flask 3.x
- mysql-connector-python

## What is in the system

The database layer is split into numbered SQL phases plus a single master runner:

- 00_setup.sql creates the rideflow database and demo MySQL users.
- 02_schema.sql creates the 11 core tables.
- 03_seed.sql loads demo data.
- 04_triggers.sql adds business triggers.
- 05_procedures.sql adds stored procedures such as fare calculation, surge pricing, promo redemption, and payout handling.
- 06_views.sql adds reporting views.
- 07_dcl.sql applies role-based permissions.
- 08_indexes.sql adds performance indexes.
- 09_reports.sql contains reporting queries for the database lab.
- run_all.sql runs every phase in order.

The Flask app in app.py provides the web UI and JSON endpoints for three roles:

- Admin dashboard for platform stats, revenue charts, complaint handling, vehicle management, and user controls.
- Rider dashboard for booking rides, viewing history, rating drivers, applying promo codes, and filing complaints.
- Driver dashboard for availability, assigned rides, earnings, wallet balance, payouts, and ratings.

## Project Layout

```
RideFlow/
├── 00_setup.sql
├── 02_schema.sql
├── 03_seed.sql
├── 04_triggers.sql
├── 05_procedures.sql
├── 06_views.sql
├── 07_dcl.sql
├── 08_indexes.sql
├── 09_reports.sql
├── run_all.sql
├── app.py
├── config.py
├── requirements.txt
├── templates/
└── static/
```

## Requirements

- MySQL Server 8.x running locally
- Python 3.12 or compatible 3.x release
- A terminal or MySQL client such as Workbench

## Configuration

config.py reads database settings from environment variables or a local .env file.

Supported variables:

- MYSQL_HOST default: localhost
- MYSQL_USER default: root
- MYSQL_PASSWORD default: empty
- MYSQL_DATABASE default: rideflow
- MYSQL_CHARSET default: utf8mb4
- MYSQL_AUTOCOMMIT default: false
- SECRET_KEY default: a development-only placeholder value

If you do not use a .env file, set MYSQL_PASSWORD to your MySQL password before starting the app.

## Setup

### 1. Install Python dependencies

```powershell
cd "c:\Users\surface\Desktop\RideFlow"
python -m pip install -r requirements.txt
```

### 2. Initialize the database

Run the setup file first as a MySQL root user:

```powershell
mysql.exe -u root -p --execute="source C:/Users/surface/Desktop/RideFlow/00_setup.sql"
```

Then load the full schema, seed data, triggers, procedures, views, permissions, indexes, and reports. The simplest option is the master runner:

```powershell
mysql.exe -u root -p rideflow --execute="source C:/Users/surface/Desktop/RideFlow/run_all.sql"
```

If you prefer MySQL Workbench, open and run the SQL files in this order:

00_setup.sql -> 02_schema.sql -> 03_seed.sql -> 04_triggers.sql -> 05_procedures.sql -> 06_views.sql -> 07_dcl.sql -> 08_indexes.sql -> 09_reports.sql

Note: on Windows PowerShell, mysql < file.sql redirection is often unreliable. Use source ... or Workbench instead.

### 3. Configure database access for Flask

The app uses the values from config.py or .env. For local development, the database defaults are:

- host: localhost
- user: root
- database: rideflow

Set MYSQL_PASSWORD to your local MySQL password before running the app.

### 4. Start the web app

```powershell
cd "c:\Users\surface\Desktop\RideFlow"
python app.py
```

The Flask server starts on http://localhost:5000 with debug mode enabled.

## Demo Logins

The login page uses demo accounts seeded in the database. The password is the user's first name, case-insensitive.

| Role | Email | Password |
|------|-------|----------|
| Admin | ali.raza@rideflow.pk | ali |
| Rider | sara.ahmed@gmail.com | sara |
| Rider | hamza.khan@gmail.com | hamza |
| Driver | bilal.driver@gmail.com | bilal |
| Driver | kamran.iqbal@gmail.com | kamran |

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

- Book a ride by choosing pickup, drop-off, and vehicle type
- Automatic driver assignment for matching requests
- Ride history with status badges
- Rate a driver after a completed ride
- Apply promo codes to a completed ride
- File complaints and review complaint status

### Driver

- Switch availability online/offline
- View assigned rides and progress them from accepted to completed
- See earnings, wallet balance, commission, and completed ride count
- Request a payout from the wallet
- Review rider ratings and comments

## Database Objects

The schema contains 11 tables:

- USERS
- USER_PHONES
- LOCATIONS
- DRIVERS
- VEHICLES
- PROMOCODES
- RIDES
- PAYMENTS
- COMPLAINTS
- RATINGS
- USER_PROMOCODES

The system also includes stored procedures, triggers, views, DCL rules, and indexes to support the dashboards and reporting queries.

## API Surface

app.py exposes JSON endpoints for login, logout, and role-specific actions. The main groups are:

- Admin: stats, revenue charts, leaderboard, active rides, complaints, users, and vehicles
- Rider: locations, ride history, booking, ratings, promo codes, and complaints
- Driver: profile, toggle availability, assigned rides, ride start/complete, ratings, and payout

## Notes

- app.py runs with debug=True and port 5000.
- Driver wallet credits and ride completion logic are handled by the database triggers and procedures.
- If login fails with a database error, verify that MySQL is running and that MYSQL_PASSWORD matches your local setup.
