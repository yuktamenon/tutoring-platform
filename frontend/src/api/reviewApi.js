import api from './axios'

// tutorId in getTutorReviews = Tutor User id
export const createReview   = (data)   => api.post('/reviews', data)
export const getTutorReviews= (tutorId)=> api.get(`/reviews/tutor/${tutorId}`)
