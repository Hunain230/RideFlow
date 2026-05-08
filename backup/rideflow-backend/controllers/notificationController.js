// controllers/notificationController.js
// Notification system for riders

const db = require('../config/db');
const { asyncHandler, sendSuccess, sendError } = require('../utils/helpers');
const wsServer = require('../utils/websocket');

// ─── Notifications ───────────────────────────────────────────────

// GET /api/rider/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly } = req.query;
  let sql = 'SELECT * FROM NOTIFICATIONS WHERE UserID = ?';
  const params = [req.user.userID];
  
  if (unreadOnly === 'true') {
    sql += ' AND IsRead = FALSE';
  }
  
  sql += ' ORDER BY CreatedAt DESC LIMIT 50';
  
  const [rows] = await db.query(sql, params);
  return sendSuccess(res, rows);
});

// POST /api/rider/notifications/mark-read
const markNotificationsRead = asyncHandler(async (req, res) => {
  const { notificationIds } = req.body;
  
  if (!notificationIds || !Array.isArray(notificationIds)) {
    return sendError(res, 'notificationIds array is required.');
  }

  await db.query(
    `UPDATE NOTIFICATIONS SET IsRead = TRUE 
     WHERE NotificationID IN (?) AND UserID = ?`,
    [notificationIds, req.user.userID]
  );
  
  return sendSuccess(res, null, 'Notifications marked as read');
});

// POST /api/rider/notifications/mark-all-read
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await db.query(
    'UPDATE NOTIFICATIONS SET IsRead = TRUE WHERE UserID = ? AND IsRead = FALSE',
    [req.user.userID]
  );
  
  return sendSuccess(res, null, 'All notifications marked as read');
});

// DELETE /api/rider/notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
  const [result] = await db.query(
    'DELETE FROM NOTIFICATIONS WHERE NotificationID = ? AND UserID = ?',
    [req.params.id, req.user.userID]
  );
  
  if (!result.affectedRows) {
    return sendError(res, 'Notification not found.', 404);
  }
  
  return sendSuccess(res, null, 'Notification deleted');
});

// Helper function to create notification
const createNotification = async (userID, title, message, type, actionURL = null) => {
  const [result] = await db.query(
    `INSERT INTO NOTIFICATIONS (UserID, Title, Message, NotificationType, ActionURL)
     VALUES (?, ?, ?, ?, ?)`,
    [userID, title, message, type, actionURL]
  );

  // Get the created notification
  const [[notification]] = await db.query(
    'SELECT * FROM NOTIFICATIONS WHERE NotificationID = ?',
    [result.insertId]
  );

  // Broadcast via WebSocket if user is connected
  wsServer.broadcastNotification(userID, notification);

  return notification;
};

// ─── Safety Alerts ───────────────────────────────────────────────

// GET /api/rider/safety-alerts
const getSafetyAlerts = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM SAFETY_ALERTS WHERE UserID = ? ORDER BY CreatedAt DESC LIMIT 20',
    [req.user.userID]
  );
  return sendSuccess(res, rows);
});

// POST /api/rider/safety-alerts/:id/resolve
const resolveSafetyAlert = asyncHandler(async (req, res) => {
  const [result] = await db.query(
    `UPDATE SAFETY_ALERTS SET Resolved = TRUE, ResolvedAt = NOW() 
     WHERE AlertID = ? AND UserID = ?`,
    [req.params.id, req.user.userID]
  );
  
  if (!result.affectedRows) {
    return sendError(res, 'Safety alert not found.', 404);
  }
  
  return sendSuccess(res, null, 'Safety alert resolved');
});

module.exports = {
  getNotifications,
  markNotificationsRead,
  markAllNotificationsRead,
  deleteNotification,
  createNotification,
  getSafetyAlerts,
  resolveSafetyAlert
};
