-- =============================================================
-- RideFlow — Driver Sample Data for Portal Testing
-- Creates sample drivers, rides, and payments for testing driver portal
-- =============================================================

USE rideflow;

-- Disable FK checks during data insertion
SET FOREIGN_KEY_CHECKS = 0;

-- ─────────────────────────────────────────────────────────────
-- 1. Sample Locations (Pickup/Dropoff points)
-- ─────────────────────────────────────────────────────────────
INSERT INTO LOCATIONS (LocationName, Street, City, State, Zip, Latitude, Longitude) VALUES
('Jinnah International Airport', 'Jinnah International Airport', 'Karachi', 'Sindh', '75000', 24.9065, 67.1607),
('Karachi Railway Station', 'Dr. Daudpota Road', 'Karachi', 'Sindh', '74200', 24.8668, 67.0011),
('Clifton Beach', 'Sea View Road', 'Karachi', 'Sindh', '75600', 24.8120, 67.0280),
('Dolmen Mall Clifton', 'Block 5', 'Karachi', 'Sindh', '75600', 24.8100, 67.0320),
('Karachi University', 'University Road', 'Karachi', 'Sindh', '75270', 24.9340, 67.1120),
('National Stadium', 'Stadium Road', 'Karachi', 'Sindh', '74800', 24.8615, 67.0599),
('Lucky One Mall', 'Main Rashid Minhas Road', 'Karachi', 'Sindh', '75800', 24.9330, 67.1120),
('Saddar Shopping Area', 'Saddar', 'Karachi', 'Sindh', '74400', 24.8615, 67.0010),
('Gulshan-e-Iqbal Block 13', 'Gulshan-e-Iqbal', 'Karachi', 'Sindh', '75300', 24.9230, 67.0740),
('Defence Housing Authority', 'DHA Phase 5', 'Karachi', 'Sindh', '75500', 24.8460, 67.0830);

-- ─────────────────────────────────────────────────────────────
-- 2. Sample Users (Drivers)
-- ─────────────────────────────────────────────────────────────
INSERT INTO USERS (FirstName, LastName, Email, Password, Role, AccountStatus) VALUES
('Ahmed', 'Khan', 'ahmed.khan@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Driver', 'Active'),
('Muhammad', 'Ali', 'muhammad.ali@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Driver', 'Active'),
('Sara', 'Fatima', 'sara.fatima@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Driver', 'Active'),
('Omar', 'Hassan', 'omar.hassan@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Driver', 'Active'),
('Ayesha', 'Malik', 'ayesha.malik@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Driver', 'Active');

-- ─────────────────────────────────────────────────────────────
-- 3. Sample Driver Records
-- ─────────────────────────────────────────────────────────────
INSERT INTO DRIVERS (UserID, LicenseNumber, CNIC, ProfilePhoto, VerificationStatus, AvailabilityStatus, WalletBalance, CommissionRate, CurrentLocationID) VALUES
(1, 'DRV-2023-001', '42101-1234567-1', '/profiles/ahmed.jpg', 'Verified', 'Online', 15420.50, 10.00, 1),
(2, 'DRV-2023-002', '42101-2345678-1', '/profiles/muhammad.jpg', 'Verified', 'Online', 8930.75, 12.00, 2),
(3, 'DRV-2023-003', '42101-3456789-1', '/profiles/sara.jpg', 'Verified', 'Offline', 22650.00, 8.00, 3),
(4, 'DRV-2023-004', '42101-4567890-1', '/profiles/omar.jpg', 'Verified', 'Online', 6780.25, 15.00, 4),
(5, 'DRV-2023-005', '42101-5678901-1', '/profiles/ayesha.jpg', 'Verified', 'In-Ride', 31200.00, 10.00, 5);

