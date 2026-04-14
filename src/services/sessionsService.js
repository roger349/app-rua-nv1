import api from '@/lib/api'

export const SessionsService = {

  getByUser(userId) {
    return api.get(`/sessions?userId=${userId}`)
  },

  create(data) {
    return api.post('/sessions', data)
  },

  close(sessionId) {
    return api.patch(`/sessions/${sessionId}`, {
      logoutAt: new Date().toISOString(),
      active: false,
    })
  },
}
