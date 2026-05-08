const db = require('./rideflow-backend/config/db');

async function createPromoProcedure() {
  try {
    console.log('Creating ApplyPromoCode procedure...');
    
    const createProcedureSQL = `
      DROP PROCEDURE IF EXISTS ApplyPromoCode;
      
      CREATE PROCEDURE ApplyPromoCode(IN p_RideID INT, IN p_Code VARCHAR(20))
      BEGIN
          DECLARE v_promo_id    INT DEFAULT NULL;
          DECLARE v_disc_pct    DECIMAL(5,2);
          DECLARE v_max_disc    DECIMAL(10,2);
          DECLARE v_valid_from  DATETIME;
          DECLARE v_valid_to    DATETIME;
          DECLARE v_usage_limit INT;
          DECLARE v_usage_count INT;
          DECLARE v_status      VARCHAR(20);
          DECLARE v_fare        DECIMAL(10,2);
          DECLARE v_rider_id    INT;
          DECLARE v_discount    DECIMAL(10,2);

          SELECT PromoCodeID, DiscountPercentage, MaxDiscount,
                 ValidFrom, ValidTo, UsageLimit, UsageCount, Status
            INTO v_promo_id, v_disc_pct, v_max_disc,
                 v_valid_from, v_valid_to, v_usage_limit, v_usage_count, v_status
            FROM PROMOCODES WHERE Code = p_Code;

          IF v_promo_id IS NULL THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Promo code not found.';
          END IF;
          IF v_status != 'Active' THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Promo code is not active.';
          END IF;
          IF NOW() NOT BETWEEN v_valid_from AND v_valid_to THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Promo code has expired or is not yet valid.';
          END IF;
          IF v_usage_count >= v_usage_limit THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Promo code usage limit reached.';
          END IF;

          SELECT Fare, CustomerID INTO v_fare, v_rider_id FROM RIDES WHERE RideID = p_RideID;

          SET v_discount = v_fare * (v_disc_pct / 100.0);
          IF v_max_disc IS NOT NULL AND v_discount > v_max_disc THEN
              SET v_discount = v_max_disc;
          END IF;

          UPDATE PAYMENTS
             SET DiscountApplied = v_discount,
                 Amount          = GREATEST(v_fare - v_discount, 0),
                 PromoCodeID     = v_promo_id
           WHERE RideID = p_RideID;

          UPDATE PROMOCODES SET UsageCount = UsageCount + 1 WHERE PromoCodeID = v_promo_id;
          INSERT IGNORE INTO USER_PROMOCODES (UserID, PromoCodeID) VALUES (v_rider_id, v_promo_id);

          SELECT CONCAT('Promo ', p_Code, ' applied. Discount: PKR ', ROUND(v_discount,2)) AS Result;
      END
    `;
    
    await db.query(createProcedureSQL);
    console.log('✅ ApplyPromoCode procedure created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating procedure:', err);
    process.exit(1);
  }
}

createPromoProcedure();
