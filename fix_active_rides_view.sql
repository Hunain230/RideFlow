-- Fix vw_ActiveRides view
-- This script recreates the problematic view to fix the RiderID column error

USE rideflow;

-- Drop the existing view if it exists
DROP VIEW IF EXISTS vw_ActiveRides;

-- Recreate the view with correct column references
CREATE VIEW vw_ActiveRides AS
SELECT
    ri.RideID,
    CONCAT(ru.FirstName, ' ', ru.LastName)      AS RiderName,
    CONCAT(du.FirstName, ' ', du.LastName)      AS DriverName,
    COALESCE(v.Make, 'N/A')                     AS Make,
    COALESCE(v.Model, 'N/A')                    AS Model,
    COALESCE(v.LicensePlate, 'N/A')             AS LicensePlate,
    pl.City                                     AS PickupCity,
    pl.Street                                   AS PickupStreet,
    dl.City                                     AS DropoffCity,
    dl.Street                                   AS DropoffStreet,
    ri.Fare,
    ri.StartTime,
    ri.SurgeMultiplier
FROM   RIDES     ri
JOIN   USERS     ru ON ri.RiderID  = ru.UserID
JOIN   DRIVERS   d  ON ri.DriverID = d.DriverID
JOIN   USERS     du ON d.UserID    = du.UserID
LEFT JOIN VEHICLES v  ON ri.VehicleID = v.VehicleID
JOIN   LOCATIONS pl ON ri.PickupLocationID  = pl.LocationID
JOIN   LOCATIONS dl ON ri.DropoffLocationID = dl.LocationID
WHERE  ri.RideStatus = 'InProgress';

-- Verify the view was created
SELECT 'vw_ActiveRides view recreated successfully' AS Status;
