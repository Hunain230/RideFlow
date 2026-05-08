const db = require('./rideflow-backend/config/db');

async function addSampleData() {
  try {
    console.log('Adding sample complaints, promocodes, and reports...');
    
    // 1. Add sample promocodes
    const [promoResult] = await db.query(`
      INSERT IGNORE INTO PROMOCODES (Code, DiscountPercentage, MaxDiscount, ValidFrom, ValidTo, UsageLimit, UsageCount, Status) VALUES
      ('SAVE20', 20.00, 100.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 100, 15, 'Active'),
      ('WEEKEND50', 50.00, 150.00, '2026-05-01 00:00:00', '2026-12-31 23:59:59', 50, 8, 'Active'),
      ('NEWUSER', 25.00, 75.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 200, 45, 'Active'),
      ('RAMADAN30', 30.00, 120.00, '2026-02-28 00:00:00', '2026-04-30 23:59:59', 75, 12, 'Active'),
      ('FLASH15', 15.00, 50.00, '2026-05-08 00:00:00', '2026-05-15 23:59:59', 30, 5, 'Active')
    `);
    
    console.log(`✓ Added ${promoResult.affectedRows} promocodes`);
    
    // 2. Add sample complaints
    const [complaintResult] = await db.query(`
      INSERT IGNORE INTO COMPLAINTS (RideID, UserID, Description, ComplaintStatus) VALUES
      (1, 21, 'Driver was very rude and used phone during the ride. Unsafe driving behavior.', 'Open'),
      (1, 22, 'Rider changed destination mid-ride and refused to pay additional fare.', 'Resolved'),
      (1, 21, 'Vehicle was dirty and had bad odor. Poor hygiene standards.', 'Open'),
      (1, 22, 'Rider was intoxicated and caused disturbance during the trip.', 'Resolved'),
      (1, 21, 'Driver took longer route intentionally to increase fare.', 'Open')
    `);
    
    console.log(`✓ Added ${complaintResult.affectedRows} complaints`);
    
    // 3. Add sample ratings (for reports) - skip existing entries
    const [ratingResult] = await db.query(`
      INSERT IGNORE INTO RATINGS (RideID, RatedBy, RatedUserID, Score, Comment) VALUES
      (1, 21, 22, 5, 'Excellent driver! Very professional and friendly.'),
      (1, 22, 21, 4, 'Good rider, respectful and punctual.'),
      (2, 21, 22, 3, 'Driver was okay but took wrong route.'),
      (2, 22, 21, 5, 'Perfect rider! Would ride again.'),
      (3, 21, 22, 4, 'Good experience overall.')
    `);
    
    console.log(`✓ Added ${ratingResult.affectedRows} ratings`);
    
    // 4. Add sample payments (for reports)
    const [paymentResult] = await db.query(`
      INSERT IGNORE INTO PAYMENTS (RideID, CustomerID, Amount, PaymentMethod, PaymentStatus, DiscountApplied, PromoCodeID) VALUES
      (1, 21, 345.45, 'CreditCard', 'Paid', 69.09, 2),
      (1, 21, 280.00, 'Cash', 'Paid', 0.00, NULL),
      (1, 21, 420.50, 'Wallet', 'Paid', 84.10, 1),
      (1, 21, 150.00, 'CreditCard', 'Paid', 45.00, 3),
      (1, 21, 200.00, 'Cash', 'Paid', 0.00, NULL)
    `);
    
    console.log(`✓ Added ${paymentResult.affectedRows} payments`);
    
    // 5. Add sample notifications
    const [notificationResult] = await db.query(`
      INSERT IGNORE INTO NOTIFICATIONS (UserID, Title, Message, NotificationType, ActionURL, RelatedID, IsRead) VALUES
      (21, 'Ride Completed', 'Your ride #1 has been completed successfully.', 'RideUpdate', '/customer?ride=1', 1, FALSE),
      (22, 'New Ride Request', 'You have a new ride request from nearby area.', 'Ride', '/driver/rides/1', 1, FALSE),
      (21, 'Promo Code Applied', 'SAVE20 promo code applied successfully! You saved PKR 69.09', 'Promo', '/customer/rides', NULL, FALSE),
      (22, 'Payment Received', 'Payment of PKR 276.36 received for ride #1', 'Payment', '/driver/earnings', 1, TRUE),
      (20, 'New Complaint', 'A new complaint has been filed against ride #1', 'System', '/admin/complaints/1', 1, FALSE)
    `);
    
    console.log(`✓ Added ${notificationResult.affectedRows} notifications`);
    
    // 6. Add sample safety alerts
    const [safetyResult] = await db.query(`
      INSERT IGNORE INTO SOS_ALERTS (DriverID, RideID, LocationID, AlertTime, Status, Notes) VALUES
      (7, 1, 1, '2026-05-08T15:30:00Z', 'Active', 'Emergency SOS triggered by driver'),
      (7, 1, 2, '2026-05-08T16:00:00Z', 'Resolved', 'Accident reported - minor collision')
    `);
    
    console.log(`✓ Added ${safetyResult.affectedRows} safety alerts`);
    
    // Verify data was added
    console.log('\n📊 Sample Data Summary:');
    
    const [promos] = await db.query('SELECT COUNT(*) as count FROM PROMOCODES WHERE Status = "Active"');
    console.log(`- Active Promocodes: ${promos[0].count}`);
    
    const [complaints] = await db.query('SELECT COUNT(*) as count FROM COMPLAINTS');
    console.log(`- Total Complaints: ${complaints[0].count}`);
    
    const [ratings] = await db.query('SELECT COUNT(*) as count FROM RATINGS');
    console.log(`- Total Ratings: ${ratings[0].count}`);
    
    const [payments] = await db.query('SELECT COUNT(*) as count FROM PAYMENTS');
    console.log(`- Total Payments: ${payments[0].count}`);
    
    const [notifications] = await db.query('SELECT COUNT(*) as count FROM NOTIFICATIONS');
    console.log(`- Total Notifications: ${notifications[0].count}`);
    
    console.log('\n✅ Sample data added successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error adding sample data:', err);
    process.exit(1);
  }
}

addSampleData();
