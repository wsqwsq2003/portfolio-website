import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface User {
  id?: number
  name: string
  email: string
}

export const userApi = {
  // 获取所有用户
  getUsers: () => api.get<User[]>('/users'),
  
  // 添加用户
  addUser: (user: User) => api.post<User>('/users', user)
}

export default api
