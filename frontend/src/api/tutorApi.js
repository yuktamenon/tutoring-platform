import api from './axios'

export const createTutorProfile  = (data)          => api.post('/tutors/create-profile', data)
export const getTutorProfile      = (userId)         => api.get(`/tutors/${userId}`)
export const searchTutors         = (params)         => api.get('/tutors/search', { params })
export const assignSubjectToTutor = (data)           => api.post('/tutors/assign-subject', data)
export const getTutorSubjects     = (tutorProfileId) => api.get(`/tutors/${tutorProfileId}/subjects`)