-- ─────────────────────────────────────────────────────────────
-- 4. Sample Vehicles for each driver
-- ─────────────────────────────────────────────────────────────
INSERT INTO VEHICLES (DriverID, Make, Model, Year, Color, LicensePlate, VehicleType, VerificationStatus) VALUES
(1, 'Toyota', 'Corolla', 2020, 'White', 'ABC-123', 'Economy', 'Verified'),
(1, 'Honda', 'City', 2019, 'Silver', 'ABC-124', 'Economy', 'Verified'),
(2, 'Suzuki', 'Mehran', 2018, 'Blue', 'XYZ-789', 'Economy', 'Verified'),
(3, 'Toyota', 'Prius', 2021, 'Black', 'DEF-456', 'Business', 'Verified'),
(4, 'Yamaha', 'YBR-125', 2022, 'Red', 'GHI-101', 'Bike', 'Verified'),
(5, 'Honda', 'Civic', 2020, 'Gray', 'JKL-202', 'Business', 'Verified');

-- ─────────────────────────────────────────────────────────────
-- 5. Sample Customers (for rides)
-- ─────────────────────────────────────────────────────────────
INSERT INTO USERS (FirstName, LastName, Email, Password, Role, AccountStatus) VALUES
('Ali', 'Raza', 'ali.raza@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Rider', 'Active'),
('Fatima', 'Sheikh', 'fatima.sheikh@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Rider', 'Active'),
('Bilal', 'Ahmed', 'bilal.ahmed@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Rider', 'Active'),
('Zainab', 'Khan', 'zainab.khan@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Rider', 'Active'),
('Umer', 'Siddiqui', 'umer.siddiqui@email.com', '$2b$10$rQZ8ZqGQJqKqQqQqQqQqQu', 'Rider', 'Active');

-- ─────────────────────────────────────────────────────────────
-- 6. Sample Rides for each driver with different statuses
-- ─────────────────────────────────────────────────────────────
-- Driver 1 (Ahmed Khan) - 15 completed rides, 2 in-progress
INSERT INTO RIDES (CustomerID, DriverID, VehicleID, PickupLocationID, DropoffLocationID, RideStatus, Fare, Distance, StartTime, EndTime, SurgeMultiplier) VALUES
(6, 1, 1, 1, 2, 'Completed', 450.00, 12.5, '2024-01-15 08:30:00', '2024-01-15 09:15:00', 1.00),
(7, 1, 1, 2, 3, 'Completed', 380.00, 8.2, '2024-01-16 14:20:00', '2024-01-16 14:50:00', 1.00),
(8, 1, 2, 3, 4, 'Completed', 520.00, 15.3, '2024-01-17 09:10:00', '2024-01-17 09:45:00', 1.20),
(6, 1, 1, 4, 5, 'Completed', 280.00, 6.8, '2024-01-18 16:45:00', '2024-01-18 17:05:00', 1.00),
(7, 1, 1, 5, 6, 'Completed', 350.00, 9.1, '2024-01-19 11:30:00', '2024-01-19 12:00:00', 1.00),
(8, 1, 2, 6, 7, 'Completed', 420.00, 11.4, '2024-01-20 13:15:00', '2024-01-20 13:50:00', 1.10),
(6, 1, 1, 7, 8, 'Completed', 290.00, 7.2, '2024-01-21 10:20:00', '2024-01-21 10:45:00', 1.00),
(7, 1, 1, 8, 9, 'Completed', 380.00, 10.5, '2024-01-22 15:30:00', '2024-01-22 16:05:00', 1.00),
(8, 1, 2, 9, 10, 'Completed', 550.00, 16.8, '2024-01-23 08:45:00', '2024-01-23 09:30:00', 1.30),
(6, 1, 1, 10, 1, 'Completed', 480.00, 14.2, '2024-01-24 12:10:00', '2024-01-24 12:55:00', 1.15),
(7, 1, 1, 1, 3, 'Completed', 320.00, 8.9, '2024-01-25 17:20:00', '2024-01-25 17:50:00', 1.00),
(8, 1, 2, 2, 4, 'Completed', 410.00, 11.1, '2024-01-26 09:40:00', '2024-01-26 10:20:00', 1.05),
(6, 1, 1, 3, 5, 'Completed', 360.00, 9.6, '2024-01-27 14:15:00', '2024-01-27 14:45:00', 1.00),
(7, 1, 1, 4, 6, 'Completed', 440.00, 12.8, '2024-01-28 11:25:00', '2024-01-28 12:05:00', 1.10),
(8, 1, 2, 5, 7, 'Completed', 390.00, 10.3, '2024-01-29 16:30:00', '2024-01-29 17:00:00', 1.00),
(6, 1, 1, 6, 8, 'InProgress', 0.00, 0.0, '2024-01-30 08:00:00', NULL, 1.00),
(7, 1, 2, 7, 9, 'InProgress', 0.00, 0.0, '2024-01-30 09:30:00', NULL, 1.00);

