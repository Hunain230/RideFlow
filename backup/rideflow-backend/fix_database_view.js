// Fix the vw_ActiveRides view issue
const db = require('./config/db');

async function fixActiveRidesView() {
  try {
    console.log('Fixing vw_ActiveRides view...');
    
    // Drop the existing view
    await db.query('DROP VIEW IF EXISTS vw_ActiveRides');
    console.log('Dropped existing view');
    
    // Recreate the view with correct column references
    const createViewSQL = `
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
      JOIN   USERS     ru ON ri.CustomerID  = ru.UserID
      JOIN   DRIVERS   d  ON ri.DriverID = d.DriverID
      JOIN   USERS     du ON d.UserID    = du.UserID
      LEFT JOIN VEHICLES v  ON ri.VehicleID = v.VehicleID
      JOIN   LOCATIONS pl ON ri.PickupLocationID  = pl.LocationID
      JOIN   LOCATIONS dl ON ri.DropoffLocationID = dl.LocationID
      WHERE  ri.RideStatus = 'InProgress'
    `;
    
    await db.query(createViewSQL);
    console.log('✅ vw_ActiveRides view recreated successfully');
    
    // Test the view
    const [rows] = await db.query('SELECT COUNT(*) as count FROM vw_ActiveRides');
    console.log(`✅ View test successful. Found ${rows[0].count} active rides`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing view:', error);
    process.exit(1);
  }
}

fixActiveRidesView();
