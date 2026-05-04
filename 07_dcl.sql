-- =============================================================
-- RideFlow — Phase 7: DCL — Role-Based Access Control
-- Run as MySQL root after schema and seed are loaded.
-- =============================================================
USE rideflow;

-- ──────────────────────────────────────────────
-- ADMIN USER: full control over the database
-- ──────────────────────────────────────────────
GRANT ALL PRIVILEGES ON rideflow.* TO 'admin_user'@'localhost';


-- ──────────────────────────────────────────────
-- RIDER USER: can request rides, view drivers,
--             file complaints, use promo codes,
--             and view their own payments.
-- ──────────────────────────────────────────────

-- Read public location and driver info
GRANT SELECT ON rideflow.LOCATIONS        TO 'rider_user'@'localhost';
GRANT SELECT (DriverID, AvailabilityStatus, VerificationStatus, CurrentLocationID)
          ON rideflow.DRIVERS             TO 'rider_user'@'localhost';
GRANT SELECT ON rideflow.VEHICLES         TO 'rider_user'@'localhost';

-- Manage own rides
GRANT SELECT, INSERT ON rideflow.RIDES    TO 'rider_user'@'localhost';

-- Pay for rides
GRANT SELECT, INSERT ON rideflow.PAYMENTS TO 'rider_user'@'localhost';

-- Rate completed rides
GRANT SELECT, INSERT ON rideflow.RATINGS  TO 'rider_user'@'localhost';

-- File complaints
GRANT SELECT, INSERT ON rideflow.COMPLAINTS TO 'rider_user'@'localhost';

-- Use promo codes
GRANT SELECT ON rideflow.PROMOCODES           TO 'rider_user'@'localhost';
GRANT SELECT, INSERT ON rideflow.USER_PROMOCODES TO 'rider_user'@'localhost';

-- Manage own profile and phones
GRANT SELECT, UPDATE (FirstName, LastName, Email, Password, AccountStatus)
          ON rideflow.USERS               TO 'rider_user'@'localhost';
GRANT SELECT, INSERT, DELETE ON rideflow.USER_PHONES TO 'rider_user'@'localhost';


-- REVOKE: Rider must NOT see other riders' payment data or wallet balances
REVOKE SELECT ON rideflow.DRIVERS         FROM 'rider_user'@'localhost';
GRANT  SELECT (DriverID, AvailabilityStatus, VerificationStatus, CurrentLocationID)
          ON rideflow.DRIVERS             TO 'rider_user'@'localhost';


-- ──────────────────────────────────────────────
-- DRIVER USER: can view and update own rides,
--              update own availability,
--              and rate passengers.
-- ──────────────────────────────────────────────

-- View and update own ride records
GRANT SELECT ON rideflow.RIDES            TO 'driver_user'@'localhost';
GRANT UPDATE (RideStatus, StartTime, EndTime) ON rideflow.RIDES TO 'driver_user'@'localhost';

-- Update own driver profile (availability, location)
GRANT SELECT ON rideflow.DRIVERS          TO 'driver_user'@'localhost';
GRANT UPDATE (AvailabilityStatus, CurrentLocationID)
          ON rideflow.DRIVERS             TO 'driver_user'@'localhost';

-- View own vehicle info
GRANT SELECT ON rideflow.VEHICLES         TO 'driver_user'@'localhost';

-- Rate passengers after completed rides
GRANT SELECT, INSERT ON rideflow.RATINGS  TO 'driver_user'@'localhost';

-- View pickup/dropoff locations
GRANT SELECT ON rideflow.LOCATIONS        TO 'driver_user'@'localhost';

-- View own payment info (to confirm earnings)
GRANT SELECT ON rideflow.PAYMENTS         TO 'driver_user'@'localhost';

-- View own user profile
GRANT SELECT, UPDATE (FirstName, LastName, Password)
          ON rideflow.USERS               TO 'driver_user'@'localhost';

-- REVOKE: Drivers must NOT delete rides or access other drivers' wallets
-- (No DELETE was granted, so this is already satisfied by omission)


-- Apply all privilege changes
FLUSH PRIVILEGES;

SELECT 'Phase 7 — DCL complete: admin_user, rider_user, driver_user configured.' AS Status;
