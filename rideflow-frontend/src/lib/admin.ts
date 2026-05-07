import { api } from './api';

export const adminAPI = {
  // Users
  getUsers:           (params?: object) => api.get('/admin/users', { params }),
  updateUserStatus:   (id: number, status: string) => api.patch(`/admin/users/${id}/status`, { status }),
  // Drivers
  getDrivers:         () => api.get('/admin/drivers'),
  verifyDriver:       (id: number, status: string) => api.patch(`/admin/drivers/${id}/verify`, { status }),
  approvePayout:      (id: number) => api.post(`/admin/drivers/${id}/payout`),
  // Vehicles
  getVehicles:        () => api.get('/admin/vehicles'),
  verifyVehicle:      (id: number, status: string) => api.patch(`/admin/vehicles/${id}/verify`, { status }),
  // Promos
  getPromoCodes:      () => api.get('/admin/promocodes'),
  createPromoCode:    (data: object) => api.post('/admin/promocodes', data),
  updatePromoStatus:  (id: number, status: string) => api.patch(`/admin/promocodes/${id}/status`, { status }),
  // Complaints
  getComplaints:      (status?: string) => api.get('/admin/complaints', { params: { status } }),
  updateComplaint:    (id: number, status: string) => api.patch(`/admin/complaints/${id}`, { status }),
  // Rides
  applySurge:         (id: number, multiplier: number) => api.post(`/admin/rides/${id}/surge`, { multiplier }),
  recalcFare:         (id: number) => api.post(`/admin/rides/${id}/fare`),
  // Locations
  getLocations:       () => api.get('/admin/locations'),
  addLocation:        (data: object) => api.post('/admin/locations', data),
  // Reports
  revenueByCity:      (from?: string, to?: string) => api.get('/admin/reports/revenue-by-city', { params: { from, to } }),
  driverEarnings:     () => api.get('/admin/reports/driver-earnings'),
  revenueByPayment:   () => api.get('/admin/reports/revenue-by-payment'),
  leaderboard:        () => api.get('/admin/reports/leaderboard'),
  topDrivers:         () => api.get('/admin/reports/top-drivers'),
  activeRides:        () => api.get('/admin/reports/active-rides'),
  lowRatedDrivers:    () => api.get('/admin/reports/low-rated-drivers'),
};
