-- =============================================================
-- RideFlow — Schema Additions for Rider Dashboard Enhancement
-- =============================================================

USE rideflow;

-- Disable FK checks during creation
SET FOREIGN_KEY_CHECKS = 0;

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
    UserID             INT            NOT NULL,
    ContactName        VARCHAR(100)   NOT NULL,
    ContactPhone       VARCHAR(20)    NOT NULL,
    ContactEmail       VARCHAR(100),
    ContactRelation    VARCHAR(50),   -- e.g., 'Spouse', 'Friend', 'Parent'
    IsPrimary          BOOLEAN        DEFAULT FALSE,
    CreatedAt          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 14. NOTIFICATIONS
--    System notifications for riders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
    NotificationID    INT            AUTO_INCREMENT PRIMARY KEY,
    UserID             INT            NOT NULL,
    Title              VARCHAR(200)   NOT NULL,
    Message            TEXT           NOT NULL,
    NotificationType   ENUM('RideUpdate', 'Payment', 'Promo', 'Safety', 'System') NOT NULL,
    IsRead             BOOLEAN        DEFAULT FALSE,
    ActionURL          VARCHAR(500),  -- Deep link for action
    CreatedAt          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 15. SAFETY_ALERTS
--    SOS and safety-related alerts
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS SAFETY_ALERTS (
    AlertID            INT            AUTO_INCREMENT PRIMARY KEY,
    UserID             INT            NOT NULL,
    RideID             INT,
    AlertType          ENUM('SOS', 'ShareTrip', 'ReportIssue', 'Emergency') NOT NULL,
    AlertData          JSON,          -- Additional alert data
    LocationLat        DECIMAL(10,8),
    LocationLng        DECIMAL(11,8),
    Resolved           BOOLEAN        DEFAULT FALSE,
    ResolvedAt         TIMESTAMP NULL,
    CreatedAt          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID) ON DELETE CASCADE,
    FOREIGN KEY (RideID) REFERENCES RIDES(RideID) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────────────
-- 16. RIDER_PREFERENCES
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

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;

-- Add indexes for better performance
CREATE INDEX idx_saved_locations_user ON SAVED_LOCATIONS(UserID);
CREATE INDEX idx_notifications_user_unread ON NOTIFICATIONS(UserID, IsRead);
CREATE INDEX idx_safety_alerts_user_active ON SAFETY_ALERTS(UserID, Resolved);
CREATE INDEX idx_emergency_contacts_user ON EMERGENCY_CONTACTS(UserID);

SELECT 'Schema additions created: 5 new tables with indexes.' AS Status;