-- Driver 2 (Muhammad Ali) - 12 completed rides, 1 cancelled
INSERT INTO RIDES (CustomerID, DriverID, VehicleID, PickupLocationID, DropoffLocationID, RideStatus, Fare, Distance, StartTime, EndTime, SurgeMultiplier) VALUES
(6, 2, 3, 1, 2, 'Completed', 420.00, 11.8, '2024-01-15 10:15:00', '2024-01-15 10:55:00', 1.00),
(7, 2, 3, 2, 3, 'Completed', 350.00, 7.9, '2024-01-16 13:45:00', '2024-01-16 14:15:00', 1.00),
(8, 2, 3, 3, 4, 'Completed', 480.00, 13.2, '2024-01-17 08:30:00', '2024-01-17 09:10:00', 1.10),
(6, 2, 3, 4, 5, 'Completed', 310.00, 7.1, '2024-01-18 15:20:00', '2024-01-18 15:45:00', 1.00),
(7, 2, 3, 5, 6, 'Completed', 380.00, 9.8, '2024-01-19 12:10:00', '2024-01-19 12:40:00', 1.00),
(8, 2, 3, 6, 7, 'Completed', 450.00, 12.5, '2024-01-20 14:35:00', '2024-01-20 15:15:00', 1.15),
(6, 2, 3, 7, 8, 'Completed', 290.00, 6.9, '2024-01-21 09:25:00', '2024-01-21 09:50:00', 1.00),
(7, 2, 3, 8, 9, 'Completed', 360.00, 9.4, '2024-01-22 16:40:00', '2024-01-22 17:10:00', 1.00),
(8, 2, 3, 9, 10, 'Completed', 520.00, 15.7, '2024-01-23 07:50:00', '2024-01-23 08:35:00', 1.25),
(6, 2, 3, 10, 1, 'Completed', 460.00, 13.6, '2024-01-24 11:15:00', '2024-01-24 12:00:00', 1.10),
(7, 2, 3, 1, 3, 'Completed', 340.00, 8.3, '2024-01-25 14:20:00', '2024-01-25 14:50:00', 1.00),
(8, 2, 3, 2, 4, 'Cancelled', 0.00, 0.0, '2024-01-26 10:30:00', '2024-01-26 10:35:00', 1.00);

