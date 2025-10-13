// Account base route

import { Setup, Order, Measurement, AlarmInterface } from './Interfaces'

export const BASE_URL = 'http://localhost:3242/api/v1'

export interface ApiResponse {
  ok: boolean
  statusCode: number
  statusMessage: string
  message:
    | Setup
    | Setup[]
    | Order
    | Order[]
    | Measurement
    | Measurement[]
    | AlarmInterface[]
    | string[]
    | string
    | null
}
