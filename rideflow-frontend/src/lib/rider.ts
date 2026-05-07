import { api } from './api';

export const riderAPI = {
  getProfile:          () => api.get('/rider/profile'),
  updateProfile:       (data: object) => api.patch('/rider/profile', data),
  addPhone:            (phoneNumber: string) => api.post('/rider/phones', { phoneNumber }),
  removePhone:         (phone: string) => api.delete(`/rider/phones/${phone}`),
  getLocations:        (city?: string) => api.get('/rider/locations', { params: { city } }),
  getAvailableDrivers: (city?: string) => api.get('/rider/drivers/available', { params: { city } }),
  getVehicles:         (type?: string) => api.get('/rider/vehicles', { params: { type } }),
  requestRide:         (data: object) => api.post('/rider/rides', data),
  getRideHistory:      (status?: string) => api.get('/rider/rides', { params: { status } }),
  getRideDetail:       (id: number) => api.get(`/rider/rides/${id}`),
  cancelRide:          (id: number) => api.patch(`/rider/rides/${id}/cancel`),
  applyPromo:          (id: number, code: string) => api.post(`/rider/rides/${id}/promo`, { code }),
  makePayment:         (data: object) => api.post('/rider/payments', data),
  getPayments:         () => api.get('/rider/payments'),
  getActivePromos:     () => api.get('/rider/promocodes'),
  getMyPromos:         () => api.get('/rider/my-promocodes'),
  rateDriver:          (data: object) => api.post('/rider/ratings', data),
  fileComplaint:       (data: object) => api.post('/rider/complaints', data),
  getComplaints:       () => api.get('/rider/complaints'),
};
