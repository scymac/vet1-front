export interface NewOrder {
  order_no  : string,
  product_no: string,
  notes     : string,
  setup_id  : string
}

export interface Order extends NewOrder {
  id      : string,
  created : string,
  finished: string,
}

export interface NewSetup {
  name                   : string,
  material               : string,
  product                : string,
  notes                  : string,
  max_thickness          : number|null,
  min_thickness          : number|null,
  electrode_distance     : number,
  electrode_half_distance: number,
  spot_electrode_length  : number,
  spot_electrode_gap     : number,
  sample_width           : number,
  thickness              : boolean,       // true = make the measurement
  through_resistance     : boolean,       // true = make the measurement
  whole_resistance       : boolean,       // true = make the measurement
  local_resistance       : boolean,       // true = make the measurement
  hmc_samples            : number,        // how many samples will the multimeter make for each electrode
  max_tres               : number|null,
  min_tres               : number|null,
  max_wres               : number|null,
  min_wres               : number|null,
  max_lres               : number|null,
  min_lres               : number|null
}

export interface Setup extends NewSetup {
  id      : string,
  created : string,
  modified: string
}

export type ResMeasurement = {
  voltage: number | null,
  current: number | null,
  resistance: number | null
}

export interface NewMeasurement {
  sample_no: number,
  order_id : string,
  thickness: number | null,
  t_res    : ResMeasurement,
  w_res    : ResMeasurement
  l_res1   : ResMeasurement,
  l_res2   : ResMeasurement,
  l_res3   : ResMeasurement,
  l_res4   : ResMeasurement,
  l_res5   : ResMeasurement,
  l_res6   : ResMeasurement,
  l_res7   : ResMeasurement,
  l_res8   : ResMeasurement,
  l_res9   : ResMeasurement,
  l_res10  : ResMeasurement,
  l_res11  : ResMeasurement,
  l_res12  : ResMeasurement,
}
export interface Measurement extends NewMeasurement {
  id      : string,
  tstamp  : Date,
  finished: boolean  // true when the operator confirmed measured values
}

export interface IdType {
  id: string
}

export interface AlarmObject {
  code: string,
}

export interface AlarmInterface extends AlarmObject {
  id: string,
  tstamp: Date
}

export interface PlcAlarms {
  plcToServerConnection: boolean,
  cpuError: boolean
}
