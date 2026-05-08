import { api } from './api';

export const adminAPI = {
  // Users
  getUsers:           (params?: object) => api.get('/admin/users', { params }),
  createUser:         (data: object) => api.post('/admin/users', data),
  updateUser:         (id: number, data: object) => api.put(`/admin/users/${id}`, data),
  deleteUser:         (id: number) => api.delete(`/admin/users/${id}`),
  updateUserStatus:   (id: number, status: string) => api.patch(`/admin/users/${id}/status`, { status }),
  updateUserRole:     (id: number, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
  // Drivers
  getDrivers:         () => api.get('/admin/drivers'),
  verifyDriver:       (id: number, status: string) => api.patch(`/admin/drivers/${id}/verify`, { status }),
  approvePayout:      (id: number) => api.post(`/admin/drivers/${id}/payout`),
  // Vehicles
  getVehicles:        () => api.get('/admin/vehicles'),
  createVehicle:      (data: object) => api.post('/admin/vehicles', data),
  updateVehicle:      (id: number, data: object) => api.put(`/admin/vehicles/${id}`, data),
  deleteVehicle:      (id: number) => api.delete(`/admin/vehicles/${id}`),
  verifyVehicle:      (id: number, status: string) => api.patch(`/admin/vehicles/${id}/verify`, { status }),
  // Promos
  getPromoCodes:      () => api.get('/admin/promocodes'),
  createPromoCode:    (data: object) => api.post('/admin/promocodes', data),
  updatePromoStatus:  (id: number, status: string) => api.patch(`/admin/promocodes/${id}/status`, { status }),
  // Complaints
  getComplaints:      (status?: string) => api.get('/admin/complaints', { params: { status } }),
  updateComplaint:    (id: number, status: string) => api.patch(`/admin/complaints/${id}`, { status }),
  // Rides
  getRides:           (params?: object) => api.get('/admin/rides', { params }),
  updateRideStatus:  (id: number, status: string) => api.patch(`/admin/rides/${id}/status`, { status }),
  cancelRide:         (id: number) => api.delete(`/admin/rides/${id}`),
  // Ratings
  getRatings:         (params?: object) => api.get('/admin/ratings', { params }),
  deleteRating:       (rideId: number, ratedBy: number) => api.delete(`/admin/ratings/${rideId}`, { params: { ratedBy } }),
  // Notifications
  getNotifications:    () => api.get('/admin/notifications'),
  // Surge & Fare
  applySurge:         (id: number, multiplier: number) => api.post(`/admin/rides/${id}/surge`, { multiplier }),
  recalcFare:         (id: number) => api.post(`/admin/rides/${id}/fare`),
  // Locations
  getLocations:       () => api.get('/admin/locations'),
  addLocation:        (data: object) => api.post('/admin/locations', data),
  // Revenue Analytics
  getRevenueOverview: (from?: string, to?: string) => api.get('/admin/revenue/overview', { params: { from, to } }),

  // Reports
  revenueByCity:      (from?: string, to?: string) => api.get('/admin/reports/revenue-by-city', { params: { from, to } }),
  driverEarnings:     () => api.get('/admin/reports/driver-earnings'),
  revenueByPayment:   () => api.get('/admin/reports/revenue-by-payment'),
  leaderboard:        () => api.get('/admin/reports/leaderboard'),
  topDrivers:         () => api.get('/admin/reports/top-drivers'),
  activeRides:        () => api.get('/admin/reports/active-rides'),
  lowRatedDrivers:    () => api.get('/admin/reports/low-rated-drivers'),
};
