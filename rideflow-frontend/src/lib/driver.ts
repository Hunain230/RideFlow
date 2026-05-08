import { api } from './api';

export const driverAPI = {
  // Profile & Availability
  getProfile: () => api.get('/driver/profile'),
  updateProfile: (data: any) => api.patch('/driver/profile', data),
  setAvailability: (status: string) => api.patch('/driver/availability', { status }),
  updateLocation: (locationID: number) => api.patch('/driver/location', { locationID }),

  // Vehicles
  getVehicles: () => api.get('/driver/vehicles'),
  addVehicle: (data: any) => api.post('/driver/vehicles', data),
  editVehicle: (vehicleID: number, data: any) => api.patch(`/driver/vehicles/${vehicleID}`, data),
  removeVehicle: (vehicleID: number) => api.delete(`/driver/vehicles/${vehicleID}`),

  // Profile Enhancements
  uploadProfilePhoto: (photoData: any) => api.post('/driver/profile/photo', photoData),
  uploadDocuments: (documents: any) => api.post('/driver/documents', documents),
  requestVerification: () => api.post('/driver/verification-request'),

  // Rides
  getIncomingRides: () => api.get('/driver/rides/incoming'),
  createRideRequest: (data: any) => api.post('/driver/rides/request', data),
  getMyRides: () => api.get('/driver/rides'),
  acceptRide: (rideID: number, vehicleID: number) => api.patch(`/driver/rides/${rideID}/accept`, { vehicleID }),
  rejectRide: (rideID: number, reason?: string) => api.patch(`/driver/rides/${rideID}/reject`, { reason }),
  startRide: (rideID: number) => api.patch(`/driver/rides/${rideID}/start`),
  completeRide: (rideID: number, data?: { actualDistance?: number; actualFare?: number; paymentMethod?: string }) =>
    api.patch(`/driver/rides/${rideID}/complete`, data),

  // Earnings & Wallet
  getEarnings: () => api.get('/driver/earnings'),
  getWallet: () => api.get('/driver/wallet'),
  requestPayout: (amount: number) => api.post('/driver/payout', { amount }),
  getMyPayments: () => api.get('/driver/payments'),

  // Ratings
  rateRider: (rideID: number, rating: number, comment: string) => api.post('/driver/ratings', { rideID, rating, comment }),
  getMyRatings: () => api.get('/driver/ratings'),

  // Notifications
  getNotifications: () => api.get('/driver/notifications'),
  markNotificationRead: (notificationID: number) => api.patch(`/driver/notifications/${notificationID}/read`),

  // Safety Features
  sendSOS: () => api.post('/driver/sos'),
  reportRider: (data: any) => api.post('/driver/report-rider', data),
  shareTrip: (data: any) => api.post('/driver/share-trip', data),

  // Analytics
  analytics: {
    // Earnings Analytics
    getEarningsOverview: () => api.get('/driver/analytics/earnings/overview'),
    getDailyEarnings: (days?: number) => api.get('/driver/analytics/earnings/daily', { params: { days } }),
    getWeeklyEarnings: (weeks?: number) => api.get('/driver/analytics/earnings/weekly', { params: { weeks } }),
    getMonthlyEarnings: (months?: number) => api.get('/driver/analytics/earnings/monthly', { params: { months } }),

    // Performance Analytics
    getPerformanceMetrics: () => api.get('/driver/analytics/performance/metrics'),
    getPerformanceTrends: (period?: 'daily' | 'weekly' | 'monthly') => api.get('/driver/analytics/performance/trends', { params: { period } }),

    // Location Analytics
    getLocationHotspots: (limit?: number) => api.get('/driver/analytics/locations/hotspots', { params: { limit } }),
    getPopularRoutes: (limit?: number) => api.get('/driver/analytics/locations/routes', { params: { limit } }),

    // Time Analytics
    getPeakHours: () => api.get('/driver/analytics/time/peak-hours'),
    getPeakDays: () => api.get('/driver/analytics/time/peak-days'),

    // Forecasting
    getEarningsForecast: (days?: number) => api.get('/driver/analytics/forecast/earnings', { params: { days } }),

    // Export Analytics Data
    exportAnalytics: async (type: 'earnings' | 'performance' | 'forecast', format: 'csv' | 'json' = 'csv') => {
      try {
        const response = await api.get(`/driver/analytics/export/${type}`, {
          params: { format },
          responseType: 'blob'
        });
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return { success: true };
      } catch (error) {
        throw error;
      }
    }
  }
};
