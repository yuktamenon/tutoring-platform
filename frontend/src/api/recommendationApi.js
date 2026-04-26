import api from './axios'

export const getRecommendedTutors        = (studentId) => api.get(`/recommendations/tutors/${studentId}`)
export const getLearningPathRecommendations = (studentId) => api.get(`/recommendations/learning-path/${studentId}`)
export const createLearningPath          = (data)      => api.post('/recommendations/learning-path', data)
