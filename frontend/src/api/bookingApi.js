import api from './axios'

// tutorId in requestBooking = Tutor User id (NOT TutorProfile id)
export const requestBooking    = (data)      => api.post('/bookings/request', data)
export const getStudentBookings= (studentId) => api.get(`/bookings/student/${studentId}`)
export const getTutorBookings  = (tutorId)   => api.get(`/bookings/tutor/${tutorId}`)
export const acceptBooking     = (bookingId) => api.patch(`/bookings/${bookingId}/accept`)
export const rejectBooking     = (bookingId) => api.patch(`/bookings/${bookingId}/reject`)
export const cancelBooking     = (bookingId) => api.patch(`/bookings/${bookingId}/cancel`)
export const completeBooking   = (bookingId) => api.patch(`/bookings/${bookingId}/complete`)
