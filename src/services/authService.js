import api from "@/lib/api"
{/*
export const login = (data) => api.post('/auth/login', data)

export const register = (data) => api.post('/auth/register', data)

export const getProfile = () => api.get('/auth/me')
*/}

export const login = (data) => api.post('/login', data)

export const register = (data) => api.post('/register', data)

// el token va en Authorization: Bearer TOKEN
export const getProfile = (idusuario) => api.get(`/rua_usuarios/${idusuario}`)
