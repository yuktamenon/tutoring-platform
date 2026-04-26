import api from './axios'

// tutorId here = TutorProfile id
export const createAvailabilitySlot = (data)          => api.post('/availability', data)
export const getTutorAvailability   = (tutorProfileId) => api.get(`/availability/${tutorProfileId}`)
export const deleteAvailabilitySlot = (slotId)         => api.delete(`/availability/${slotId}`)