-- Driver 3 (Sara Fatima) - 18 completed rides
INSERT INTO RIDES (CustomerID, DriverID, VehicleID, PickupLocationID, DropoffLocationID, RideStatus, Fare, Distance, StartTime, EndTime, SurgeMultiplier) VALUES
(6, 3, 4, 1, 2, 'Completed', 680.00, 12.5, '2024-01-15 07:45:00', '2024-01-15 08:25:00', 1.20),
(7, 3, 4, 2, 3, 'Completed', 590.00, 8.2, '2024-01-16 12:30:00', '2024-01-16 13:05:00', 1.15),
(8, 3, 4, 3, 4, 'Completed', 750.00, 15.3, '2024-01-17 09:15:00', '2024-01-17 10:00:00', 1.25),
(6, 3, 4, 4, 5, 'Completed', 520.00, 6.8, '2024-01-18 14:10:00', '2024-01-18 14:35:00', 1.10),
(7, 3, 4, 5, 6, 'Completed', 620.00, 9.1, '2024-01-19 10:45:00', '2024-01-19 11:25:00', 1.15),
(8, 3, 4, 6, 7, 'Completed', 720.00, 11.4, '2024-01-20 13:00:00', '2024-01-20 13:45:00', 1.20),
(6, 3, 4, 7, 8, 'Completed', 540.00, 7.2, '2024-01-21 08:50:00', '2024-01-21 09:20:00', 1.10),
(7, 3, 4, 8, 9, 'Completed', 650.00, 10.5, '2024-01-22 15:45:00', '2024-01-22 16:30:00', 1.15),
(8, 3, 4, 9, 10, 'Completed', 820.00, 16.8, '2024-01-23 07:30:00', '2024-01-23 08:20:00', 1.30),
(6, 3, 4, 10, 1, 'Completed', 760.00, 14.2, '2024-01-24 11:00:00', '2024-01-24 11:55:00', 1.25),
(7, 3, 4, 1, 3, 'Completed', 580.00, 8.9, '2024-01-25 13:30:00', '2024-01-25 14:05:00', 1.10),
(8, 3, 4, 2, 4, 'Completed', 690.00, 11.1, '2024-01-26 09:20:00', '2024-01-26 10:05:00', 1.15),
(6, 3, 4, 3, 5, 'Completed', 610.00, 9.6, '2024-01-27 14:00:00', '2024-01-27 14:40:00', 1.10),
(7, 3, 4, 4, 6, 'Completed', 740.00, 12.8, '2024-01-28 10:15:00', '2024-01-28 11:00:00', 1.20),
(8, 3, 4, 5, 7, 'Completed', 660.00, 10.3, '2024-01-29 16:00:00', '2024-01-29 16:40:00', 1.10),
(6, 3, 4, 6, 8, 'Completed', 570.00, 8.7, '2024-01-30 09:10:00', '2024-01-30 09:45:00', 1.10),
(7, 3, 4, 7, 9, 'Completed', 700.00, 11.9, '2024-01-31 12:25:00', '2024-01-31 13:10:00', 1.15),
(8, 3, 4, 8, 10, 'Completed', 790.00, 14.6, '2024-02-01 08:40:00', '2024-02-01 09:30:00', 1.20);

-- Driver 4 (Omar Hassan) - 8 completed rides (Bike driver)
INSERT INTO RIDES (CustomerID, DriverID, VehicleID, PickupLocationID, DropoffLocationID, RideStatus, Fare, Distance, StartTime, EndTime, SurgeMultiplier) VALUES
(6, 4, 5, 1, 2, 'Completed', 180.00, 11.8, '2024-01-15 11:30:00', '2024-01-15 11:50:00', 1.00),
(7, 4, 5, 2, 3, 'Completed', 150.00, 7.9, '2024-01-16 14:15:00', '2024-01-16 14:30:00', 1.00),
(8, 4, 5, 3, 4, 'Completed', 200.00, 13.2, '2024-01-17 09:00:00', '2024-01-17 09:20:00', 1.00),
(6, 4, 5, 4, 5, 'Completed', 130.00, 7.1, '2024-01-18 16:00:00', '2024-01-18 16:15:00', 1.00),
(7, 4, 5, 5, 6, 'Completed', 160.00, 9.8, '2024-01-19 12:45:00', '2024-01-19 13:00:00', 1.00),
(8, 4, 5, 6, 7, 'Completed', 190.00, 12.5, '2024-01-20 15:30:00', '2024-01-20 15:50:00', 1.00),
(6, 4, 5, 7, 8, 'Completed', 140.00, 6.9, '2024-01-21 10:00:00', '2024-01-21 10:15:00', 1.00),
(7, 4, 5, 8, 9, 'Completed', 170.00, 9.4, '2024-01-22 13:20:00', '2024-01-22 13:35:00', 1.00);

