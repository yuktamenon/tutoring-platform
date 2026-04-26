import api from './axios'

export const sendMessage         = (data)      => api.post('/messages', data)
export const getMessagesByBooking= (bookingId) => api.get(`/messages/booking/${bookingId}`)
