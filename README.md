# RideFlow — Complete Setup & Reference Guide

**Students:** 24i_0026 / 24i_0127  
**Course:** Database Systems Lab (AI & DS) — Spring 2026  
**Stack:** MySQL 8.x · Python 3.12 · Flask 3.x

---

## Project Structure

```
db lab/
│
├── 📄 00_setup.sql          Phase 1 — Create rideflow DB + MySQL users
├── 📄 02_schema.sql         Phase 2 — All 11 tables, constraints, FKs
├── 📄 03_seed.sql           Phase 3 — Realistic seed data (all tables)
├── 📄 04_triggers.sql       Phase 4 — 4 business-logic triggers
├── 📄 05_procedures.sql     Phase 5 — 4 stored procedures (fixed)
├── 📄 06_views.sql          Phase 6 — 5 analytical views (fixed)
├── 📄 07_dcl.sql            Phase 7 — Role-based access control
├── 📄 08_indexes.sql        Phase 8 — 13 performance indexes
├── 📄 09_reports.sql        Phase 9 — 10 reporting queries
├── 📄 run_all.sql           Master runner (sources all phases)
│
├── 🐍 app.py                Flask backend — all API routes
├── 🐍 config.py             DB connection settings ← SET PASSWORD HERE
├── 📄 requirements.txt      Python dependencies
│
├── templates/
│   ├── login.html           Sign-in page
│   ├── admin_dashboard.html Admin portal (stats, charts, management)
│   ├── rider_dashboard.html Rider portal (book, history, complaints)
│   └── driver_dashboard.html Driver portal (availability, rides, earnings)
│
└── static/
    ├── style.css            Global design system (glassmorphic dark theme)
    └── main.js              Shared JS utilities (toast, api, badge, pkr)
```

---

## Quick Start

### Step 1 — Configure DB password

Open `config.py` and set your MySQL root password:

```python
'password': 'your_mysql_root_password_here',
```

### Step 2 — Load the database

**Option A — MySQL Workbench:**  
Open each SQL file and run in order: `00 → 02 → 03 → 04 → 05 → 06 → 07 → 08`

**Option B — Command line:**
```bash
cd "c:\Users\surface\Desktop\db lab"
mysql -u root -p < 00_setup.sql
mysql -u root -p rideflow < 02_schema.sql
mysql -u root -p rideflow < 03_seed.sql
mysql -u root -p rideflow < 04_triggers.sql
mysql -u root -p rideflow < 05_procedures.sql
mysql -u root -p rideflow < 06_views.sql
mysql -u root -p rideflow < 07_dcl.sql
mysql -u root -p rideflow < 08_indexes.sql
```

### Step 3 — Start the web app

```powershell
cd "c:\Users\surface\Desktop\db lab"
python app.py
```

Open **http://localhost:5000** in your browser.

---

## Demo Login Credentials

| Role   | Email                        | Password |
|--------|------------------------------|----------|
| Admin  | `ali.raza@rideflow.pk`       | `ali`    |
| Rider  | `sara.ahmed@gmail.com`       | `sara`   |
| Rider  | `hamza.khan@gmail.com`       | `hamza`  |
| Driver | `bilal.driver@gmail.com`     | `bilal`  |
| Driver | `kamran.iqbal@gmail.com`     | `kamran` |

> **Rule:** Password = user's first name (case-insensitive). This is intentional demo behaviour.

---

## Web App Features

### Admin Dashboard
- Live stats: users, rides, revenue, active rides, complaints, online drivers
- Revenue by city (bar chart) and by payment method (doughnut chart)
- Driver leaderboard ranked by average rating per city
- Active rides table (in real-time)
- Complaint management — resolve or dismiss
- User management — suspend or re-activate accounts

### Rider Dashboard
- Book a ride with pickup/dropoff selector and vehicle type chooser
- Auto-assigns nearest available verified driver
- Ride history with status badges
- Rate driver (1–5 stars) after completed rides — blocked if already rated
- Apply promo codes (`WELCOME10`, `RIDE20`, `NEWUSER25`) to completed rides
- File complaints against any ride
- View filed complaints with status

### Driver Dashboard
- Toggle Online / Offline availability
- View assigned rides (Accepted → start → InProgress → complete)
- Fare auto-calculated via `CalculateFare()` stored procedure on completion
- Payment auto-created; trigger credits wallet minus commission
- Wallet balance display + payout request
- Earnings breakdown (gross, commission, net) with doughnut chart
- Rating history from riders

---

## Database Schema (11 Tables)

