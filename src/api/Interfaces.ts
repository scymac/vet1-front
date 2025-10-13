export interface NewOrder {
  order_no: string
  product_no: string
  notes: string
  thickness: number // manual measurement
  setup_id: string
}

export interface Order extends NewOrder {
  id: string
  created: string
  finished: string
}

export interface NewSetup {
  name: string
  material: string
  product: string
  notes: string
  max_thickness: number | null
  target_thickness: number | null
  min_thickness: number | null
  electrode_distance: number
  electrode_half_distance: number
  spot_electrode_length: number
  spot_electrode_gap: number
  sample_width: number
  t_resistance_area: number
  is_half_plate: boolean // true = is half plate
  thickness: boolean // true = make the measurement
  through_resistance: boolean // true = make the measurement
  whole_resistance: boolean // true = make the measurement
  local_resistance: boolean // true = make the measurement
  hmc_samples: number // how many samples will the multimeter make for each electrode
  max_tres: number | null
  min_tres: number | null
  max_wres: number | null
  min_wres: number | null
  max_lres: number | null
  min_lres: number | null
}

export interface Setup extends NewSetup {
  id: string
  created: string
  modified: string
}

export type TResMeasurement = {
  voltage: number | null
  current: number | null
  resistance: number | null
}

export type SResMeasurement = {
  voltage: number | null
  resistance: number | null
}

export type MeasConstants = {
  electrode_distance: number
  electrode_half_distance: number
  spot_electrode_length: number
  spot_electrode_gap: number
  sample_width: number
  t_resistance_area: number
}

export interface NewMeasurement {
  sample_no: number
  order_id: string
  thickness: number | null
  t_res: TResMeasurement
  w_l_res_A: number | null
  w_res: SResMeasurement
  l_res1: SResMeasurement
  l_res2: SResMeasurement
  l_res3: SResMeasurement
  l_res4: SResMeasurement
  l_res5: SResMeasurement
  l_res6: SResMeasurement
  l_res7: SResMeasurement
  l_res8: SResMeasurement
  l_res9: SResMeasurement
  l_res10: SResMeasurement
  l_res11: SResMeasurement
  l_res12: SResMeasurement
}

export interface Measurement extends NewMeasurement {
  id: string
  tstamp: Date
  constants: MeasConstants // true when the operator confirmed measured values
}

export interface IdType {
  id: string
}

export interface AlarmObject {
  code: string
}

export interface AlarmInterface extends AlarmObject {
  id: string
  tstamp: Date
}

export interface PlcAlarms {
  plcToServerConnection: boolean
  cpuError: boolean
}
