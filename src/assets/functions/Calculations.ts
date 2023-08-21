import isnan from './Validation'

// Input must be like: 2023-06-27T14:18:02.684Z
export const meanFromStrArray = (array:string[]) => {
  const sum = array.reduce((a, b) => Number(a) + Number(b), 0)
  const average = (sum / array.length) || 0
  return average
}

// (3.26, 2) -> 3.5     (3.26, 10) -> 3.3       (-3.22123, 1000) -> -3.221
export function nearToDecimal(num:number, decimal:number) {
  let dec = decimal
  if (dec < 1) dec = 1
  return Math.round(num * dec) / dec
}

export const round = (num:number, dec:number) => Math.round((num + Number.EPSILON) * 10 ** dec) / 10 ** dec

// remove nulls and NaN from array: [1,'a',4,null] -> [1,4]
export function removeInvalidNumsFromArray(array:any[]) {
  const output:number[] = []
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] !== '' && !isnan(array[i]) && array[i] !== null) output.push(Number(array[i]))
  }
  return output
}

// return the average
export function avg(array:any[]) {
  const values = removeInvalidNumsFromArray(array)
  const len = values.length
  let sum = 0
  for (let i = 0; i < len; i += 1) {
    sum += values[i]
  }
  return sum / len
}
