/* eslint-disable */
import axios from "axios"

// eslint-disable-next-line import/prefer-default-export
export const axiosApi = axios.create({
	baseURL: "http://localhost:3242/api/v1",
})
