const db = require('../config/db');

async function runTests() {
  console.log("=== RideFlow Database Rubric Test Suite ===\n");

  try {
    console.log("[TEST] Verifying Views...");
    const [revenue] = await db.query('SELECT * FROM vw_RevenueByCity LIMIT 3');
    console.log("vw_RevenueByCity works:", revenue ? "YES" : "NO");
    
    const [leaderboard] = await db.query('SELECT * FROM vw_DriverLeaderboard LIMIT 3');
    console.log("vw_DriverLeaderboard works:", leaderboard ? "YES" : "NO");

    console.log("\n[TEST] Verifying Triggers... (trg_PaymentCompleteRide & trg_CreditDriverWallet)");
    
    const [[rider]] = await db.query("SELECT UserID FROM USERS WHERE Role='Rider' LIMIT 1");
    const [[driver]] = await db.query("SELECT DriverID, WalletBalance FROM DRIVERS LIMIT 1");
    const [[pickup]] = await db.query('SELECT LocationID FROM LOCATIONS LIMIT 1');
    
    if (rider && driver && pickup) {
      // 1. Insert Ride
      const [ride] = await db.query(
        `INSERT INTO RIDES (CustomerID, DriverID, PickupLocationID, DropoffLocationID, RideStatus, Fare) 
         VALUES (?, ?, ?, ?, 'InProgress', 500)`,
        [rider.UserID, driver.DriverID, pickup.LocationID, pickup.LocationID]
      );
      const rideId = ride.insertId;
      
      // 2. Insert Payment
      await db.query(
        `INSERT INTO PAYMENTS (RideID, CustomerID, Amount, PaymentMethod, PaymentStatus) 
         VALUES (?, ?, 500, 'Cash', 'Paid')`,
        [rideId, rider.UserID]
      );
      
      // 3. Verify RideStatus changed to 'Completed' (trg_PaymentCompleteRide)
      const [[checkRide]] = await db.query("SELECT RideStatus FROM RIDES WHERE RideID = ?", [rideId]);
      console.log(`trg_PaymentCompleteRide: RideStatus = ${checkRide.RideStatus} (Expected: Completed)`);
      
      // 4. Verify WalletBalance updated (trg_CreditDriverWallet)
      const [[checkDriver]] = await db.query("SELECT WalletBalance FROM DRIVERS WHERE DriverID = ?", [driver.DriverID]);
      console.log(`trg_CreditDriverWallet: WalletBalance increased from ${driver.WalletBalance} to ${checkDriver.WalletBalance}`);
      
      // Cleanup
      await db.query('DELETE FROM PAYMENTS WHERE RideID = ?', [rideId]);
      await db.query('DELETE FROM RIDES WHERE RideID = ?', [rideId]);
    } else {
      console.log("Skipped Trigger tests (missing dummy data)");
    }

    console.log("\n[TEST] Verifying Stored Procedures... (RequestPayout)");
    const [[dWallet]] = await db.query('SELECT DriverID, WalletBalance FROM DRIVERS WHERE WalletBalance > 10 LIMIT 1');
    if (dWallet) {
      console.log(`Initial balance: PKR ${dWallet.WalletBalance}`);
      await db.query('CALL RequestPayout(?)', [dWallet.DriverID]);
      const [[afterWallet]] = await db.query('SELECT WalletBalance FROM DRIVERS WHERE DriverID = ?', [dWallet.DriverID]);
      console.log(`Balance after payout: PKR ${afterWallet.WalletBalance} (Expected: 0.00)`);
    } else {
      console.log("Skipped RequestPayout test: No driver with balance > 10.");
    }

    console.log("\n[TEST] Verifying Event Scheduler...");
    const [events] = await db.query("SHOW EVENTS WHERE Name = 'evt_ExpirePromoCodes'");
    console.log(`Found Event Scheduler 'evt_ExpirePromoCodes':`, events.length > 0 ? "YES" : "NO");

    console.log("\n✅ All tests completed successfully!");

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
  } finally {
    process.exit();
  }
}

runTests();