-- Driver 5 (Ayesha Malik) - 20 completed rides
INSERT INTO RIDES (CustomerID, DriverID, VehicleID, PickupLocationID, DropoffLocationID, RideStatus, Fare, Distance, StartTime, EndTime, SurgeMultiplier) VALUES
(6, 5, 6, 1, 2, 'Completed', 550.00, 12.5, '2024-01-15 08:00:00', '2024-01-15 08:45:00', 1.10),
(7, 5, 6, 2, 3, 'Completed', 480.00, 8.2, '2024-01-16 11:20:00', '2024-01-16 11:55:00', 1.05),
(8, 5, 6, 3, 4, 'Completed', 620.00, 15.3, '2024-01-17 07:30:00', '2024-01-17 08:15:00', 1.15),
(6, 5, 6, 4, 5, 'Completed', 420.00, 6.8, '2024-01-18 13:45:00', '2024-01-18 14:10:00', 1.00),
(7, 5, 6, 5, 6, 'Completed', 500.00, 9.1, '2024-01-19 10:00:00', '2024-01-19 10:40:00', 1.05),
(8, 5, 6, 6, 7, 'Completed', 580.00, 11.4, '2024-01-20 12:15:00', '2024-01-20 13:00:00', 1.10),
(6, 5, 6, 7, 8, 'Completed', 440.00, 7.2, '2024-01-21 09:35:00', '2024-01-21 10:00:00', 1.00),
(7, 5, 6, 8, 9, 'Completed', 520.00, 10.5, '2024-01-22 14:50:00', '2024-01-22 15:35:00', 1.05),
(8, 5, 6, 9, 10, 'Completed', 680.00, 16.8, '2024-01-23 06:45:00', '2024-01-23 07:35:00', 1.20),
(6, 5, 6, 10, 1, 'Completed', 620.00, 14.2, '2024-01-24 10:30:00', '2024-01-24 11:25:00', 1.15),
(7, 5, 6, 1, 3, 'Completed', 460.00, 8.9, '2024-01-25 12:40:00', '2024-01-25 13:15:00', 1.00),
(8, 5, 6, 2, 4, 'Completed', 540.00, 11.1, '2024-01-26 08:50:00', '2024-01-26 09:35:00', 1.05),
(6, 5, 6, 3, 5, 'Completed', 480.00, 9.6, '2024-01-27 13:25:00', '2024-01-27 14:05:00', 1.00),
(7, 5, 6, 4, 6, 'Completed', 580.00, 12.8, '2024-01-28 09:50:00', '2024-01-28 10:35:00', 1.10),
(8, 5, 6, 5, 7, 'Completed', 510.00, 10.3, '2024-01-29 15:15:00', '2024-01-29 15:50:00', 1.00),
(6, 5, 6, 6, 8, 'Completed', 430.00, 8.7, '2024-01-30 08:20:00', '2024-01-30 08:55:00', 1.00),
(7, 5, 6, 7, 9, 'Completed', 560.00, 11.9, '2024-01-31 11:45:00', '2024-01-31 12:30:00', 1.05),
(8, 5, 6, 8, 10, 'Completed', 640.00, 14.6, '2024-02-01 07:55:00', '2024-02-01 08:45:00', 1.10),
(6, 5, 6, 9, 1, 'Completed', 590.00, 13.2, '2024-02-02 10:10:00', '2024-02-02 11:00:00', 1.05),
(7, 5, 6, 10, 2, 'Completed', 470.00, 9.5, '2024-02-03 13:30:00', '2024-02-03 14:10:00', 1.00);

-- ─────────────────────────────────────────────────────────────
-- 7. Sample Payments for completed rides
-- ─────────────────────────────────────────────────────────────
-- Driver 1 payments
INSERT INTO PAYMENTS (RideID, CustomerID, Amount, PaymentMethod, PaymentStatus, TransactionDate) VALUES
(1, 6, 450.00, 'CreditCard', 'Paid', '2024-01-15 09:16:00'),
(2, 7, 380.00, 'Wallet', 'Paid', '2024-01-16 14:51:00'),
(3, 8, 520.00, 'Cash', 'Paid', '2024-01-17 09:46:00'),
(4, 6, 280.00, 'CreditCard', 'Paid', '2024-01-18 17:06:00'),
(5, 7, 350.00, 'Wallet', 'Paid', '2024-01-19 12:01:00'),
(6, 8, 420.00, 'Cash', 'Paid', '2024-01-20 13:51:00'),
(7, 6, 290.00, 'CreditCard', 'Paid', '2024-01-21 10:46:00'),
(8, 7, 380.00, 'Wallet', 'Paid', '2024-01-22 16:06:00'),
(9, 8, 550.00, 'CreditCard', 'Paid', '2024-01-23 09:31:00'),
(10, 6, 480.00, 'Cash', 'Paid', '2024-01-24 12:56:00'),
(11, 7, 320.00, 'Wallet', 'Paid', '2024-01-25 17:51:00'),
(12, 8, 410.00, 'CreditCard', 'Paid', '2024-01-26 10:21:00'),
(13, 6, 360.00, 'Cash', 'Paid', '2024-01-27 14:46:00'),
(14, 7, 440.00, 'Wallet', 'Paid', '2024-01-28 12:06:00'),
(15, 8, 390.00, 'CreditCard', 'Paid', '2024-01-29 17:01:00');

