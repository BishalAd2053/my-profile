import axios from 'axios'
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api/v1',
  timeout: 8000,
})

