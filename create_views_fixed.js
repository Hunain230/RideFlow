const db = require('./rideflow-backend/config/db');

async function createViews() {
  try {
    console.log('Creating database views...');
    
    // Create revenue by city view
    await db.query(`
      CREATE OR REPLACE VIEW vw_revenuebycity AS
      SELECT 
        l.City,
        COUNT(r.RideID) AS TotalRides,
        SUM(r.Fare) AS TotalRevenue,
        AVG(r.Fare) AS AverageFare,
        SUM(r.Distance) AS TotalDistance,
        AVG(r.Distance) AS AverageDistance,
        COUNT(DISTINCT r.CustomerID) AS UniqueCustomers
      FROM RIDES r
      JOIN LOCATIONS l ON r.PickupLocationID = l.LocationID
      WHERE r.RideStatus = 'Completed'
      GROUP BY l.City
      ORDER BY TotalRevenue DESC
    `);
    
    console.log('✓ Created vw_revenuebycity view');
    
    // Create driver earnings view
    await db.query(`
      CREATE OR REPLACE VIEW vw_driverearnings AS
      SELECT 
        d.DriverID,
        CONCAT(u.FirstName, ' ', u.LastName) AS DriverName,
        COUNT(r.RideID) AS TotalRides,
        SUM(r.Fare) AS TotalEarnings,
        AVG(r.Fare) AS AverageFare,
        SUM(r.Distance) AS TotalDistance,
        d.WalletBalance,
        d.VerificationStatus
      FROM DRIVERS d
      JOIN USERS u ON d.UserID = u.UserID
      LEFT JOIN RIDES r ON d.DriverID = r.DriverID AND r.RideStatus = 'Completed'
      GROUP BY d.DriverID, u.FirstName, u.LastName, d.WalletBalance, d.VerificationStatus
      ORDER BY TotalEarnings DESC
    `);
    
    console.log('✓ Created vw_driverearnings view');
    
    // Create leaderboard view
    await db.query(`
      CREATE OR REPLACE VIEW vw_leaderboard AS
      SELECT 
        u.UserID,
        CONCAT(u.FirstName, ' ', u.LastName) AS FullName,
        u.Role,
        COALESCE(AVG(rt.Score), 0) AS AverageRating,
        COUNT(rt.RatingID) AS TotalRatings,
        COUNT(DISTINCT r.RideID) AS TotalRides,
        COALESCE(SUM(r.Fare), 0) AS TotalEarnings
      FROM USERS u
      LEFT JOIN RATINGS rt ON u.UserID = rt.RatedUserID
      LEFT JOIN RIDES r ON u.UserID = r.CustomerID AND r.RideStatus = 'Completed'
      WHERE u.Role IN ('Driver', 'Rider')
      GROUP BY u.UserID, u.FirstName, u.LastName, u.Role
      HAVING TotalRides > 0
      ORDER BY AverageRating DESC, TotalEarnings DESC
    `);
    
    console.log('✓ Created vw_leaderboard view');
    
    // Verify views were created
    const [revenueView] = await db.query('SELECT COUNT(*) as count FROM information_schema.views WHERE table_name = "vw_revenuebycity"');
    const [earningsView] = await db.query('SELECT COUNT(*) as count FROM information_schema.views WHERE table_name = "vw_driverearnings"');
    const [leaderboardView] = await db.query('SELECT COUNT(*) as count FROM information_schema.views WHERE table_name = "vw_leaderboard"');
    
    console.log('\n📊 Views Summary:');
    console.log(`- Revenue by City View: ${revenueView[0].count > 0 ? 'Created' : 'Not found'}`);
    console.log(`- Driver Earnings View: ${earningsView[0].count > 0 ? 'Created' : 'Not found'}`);
    console.log(`- Leaderboard View: ${leaderboardView[0].count > 0 ? 'Created' : 'Not found'}`);
    
    console.log('\n✅ Database views created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating views:', err);
    process.exit(1);
  }
}

createViews();