-- Driver 2 payments
INSERT INTO PAYMENTS (RideID, CustomerID, Amount, PaymentMethod, PaymentStatus, TransactionDate) VALUES
(19, 6, 420.00, 'CreditCard', 'Paid', '2024-01-15 10:56:00'),
(20, 7, 350.00, 'Wallet', 'Paid', '2024-01-16 14:16:00'),
(21, 8, 480.00, 'Cash', 'Paid', '2024-01-17 09:11:00'),
(22, 6, 310.00, 'CreditCard', 'Paid', '2024-01-18 15:46:00'),
(23, 7, 380.00, 'Wallet', 'Paid', '2024-01-19 12:41:00'),
(24, 8, 450.00, 'Cash', 'Paid', '2024-01-20 15:16:00'),
(25, 6, 290.00, 'CreditCard', 'Paid', '2024-01-21 09:51:00'),
(26, 7, 360.00, 'Wallet', 'Paid', '2024-01-22 17:11:00'),
(27, 8, 520.00, 'CreditCard', 'Paid', '2024-01-23 08:36:00'),
(28, 6, 460.00, 'Cash', 'Paid', '2024-01-24 12:01:00'),
(29, 7, 340.00, 'Wallet', 'Paid', '2024-01-25 14:51:00'),
(31, 8, 0.00, 'CreditCard', 'Refunded', '2024-01-26 10:36:00');

-- Driver 3 payments
INSERT INTO PAYMENTS (RideID, CustomerID, Amount, PaymentMethod, PaymentStatus, TransactionDate) VALUES
(32, 6, 680.00, 'CreditCard', 'Paid', '2024-01-15 08:26:00'),
(33, 7, 590.00, 'Wallet', 'Paid', '2024-01-16 13:06:00'),
(34, 8, 750.00, 'Cash', 'Paid', '2024-01-17 10:01:00'),
(35, 6, 520.00, 'CreditCard', 'Paid', '2024-01-18 14:36:00'),
(36, 7, 620.00, 'Wallet', 'Paid', '2024-01-19 11:26:00'),
(37, 8, 720.00, 'Cash', 'Paid', '2024-01-20 13:46:00'),
(38, 6, 540.00, 'CreditCard', 'Paid', '2024-01-21 09:21:00'),
(39, 7, 650.00, 'Wallet', 'Paid', '2024-01-22 16:31:00'),
(40, 8, 820.00, 'CreditCard', 'Paid', '2024-01-23 08:21:00'),
(41, 6, 760.00, 'Cash', 'Paid', '2024-01-24 11:56:00'),
(42, 7, 580.00, 'Wallet', 'Paid', '2024-01-25 14:06:00'),
(43, 8, 690.00, 'CreditCard', 'Paid', '2024-01-26 10:06:00'),
(44, 6, 610.00, 'Cash', 'Paid', '2024-01-27 14:41:00'),
(45, 7, 740.00, 'Wallet', 'Paid', '2024-01-28 11:01:00'),
(46, 8, 660.00, 'CreditCard', 'Paid', '2024-01-29 16:41:00'),
(47, 6, 570.00, 'Cash', 'Paid', '2024-01-30 09:46:00'),
(48, 7, 700.00, 'Wallet', 'Paid', '2024-01-31 13:11:00'),
(49, 8, 790.00, 'CreditCard', 'Paid', '2024-02-01 09:31:00');

