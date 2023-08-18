import axios from 'axios'

// eslint-disable-next-line import/prefer-default-export
export const axiosApi = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
})
