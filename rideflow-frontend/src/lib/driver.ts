import { api } from './api';

export const driverAPI = {
  getProfile:       () => api.get('/driver/profile'),
  updateProfile:    (data: object) => api.patch('/driver/profile', data),
  setAvailability:  (status: 'Online' | 'Offline') => api.patch('/driver/availability', { status }),
  updateLocation:   (locationID: number) => api.patch('/driver/location', { locationID }),
  getVehicles:      () => api.get('/driver/vehicles'),
  addVehicle:       (data: object) => api.post('/driver/vehicles', data),
  getIncomingRides: () => api.get('/driver/rides/incoming'),
  getMyRides:       (status?: string) => api.get('/driver/rides', { params: { status } }),
  acceptRide:       (id: number, vehicleID: number) => api.patch(`/driver/rides/${id}/accept`, { vehicleID }),
  startRide:        (id: number) => api.patch(`/driver/rides/${id}/start`),
  completeRide:     (id: number) => api.patch(`/driver/rides/${id}/complete`),
  getEarnings:      () => api.get('/driver/earnings'),
  getWallet:        () => api.get('/driver/wallet'),
  requestPayout:    () => api.post('/driver/payout'),
  getPayments:      () => api.get('/driver/payments'),
  rateRider:        (data: object) => api.post('/driver/ratings', data),
  getMyRatings:     () => api.get('/driver/ratings'),
};
