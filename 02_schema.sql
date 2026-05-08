-- =============================================================
-- RideFlow — Phase 2: Schema Creation
-- Student: 24i_0026 / 24i_0127
-- Course:  Database Systems Lab (AI & DS) — Spring 2026
-- =============================================================

USE rideflow;

-- Disable FK checks during creation to allow any order
SET FOREIGN_KEY_CHECKS = 0;

-- ─────────────────────────────────────────────────────────────
-- 1. USERS
--    All platform participants: Rider, Driver, Admin
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS USERS (
    UserID           INT            AUTO_INCREMENT PRIMARY KEY,
    FirstName        VARCHAR(50)    NOT NULL,
    LastName         VARCHAR(50)    NOT NULL,
    Email            VARCHAR(100)   UNIQUE NOT NULL,
    Password         VARCHAR(255)   NOT NULL,   -- store as bcrypt hash
    Role             ENUM('Rider', 'Driver', 'Admin') NOT NULL,
    AccountStatus    ENUM('Active', 'Suspended', 'Banned') DEFAULT 'Active',
    RegistrationDate TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- 2. USER_PHONES  (multi-valued attribute of USERS)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS USER_PHONES (
    UserID      INT         NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    PRIMARY KEY (UserID, PhoneNumber),
    FOREIGN KEY (UserID) REFERENCES USERS(UserID) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 3. LOCATIONS
--    Reusable geographic points used as pickup / drop-off
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS LOCATIONS (
    LocationID   INT            AUTO_INCREMENT PRIMARY KEY,
    LocationName VARCHAR(100),
    Street       VARCHAR(255)   NOT NULL,
    City         VARCHAR(100)   NOT NULL,
    State        VARCHAR(100)   NOT NULL,
    Zip          VARCHAR(20)    NOT NULL,
    Latitude     DECIMAL(10,8)  NOT NULL,
    Longitude    DECIMAL(11,8)  NOT NULL
);

-- ─────────────────────────────────────────────────────────────
-- 4. DRIVERS
--    Extends USERS with driver-specific attributes
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS DRIVERS (
    DriverID           INT            AUTO_INCREMENT PRIMARY KEY,
    UserID             INT            UNIQUE NOT NULL,
    LicenseNumber      VARCHAR(50)    UNIQUE NOT NULL,
    CNIC               VARCHAR(20)    UNIQUE NOT NULL,
    ProfilePhoto       VARCHAR(255),
    VerificationStatus ENUM('Verified', 'Unverified', 'Rejected') DEFAULT 'Unverified',
    AvailabilityStatus ENUM('Online', 'Offline', 'In-Ride')       DEFAULT 'Offline',
    WalletBalance      DECIMAL(10,2)  DEFAULT 0.00,
    CommissionRate     DECIMAL(5,2)   DEFAULT 10.00
                           CHECK (CommissionRate BETWEEN 0 AND 100),
    CurrentLocationID  INT,
    FOREIGN KEY (UserID)            REFERENCES USERS(UserID)     ON DELETE CASCADE,
    FOREIGN KEY (CurrentLocationID) REFERENCES LOCATIONS(LocationID) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────────────
-- 5. VEHICLES
--    Vehicles registered by drivers (1 driver : N vehicles)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS VEHICLES (
    VehicleID          INT          AUTO_INCREMENT PRIMARY KEY,
    DriverID           INT          NOT NULL,
    Make               VARCHAR(50)  NOT NULL,
    Model              VARCHAR(50)  NOT NULL,
    Year               INT          NOT NULL CHECK (Year BETWEEN 1990 AND 2100),
    Color              VARCHAR(30),
    LicensePlate       VARCHAR(20)  UNIQUE NOT NULL,
    VehicleType        ENUM('Economy', 'Business', 'Bike') NOT NULL,
    VerificationStatus ENUM('Verified', 'Pending', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (DriverID) REFERENCES DRIVERS(DriverID) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 6. PROMOCODES
--    Discount codes with validity window and usage cap
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS PROMOCODES (
    PromoCodeID        INT           AUTO_INCREMENT PRIMARY KEY,
    Code               VARCHAR(20)   UNIQUE NOT NULL,
    DiscountPercentage DECIMAL(5,2)  CHECK (DiscountPercentage BETWEEN 0 AND 100),
    MaxDiscount        DECIMAL(10,2),
    ValidFrom          DATETIME      NOT NULL,
    ValidTo            DATETIME      NOT NULL,
    UsageLimit         INT           DEFAULT 100,
    UsageCount         INT           DEFAULT 0,   -- tracks redemptions
    Status             ENUM('Active', 'Expired', 'Disabled') DEFAULT 'Active'
);

-- ─────────────────────────────────────────────────────────────
-- 7. RIDES
--    Core ride lifecycle entity
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS RIDES (
    RideID            INT           AUTO_INCREMENT PRIMARY KEY,
    CustomerID          INT           NOT NULL,   -- UserID of the rider
    DriverID          INT,
    VehicleID         INT,
    PickupLocationID  INT           NOT NULL,
    DropoffLocationID INT           NOT NULL,
    RideStatus        ENUM('Requested','Accepted','InProgress','Completed','Cancelled')
                          DEFAULT 'Requested',
    Fare              DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Distance          DECIMAL(10,2),           -- kilometres
    ScheduledTime     DATETIME,
    StartTime         DATETIME,
    EndTime           DATETIME,
    SurgeMultiplier   DECIMAL(3,2)  DEFAULT 1.00,
    FOREIGN KEY (CustomerID)          REFERENCES USERS(UserID),
    FOREIGN KEY (DriverID)          REFERENCES DRIVERS(DriverID),
    FOREIGN KEY (VehicleID)         REFERENCES VEHICLES(VehicleID),
    FOREIGN KEY (PickupLocationID)  REFERENCES LOCATIONS(LocationID),
    FOREIGN KEY (DropoffLocationID) REFERENCES LOCATIONS(LocationID)
);

-- ─────────────────────────────────────────────────────────────
-- 8. PAYMENTS
--    One payment per completed ride (1:1 with RIDES)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS PAYMENTS (
    PaymentID       INT           AUTO_INCREMENT PRIMARY KEY,
    RideID          INT           UNIQUE NOT NULL,
    PromoCodeID     INT,
    CustomerID         INT           NOT NULL,
    Amount          DECIMAL(10,2) NOT NULL,
    PaymentMethod   ENUM('Cash', 'CreditCard', 'Wallet') NOT NULL,
    PaymentStatus   ENUM('Paid', 'Pending', 'Failed', 'Refunded') DEFAULT 'Pending',
    TransactionDate TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    DiscountApplied DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (RideID)       REFERENCES RIDES(RideID),
    FOREIGN KEY (CustomerID)         REFERENCES USERS(UserID),
    FOREIGN KEY (PromoCodeID)  REFERENCES PROMOCODES(PromoCodeID)
);

-- ─────────────────────────────────────────────────────────────
-- 9. COMPLAINTS
--    User-filed complaints tied to a specific ride
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS COMPLAINTS (
    ComplaintID     INT  AUTO_INCREMENT PRIMARY KEY,
    RideID          INT  NOT NULL,
    UserID          INT  NOT NULL,
    Description     TEXT NOT NULL,
    ComplaintStatus ENUM('Open', 'Resolved', 'Dismissed') DEFAULT 'Open',
    CreatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RideID)  REFERENCES RIDES(RideID),
    FOREIGN KEY (UserID)  REFERENCES USERS(UserID)
);

-- ─────────────────────────────────────────────────────────────
-- 10. RATINGS  (Weak Entity — PK is (RideID, RatedBy))
--     Mutual ratings after every completed ride
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS RATINGS (
    RideID      INT       NOT NULL,
    RatedBy     INT       NOT NULL,
    RatedUserID INT       NOT NULL,
    Score       INT       NOT NULL CHECK (Score BETWEEN 1 AND 5),
    Comment     TEXT,
    Timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (RideID, RatedBy),
    FOREIGN KEY (RideID)      REFERENCES RIDES(RideID),
    FOREIGN KEY (RatedBy)     REFERENCES USERS(UserID),
    FOREIGN KEY (RatedUserID) REFERENCES USERS(UserID)
);

-- ─────────────────────────────────────────────────────────────
-- 11. USER_PROMOCODES  (Associative — M:N USERS ↔ PROMOCODES)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS USER_PROMOCODES (
    UserID      INT NOT NULL,
    PromoCodeID INT NOT NULL,
    RedeemedAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserID, PromoCodeID),
    FOREIGN KEY (UserID)      REFERENCES USERS(UserID)      ON DELETE CASCADE,
    FOREIGN KEY (PromoCodeID) REFERENCES PROMOCODES(PromoCodeID) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 12. SAVED_LOCATIONS
--    Rider's favorite/pickup locations for quick booking
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS SAVED_LOCATIONS (
    SavedLocationID   INT            AUTO_INCREMENT PRIMARY KEY,
    UserID            INT            NOT NULL,
    LocationName      VARCHAR(100)   NOT NULL,
    Address           VARCHAR(255)   NOT NULL,
    LocationType      ENUM('Home', 'Work', 'Favorite', 'Other') DEFAULT 'Other',
    LocationID        INT,           -- Reference to LOCATIONS table if applicable
    Latitude          DECIMAL(10,8),
    Longitude         DECIMAL(11,8),
    IsDefault         BOOLEAN        DEFAULT FALSE,
    CreatedAt         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID) ON DELETE CASCADE,
    FOREIGN KEY (LocationID) REFERENCES LOCATIONS(LocationID) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────────────
-- 13. EMERGENCY_CONTACTS
--    Rider's emergency contacts for safety features
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS EMERGENCY_CONTACTS (
    ContactID         INT            AUTO_INCREMENT PRIMARY KEY,
    UserID            INT            NOT NULL,
    ContactName       VARCHAR(100)   NOT NULL,
    ContactPhone      VARCHAR(20)    NOT NULL,
    ContactEmail      VARCHAR(100),
    ContactRelation   VARCHAR(50),   -- e.g., 'Spouse', 'Friend', 'Parent'
    IsPrimary         BOOLEAN        DEFAULT FALSE,
    CreatedAt         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 14. RIDER_PREFERENCES
--    Rider preferences and settings
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS RIDER_PREFERENCES (
    PreferenceID       INT            AUTO_INCREMENT PRIMARY KEY,
    UserID             INT            UNIQUE NOT NULL,
    PreferredVehicleType VARCHAR(20), -- Economy, Business, Bike
    PreferredPaymentMethod VARCHAR(20), -- Cash, CreditCard, Wallet
    EnableNotifications BOOLEAN        DEFAULT TRUE,
    EnableLocationSharing BOOLEAN      DEFAULT TRUE,
    EnableEmergencyContacts BOOLEAN    DEFAULT TRUE,
    LanguagePreference VARCHAR(10)     DEFAULT 'en',
    CreatedAt          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 15. DRIVER_DOCUMENTS
--    Store driver verification documents
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS DRIVER_DOCUMENTS (
    DocumentID      INT            AUTO_INCREMENT PRIMARY KEY,
    DriverID        INT            NOT NULL,
    DocumentType    ENUM('License', 'CNIC', 'VehicleRegistration', 'Insurance') NOT NULL,
    DocumentUrl     VARCHAR(500)   NOT NULL,
    Status          ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    UploadedAt      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    ReviewedAt      TIMESTAMP      NULL,
    ReviewedBy      INT            NULL, -- Admin UserID
    ReviewComments  TEXT           NULL,
    FOREIGN KEY (DriverID) REFERENCES DRIVERS(DriverID) ON DELETE CASCADE,
    FOREIGN KEY (ReviewedBy) REFERENCES USERS(UserID) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────────────
-- 16. SOS_ALERTS
--    Emergency alerts from drivers
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS SOS_ALERTS (
    AlertID         INT            AUTO_INCREMENT PRIMARY KEY,
    DriverID        INT            NOT NULL,
    RideID          INT            NULL,
    LocationID      INT            NULL,
    AlertTime       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    Status          ENUM('Active', 'Resolved', 'FalseAlarm') DEFAULT 'Active',
    ResolvedAt      TIMESTAMP      NULL,
    ResolvedBy      INT            NULL, -- Admin UserID
    Notes           TEXT           NULL,
    FOREIGN KEY (DriverID) REFERENCES DRIVERS(DriverID) ON DELETE CASCADE,
    FOREIGN KEY (RideID) REFERENCES RIDES(RideID) ON DELETE SET NULL,
    FOREIGN KEY (LocationID) REFERENCES LOCATIONS(LocationID) ON DELETE SET NULL,
    FOREIGN KEY (ResolvedBy) REFERENCES USERS(UserID) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────────────
-- 17. RIDE_TIMELINE
--    Detailed timeline of ride events
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS RIDE_TIMELINE (
    TimelineID      INT            AUTO_INCREMENT PRIMARY KEY,
    RideID          INT            NOT NULL,
    EventType       ENUM('Requested', 'Accepted', 'DriverEnRoute', 'Arrived', 'Started', 'InProgress', 'Completed', 'Cancelled') NOT NULL,
    EventTime       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    LocationID      INT            NULL,
    DriverID        INT            NULL,
    Notes           TEXT           NULL,
    FOREIGN KEY (RideID) REFERENCES RIDES(RideID) ON DELETE CASCADE,
    FOREIGN KEY (LocationID) REFERENCES LOCATIONS(LocationID) ON DELETE SET NULL,
    FOREIGN KEY (DriverID) REFERENCES DRIVERS(DriverID) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────────────
-- 18. NOTIFICATIONS
--    System notifications for all user types
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
    NotificationID    INT            AUTO_INCREMENT PRIMARY KEY,
    UserID            INT            NOT NULL,
    Title             VARCHAR(200)   NOT NULL,
    Message           TEXT           NOT NULL,
    NotificationType  ENUM('RideUpdate', 'Payment', 'Promo', 'Safety', 'System', 'Ride', 'Verification') NOT NULL,
    IsRead            BOOLEAN        DEFAULT FALSE,
    ActionURL         VARCHAR(500),  -- Deep link for action (e.g., /customer?ride=123)
    RelatedID         INT,           -- Reference to related entity (RideID, PaymentID, etc.)
    ExpiresAt         TIMESTAMP      NULL,  -- Optional expiration for time-sensitive notifications
    CreatedAt         TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES for performance optimization
-- ─────────────────────────────────────────────────────────────

-- User-related indexes
CREATE INDEX idx_users_email ON USERS(Email);
CREATE INDEX idx_users_role ON USERS(Role);
CREATE INDEX idx_users_status ON USERS(AccountStatus);

-- Driver-related indexes
CREATE INDEX idx_drivers_user_id ON DRIVERS(UserID);
CREATE INDEX idx_drivers_verification ON DRIVERS(VerificationStatus);
CREATE INDEX idx_drivers_availability ON DRIVERS(AvailabilityStatus);

-- Ride-related indexes
CREATE INDEX idx_rides_customer ON RIDES(CustomerID);
CREATE INDEX idx_rides_driver ON RIDES(DriverID);
CREATE INDEX idx_rides_status ON RIDES(RideStatus);
CREATE INDEX idx_rides_vehicle ON RIDES(VehicleID);

-- Saved Locations indexes
CREATE INDEX idx_saved_locations_user ON SAVED_LOCATIONS(UserID);

-- Emergency Contacts indexes
CREATE INDEX idx_emergency_contacts_user ON EMERGENCY_CONTACTS(UserID);

-- Rider Preferences indexes
CREATE INDEX idx_rider_preferences_user ON RIDER_PREFERENCES(UserID);

-- Driver Documents indexes
CREATE INDEX idx_driver_documents_driver_id ON DRIVER_DOCUMENTS(DriverID);
CREATE INDEX idx_driver_documents_status ON DRIVER_DOCUMENTS(Status);

-- SOS Alerts indexes
CREATE INDEX idx_sos_alerts_driver_id ON SOS_ALERTS(DriverID);
CREATE INDEX idx_sos_alerts_status ON SOS_ALERTS(Status);
CREATE INDEX idx_sos_alerts_alert_time ON SOS_ALERTS(AlertTime);

-- Ride Timeline indexes
CREATE INDEX idx_ride_timeline_ride_id ON RIDE_TIMELINE(RideID);
CREATE INDEX idx_ride_timeline_event_time ON RIDE_TIMELINE(EventTime);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON NOTIFICATIONS(UserID);
CREATE INDEX idx_notifications_user_unread ON NOTIFICATIONS(UserID, IsRead);
CREATE INDEX idx_notifications_created_at ON NOTIFICATIONS(CreatedAt);
CREATE INDEX idx_notifications_type ON NOTIFICATIONS(NotificationType);
CREATE INDEX idx_notifications_related_id ON NOTIFICATIONS(RelatedID);

-- ─────────────────────────────────────────────────────────────
-- TRIGGERS for automated notifications and timeline
-- ─────────────────────────────────────────────────────────────

DELIMITER $$

-- Trigger: Create timeline entry when ride status changes
DROP TRIGGER IF EXISTS trg_RideTimelineUpdate$$
CREATE TRIGGER trg_RideTimelineUpdate
AFTER UPDATE ON RIDES
FOR EACH ROW
BEGIN
    IF NEW.RideStatus != OLD.RideStatus THEN
        INSERT INTO RIDE_TIMELINE (RideID, EventType, DriverID, Notes)
        VALUES (NEW.RideID, NEW.RideStatus, NEW.DriverID,
                CONCAT('Status changed from ', OLD.RideStatus, ' to ', NEW.RideStatus));
    END IF;
END$$

-- Trigger: Notify customer when ride is accepted by driver
DROP TRIGGER IF EXISTS trg_RideAcceptedNotification$$
CREATE TRIGGER trg_RideAcceptedNotification
AFTER UPDATE ON RIDES
FOR EACH ROW
BEGIN
    IF NEW.RideStatus = 'Accepted' AND OLD.RideStatus = 'Requested' THEN
        INSERT INTO NOTIFICATIONS (UserID, Title, Message, NotificationType, ActionURL, RelatedID)
        VALUES (
            NEW.CustomerID,
            'Ride Accepted',
            CONCAT('Your driver is on the way! Ride #', NEW.RideID, ' has been accepted.'),
            'RideUpdate',
            CONCAT('/customer?ride=', NEW.RideID),
            NEW.RideID
        );
    END IF;
END$$

-- Trigger: Notify customer when ride starts
DROP TRIGGER IF EXISTS trg_RideStartedNotification$$
CREATE TRIGGER trg_RideStartedNotification
AFTER UPDATE ON RIDES
FOR EACH ROW
BEGIN
    IF NEW.RideStatus = 'InProgress' AND OLD.RideStatus = 'Accepted' THEN
        INSERT INTO NOTIFICATIONS (UserID, Title, Message, NotificationType, ActionURL, RelatedID)
        VALUES (
            NEW.CustomerID,
            'Ride Started',
            CONCAT('Your ride has started. Safe travels! Ride #', NEW.RideID),
            'RideUpdate',
            CONCAT('/customer?ride=', NEW.RideID),
            NEW.RideID
        );
    END IF;
END$$

-- Trigger: Notify customer when ride is completed
DROP TRIGGER IF EXISTS trg_RideCompletedNotification$$
CREATE TRIGGER trg_RideCompletedNotification
AFTER UPDATE ON RIDES
FOR EACH ROW
BEGIN
    IF NEW.RideStatus = 'Completed' AND OLD.RideStatus = 'InProgress' THEN
        INSERT INTO NOTIFICATIONS (UserID, Title, Message, NotificationType, ActionURL, RelatedID)
        VALUES (
            NEW.CustomerID,
            'Ride Completed',
            CONCAT('Your ride is complete! Thank you for riding with us. Ride #', NEW.RideID),
            'RideUpdate',
            CONCAT('/customer?ride=', NEW.RideID),
            NEW.RideID
        );
    END IF;
END$$

-- Trigger: Notify customer when ride is cancelled
DROP TRIGGER IF EXISTS trg_RideCancelledNotification$$
CREATE TRIGGER trg_RideCancelledNotification
AFTER UPDATE ON RIDES
FOR EACH ROW
BEGIN
    IF NEW.RideStatus = 'Cancelled' AND OLD.RideStatus != 'Cancelled' THEN
        INSERT INTO NOTIFICATIONS (UserID, Title, Message, NotificationType, RelatedID)
        VALUES (
            NEW.CustomerID,
            'Ride Cancelled',
            CONCAT('Your ride #', NEW.RideID, ' has been cancelled.'),
            'RideUpdate',
            NEW.RideID
        );
    END IF;
END$$

-- Trigger: Notify driver when they get a new ride request
DROP TRIGGER IF EXISTS trg_NewRideRequestNotification$$
CREATE TRIGGER trg_NewRideRequestNotification
AFTER INSERT ON RIDES
FOR EACH ROW
BEGIN
    -- Notify nearby online drivers (simplified for demo - in production would use location proximity)
    INSERT INTO NOTIFICATIONS (UserID, Title, Message, NotificationType, RelatedID)
    SELECT d.UserID,
           'New Ride Request',
           CONCAT('New ride request available. Ride #', NEW.RideID),
           'Ride',
           NEW.RideID
    FROM DRIVERS d
    WHERE d.AvailabilityStatus = 'Online'
      AND d.VerificationStatus = 'Verified'
    LIMIT 10; -- Limit to 10 nearest drivers
END$$

-- Trigger: Notify user when payment is processed
DROP TRIGGER IF EXISTS trg_PaymentProcessedNotification$$
CREATE TRIGGER trg_PaymentProcessedNotification
AFTER INSERT ON PAYMENTS
FOR EACH ROW
BEGIN
    IF NEW.PaymentStatus = 'Paid' THEN
        INSERT INTO NOTIFICATIONS (UserID, Title, Message, NotificationType, RelatedID)
        VALUES (
            NEW.CustomerID,
            'Payment Processed',
            CONCAT('Payment of PKR ', NEW.Amount, ' for ride #', NEW.RideID, ' has been processed successfully.'),
            'Payment',
            NEW.RideID
        );
    END IF;
END$$

DELIMITER ;

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Phase 2 — Schema created: 18 tables with indexes and triggers.' AS Status;