-- Driver 4 payments
INSERT INTO PAYMENTS (RideID, CustomerID, Amount, PaymentMethod, PaymentStatus, TransactionDate) VALUES
(50, 6, 180.00, 'Cash', 'Paid', '2024-01-15 11:51:00'),
(51, 7, 150.00, 'Wallet', 'Paid', '2024-01-16 14:31:00'),
(52, 8, 200.00, 'CreditCard', 'Paid', '2024-01-17 09:21:00'),
(53, 6, 130.00, 'Cash', 'Paid', '2024-01-18 16:16:00'),
(54, 7, 160.00, 'Wallet', 'Paid', '2024-01-19 13:01:00'),
(55, 8, 190.00, 'CreditCard', 'Paid', '2024-01-20 15:51:00'),
(56, 6, 140.00, 'Cash', 'Paid', '2024-01-21 10:16:00'),
(57, 7, 170.00, 'Wallet', 'Paid', '2024-01-22 13:36:00');

-- Driver 5 payments
INSERT INTO PAYMENTS (RideID, CustomerID, Amount, PaymentMethod, PaymentStatus, TransactionDate) VALUES
(58, 6, 550.00, 'CreditCard', 'Paid', '2024-01-15 08:46:00'),
(59, 7, 480.00, 'Wallet', 'Paid', '2024-01-16 11:56:00'),
(60, 8, 620.00, 'Cash', 'Paid', '2024-01-17 08:16:00'),
(61, 6, 420.00, 'CreditCard', 'Paid', '2024-01-18 14:11:00'),
(62, 7, 500.00, 'Wallet', 'Paid', '2024-01-19 10:41:00'),
(63, 8, 580.00, 'Cash', 'Paid', '2024-01-20 13:01:00'),
(64, 6, 440.00, 'CreditCard', 'Paid', '2024-01-21 10:01:00'),
(65, 7, 520.00, 'Wallet', 'Paid', '2024-01-22 15:36:00'),
(66, 8, 680.00, 'CreditCard', 'Paid', '2024-01-23 07:36:00'),
(67, 6, 620.00, 'Cash', 'Paid', '2024-01-24 11:26:00'),
(68, 7, 460.00, 'Wallet', 'Paid', '2024-01-25 13:16:00'),
(69, 8, 540.00, 'CreditCard', 'Paid', '2024-01-26 09:36:00'),
(70, 6, 480.00, 'Cash', 'Paid', '2024-01-27 14:06:00'),
(71, 7, 580.00, 'Wallet', 'Paid', '2024-01-28 10:36:00'),
(72, 8, 510.00, 'CreditCard', 'Paid', '2024-01-29 15:51:00'),
(73, 6, 430.00, 'Cash', 'Paid', '2024-01-30 08:56:00'),
(74, 7, 560.00, 'Wallet', 'Paid', '2024-01-31 12:31:00'),
(75, 8, 640.00, 'CreditCard', 'Paid', '2024-02-01 08:46:00'),
(76, 6, 590.00, 'Cash', 'Paid', '2024-02-02 11:01:00'),
(77, 7, 470.00, 'Wallet', 'Paid', '2024-02-03 14:11:00');

-- ─────────────────────────────────────────────────────────────
-- 8. Sample Ratings for completed rides
-- ─────────────────────────────────────────────────────────────
-- Driver 1 ratings
INSERT INTO RATINGS (RideID, RatedBy, RatedUserID, Score, Comment) VALUES
(1, 6, 1, 5, 'Great driver, very professional!'),
(2, 7, 1, 4, 'Good ride, clean car'),
(3, 8, 1, 5, 'Excellent service, on time'),
(4, 6, 1, 4, 'Smooth ride, polite driver'),
(5, 7, 1, 5, 'Very satisfied with the service'),
(6, 8, 1, 4, 'Good experience overall'),
(7, 6, 1, 5, 'Professional and courteous'),
(8, 7, 1, 4, 'Clean vehicle, safe driving'),
(9, 8, 1, 5, 'Outstanding service!'),
(10, 6, 1, 4, 'Good timing and route'),
(11, 7, 1, 5, 'Excellent driver'),
(12, 8, 1, 4, 'Very good service'),
(13, 6, 1, 5, 'Professional and friendly'),
(14, 7, 1, 4, 'Good experience'),
(15, 8, 1, 5, 'Highly recommended!');

