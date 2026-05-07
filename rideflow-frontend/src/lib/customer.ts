import { api } from './api';

export const customerAPI = {
  getProfile:          () => api.get('/customer/profile'),
  updateProfile:       (data: object) => api.patch('/customer/profile', data),
  addPhone:            (phoneNumber: string) => api.post('/customer/phones', { phoneNumber }),
  removePhone:         (phone: string) => api.delete(`/customer/phones/${phone}`),
  getLocations:        (city?: string) => api.get('/customer/locations', { params: { city } }),
  getAvailableDrivers: (city?: string) => api.get('/customer/drivers/available', { params: { city } }),
  getVehicles:         (type?: string) => api.get('/customer/vehicles', { params: { type } }),
  requestRide:         (data: object) => api.post('/customer/rides', data),
  getRideHistory:      (status?: string) => api.get('/customer/rides', { params: { status } }),
  getRideDetail:       (id: number) => api.get(`/customer/rides/${id}`),
  cancelRide:          (id: number) => api.patch(`/customer/rides/${id}/cancel`),
  applyPromo:          (id: number, code: string) => api.post(`/customer/rides/${id}/promo`, { code }),
  makePayment:         (data: object) => api.post('/customer/payments', data),
  getPayments:         () => api.get('/customer/payments'),
  getActivePromos:     () => api.get('/customer/promocodes'),
  getMyPromos:         () => api.get('/customer/my-promocodes'),
  rateDriver:          (data: object) => api.post('/customer/ratings', data),
  fileComplaint:       (data: object) => api.post('/customer/complaints', data),
  getComplaints:       () => api.get('/customer/complaints'),
};
