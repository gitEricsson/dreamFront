import axios from 'axios'

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.toString() ??
  (import.meta.env.DEV ? '' : 'http://localhost:8080')

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