| Table            | Type        | Seed Rows |
|------------------|-------------|-----------|
| USERS            | Strong      | 11        |
| USER_PHONES      | Multi-val   | 12        |
| LOCATIONS        | Strong      | 12        |
| DRIVERS          | Strong      | 5         |
| VEHICLES         | Strong      | 6         |
| PROMOCODES       | Strong      | 5         |
| RIDES            | Strong      | 10        |
| PAYMENTS         | Strong      | 6         |
| USER_PROMOCODES  | Associative | 5         |
| RATINGS          | Weak        | 12        |
| COMPLAINTS       | Strong      | 3         |

---

## Stored Procedures

```sql
-- Recalculate fare (auto-called on ride completion)
CALL CalculateFare(1);

-- Apply surge pricing (multiplier 1.0–5.0)
CALL ApplySurgePricing(1, 2.00);

-- Apply a promo code to a completed ride's payment
CALL ApplyPromoCode(1, 'WELCOME10');

-- Request wallet payout (resets balance to 0)
CALL RequestPayout(1);
```

---

## Triggers

| Trigger                    | Event                  | Effect                                      |
|----------------------------|------------------------|---------------------------------------------|
| `trg_SuspendLowRatedDriver`| AFTER INSERT on RATINGS| Suspends driver if avg rating < 3.5         |
| `trg_DriverOnlineAfterRide`| AFTER UPDATE on RIDES  | Sets driver Online when ride Completed      |
| `trg_CreditDriverWallet`   | AFTER INSERT on PAYMENTS| Credits net earnings to driver wallet      |
| `trg_FlagLowRatedRider`    | AFTER INSERT on RATINGS| Suspends rider if avg rating < 3.0          |

---

## Bug Fixes Applied (Refactor v2)

| Bug | Fix |
|-----|-----|
| `CalculateFare` CASE with multiple SETs (invalid MySQL syntax) | Replaced with `IF/ELSEIF` blocks |
| `vw_DriverLeaderboard` excluded drivers with NULL location | Changed `JOIN` to `LEFT JOIN LOCATIONS` |
| `vw_DriverEarnings` excluded drivers with 0 rides | Changed inner JOINs to `LEFT JOIN` + `COALESCE` |
| `loadMyComplaints()` called wrong API endpoint | Fixed to call `/api/rider/complaints` |
| Missing `/api/rider/complaints` endpoint | Added to `app.py` |
| `api_complete_ride` reused stale cursor after callproc | Refactored into multi-step with fresh connections |
| `Decimal` values not JSON-serializable | Added `Decimal → float` in `clean()` helper |
| Rider could submit duplicate ratings | Added `AlreadyRated` flag from DB; button hidden |
| No input validation on API endpoints | Added checks with descriptive error messages |
| Admin could suspend themselves | Added self-modify guard |
| Chart.js canvases re-rendered without destroying old instance | Added `ctx._chart.destroy()` before redraw |

---

## API Reference

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/login` | — | Authenticate user |
| GET | `/logout` | — | Clear session |
| GET | `/api/admin/stats` | Admin | Platform stats |
| GET | `/api/admin/revenue-city` | Admin | Revenue by city |
| GET | `/api/admin/revenue-method` | Admin | Revenue by payment method |
| GET | `/api/admin/leaderboard` | Admin | Driver leaderboard |
| GET | `/api/admin/active-rides` | Admin | InProgress rides |
| GET | `/api/admin/complaints` | Admin | All complaints |
| POST | `/api/admin/complaints/<id>/<action>` | Admin | Resolve or dismiss |
| GET | `/api/admin/users` | Admin | All users |
| POST | `/api/admin/users/<id>/toggle` | Admin | Suspend/activate |
| GET | `/api/rider/locations` | Rider | All locations |
| GET | `/api/rider/rides` | Rider | Own ride history |
| GET | `/api/rider/complaints` | Rider | Own complaints |
| POST | `/api/rider/request` | Rider | Book a ride |
| POST | `/api/rider/rate` | Rider | Rate a driver |
| POST | `/api/rider/promo` | Rider | Apply promo code |
| POST | `/api/rider/complaint` | Rider | File a complaint |
| GET | `/api/driver/profile` | Driver | Profile + earnings |
| POST | `/api/driver/toggle` | Driver | Toggle availability |
| GET | `/api/driver/requests` | Driver | Assigned rides |
| POST | `/api/driver/ride/<id>/start` | Driver | Start a ride |
| POST | `/api/driver/ride/<id>/complete` | Driver | Complete + auto-pay |
| GET | `/api/driver/ratings` | Driver | Received ratings |
| POST | `/api/driver/payout` | Driver | Request payout |
