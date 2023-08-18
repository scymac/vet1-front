import { ApiResponse, BASE_URL } from './ApiGlobalInterface'
import {
  NewMeasurement, Measurement,
  NewOrder, NewSetup, Order, Setup, IdType, AlarmInterface,
} from './Interfaces'

export const dataExchangeRate = 3000 // in ms

/** * ADMIN ** */
export const ApiAdminLogin = async (pass:string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/accounts/admin/${pass}`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as string
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

/** * ORDERS ** */

export const ApiNewOrder = async (content: NewOrder): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/orders/new`, {
    method:  'POST',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  })
  const message = response.ok
    ? await response.json() as IdType
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiListOrders = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/orders/list`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as Order[]
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiReadOrder = async (orderNo: string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/orders/read/${orderNo}`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as Order
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiGetCurrentOrder = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/orders/getCurrentOrder`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as string
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiStartOrder = async (id: string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/orders/startOrder/${id}`, {
    method:  'PUT',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiFinishOrder = async (id: string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/orders/finish/${id}`, {
    method:  'PUT',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiEditOrder = async (id:string, content:NewOrder): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/orders/update/${id}`, {
    method:  'PUT',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  })
  const message = response.ok
    ? await response.json() as Order
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

// check if a setup is in use so it can be deleted
export const ApiCheckSetupId = async (setupId: string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/orders/checkSetupId/${setupId}`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as string
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

/** * SETUPS ** */

export const ApiNewSetup = async (content: NewSetup): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/setups/new`, {
    method:  'POST',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  })
  const message = response.ok
    ? await response.json() as IdType
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiUpdateSetup = async (id: string, content: NewSetup): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/setups/update/${id}`, {
    method:  'PUT',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiListSetups = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/setups/list`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as Setup[]
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiReadSetup = async (name: string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/setups/read/${name}`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as Setup
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiDeleteSetup = async (id: string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/setups/delete/${id}`, {
    method:  'DELETE',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

/** * MEASUREMENTS ** */

export const ApiNewMeasurement = async (content: NewMeasurement): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/measurements/new`, {
    method:  'POST',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiFinishMeasurement = async (orderContent: NewMeasurement): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/measurements/finish`, {
    method:  'POST',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderContent),
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiListMeasurements = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/measurements/list`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as Measurement[]
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiListMeasurementsByOrder = async (orderId:string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/measurements/listByOrder/${orderId}`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as Measurement[]
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiReadMeasurement = async (id: string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/measurements/read/${id}`, {
    method:  'GET',
    headers: {

      // Accept:         'application/json',
      // 'Content-Type': 'application/json'
    },
  })
  const message = response.ok
    ? await response.json() as Measurement
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiDeleteMeasurement = async (orderNo: string, sampleNo: number): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/measurements/delete/${orderNo}`, {
    method:  'DELETE',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sample: sampleNo,
    }),
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiHmcId = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/scpi/readDeviceId`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as string
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

// *** Diag ***

export const ApiAckPlcAlarms = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/diag/ackAlarms`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiGetPlcAlarms = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/diag/getCurrentPlcAlarms`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as string[]
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiGetAlarmHist = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/diag/getPlcAlarmHist`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? await response.json() as AlarmInterface[]
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}

export const ApiRegisterAlarm = async (code:string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/diag/registerAlarm/${code}`, {
    method:  'GET',
    headers: {
      Accept:         'application/json',
      'Content-Type': 'application/json',
    },
  })
  const message = response.ok
    ? null
    :  (await response.json()).message
  return {
    ok:            response.ok,
    statusCode:    response.status,
    statusMessage: response.statusText,
    message,
  }
}