-- Driver 2 ratings
INSERT INTO RATINGS (RideID, RatedBy, RatedUserID, Score, Comment) VALUES
(19, 6, 2, 4, 'Good driver, arrived on time'),
(20, 7, 2, 4, 'Clean car, smooth ride'),
(21, 8, 2, 5, 'Excellent service!'),
(22, 6, 2, 3, 'Good but could be faster'),
(23, 7, 2, 4, 'Professional driver'),
(24, 8, 2, 4, 'Good experience'),
(25, 6, 2, 5, 'Very satisfied'),
(26, 7, 2, 4, 'Clean and comfortable'),
(27, 8, 2, 5, 'Great service!'),
(28, 6, 2, 4, 'On time and professional'),
(29, 7, 2, 4, 'Good ride overall');

-- Driver 3 ratings
INSERT INTO RATINGS (RideID, RatedBy, RatedUserID, Score, Comment) VALUES
(32, 6, 3, 5, 'Luxury experience, highly recommended!'),
(33, 7, 3, 5, 'Premium service, excellent driver'),
(34, 8, 3, 5, 'Outstanding in every way!'),
(35, 6, 3, 4, 'Very good service'),
(36, 7, 3, 5, 'Professional and elegant'),
(37, 8, 3, 5, 'Exceptional ride experience'),
(38, 6, 3, 4, 'High quality service'),
(39, 7, 3, 5, 'Luxury at its best!'),
(40, 8, 3, 5, 'Perfect in every aspect'),
(41, 6, 3, 5, 'Worth every penny!'),
(42, 7, 3, 4, 'Excellent premium service'),
(43, 8, 3, 5, 'Top-tier experience'),
(44, 6, 3, 5, 'Outstanding luxury ride'),
(45, 7, 3, 5, 'Exceptional driver and service'),
(46, 8, 3, 4, 'Very satisfied'),
(47, 6, 3, 5, 'Premium quality!'),
(48, 7, 3, 5, 'Excellent in every way'),
(49, 8, 3, 5, 'Luxury and comfort combined');

-- Driver 4 ratings
INSERT INTO RATINGS (RideID, RatedBy, RatedUserID, Score, Comment) VALUES
(50, 6, 4, 4, 'Quick and efficient bike ride'),
(51, 7, 4, 4, 'Good for short distances'),
(52, 8, 4, 5, 'Excellent bike service!'),
(53, 6, 4, 4, 'Fast and safe'),
(54, 7, 4, 4, 'Good experience'),
(55, 8, 4, 5, 'Very professional bike rider'),
(56, 6, 4, 4, 'Quick service'),
(57, 7, 4, 4, 'Good for city travel');

-- Driver 5 ratings
INSERT INTO RATINGS (RideID, RatedBy, RatedUserID, Score, Comment) VALUES
(58, 6, 5, 5, 'Excellent driver, very professional!'),
(59, 7, 5, 4, 'Good service, clean car'),
(60, 8, 5, 5, 'Outstanding experience!'),
(61, 6, 5, 4, 'Professional and courteous'),
(62, 7, 5, 5, 'Very satisfied with the ride'),
(63, 8, 5, 4, 'Good overall experience'),
(64, 6, 5, 5, 'Excellent service!'),
(65, 7, 5, 4, 'Clean and comfortable'),
(66, 8, 5, 5, 'Professional driver'),
(67, 6, 5, 4, 'Good timing and route'),
(68, 7, 5, 5, 'Very happy with the service'),
(69, 8, 5, 4, 'Good experience overall'),
(70, 6, 5, 5, 'Excellent and reliable'),
(71, 7, 5, 4, 'Professional service'),
(72, 8, 5, 5, 'Great driver!'),
(73, 6, 5, 4, 'Good ride experience'),
(74, 7, 5, 5, 'Highly recommended!'),
(75, 8, 5, 4, 'Very good service'),
(76, 6, 5, 5, 'Excellent choice!'),
(77, 7, 5, 4, 'Professional and friendly');

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Driver sample data created: 5 drivers with varying rides and earnings for portal testing.' AS Status;
