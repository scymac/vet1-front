import isnan from './Validation'

// ['8', '4', '-'] => ['8', '4'] = 6
export const meanFromStrArray = (array: string[]) => {
  const arr: string[] = []
  array.forEach(v => {
    if (v !== '-' && v !== null && v !== undefined) arr.push(v)
  })
  const sum = arr.reduce((a, b) => Number(a) + Number(b), 0)
  const average = sum / arr.length || 0
  return average
}

// (3.26, 2) -> 3.5     (3.26, 10) -> 3.3       (-3.22123, 1000) -> -3.221
export function nearToDecimal(num: number, decimal: number) {
  let dec = decimal
  if (dec < 1) dec = 1
  return Math.round(num * dec) / dec
}

export const round = (num: number, dec: number) =>
  Math.round((num + Number.EPSILON) * 10 ** dec) / 10 ** dec
export const roundUp = (num: number, dec: number) =>
  Math.ceil((num + Number.EPSILON) * 10 ** dec) / 10 ** dec
export const roundDown = (num: number, dec: number) =>
  Math.floor((num + Number.EPSILON) * 10 ** dec) / 10 ** dec

// remove nulls and NaN from array: [1,'a',4,null] -> [1,4]
export function removeInvalidNumsFromArray(array: any[]) {
  const output: number[] = []
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] !== '' && !isnan(array[i]) && array[i] !== null)
      output.push(Number(array[i]))
  }
  return output
}

// return the average
export function avg(array: any[]) {
  const values = removeInvalidNumsFromArray(array)
  const len = values.length
  let sum = 0
  for (let i = 0; i < len; i += 1) {
    sum += values[i]
  }
  return sum / len
}

export function getMax(arr: number[]) {
  return arr.reduce((max, v) => (max >= v ? max : v), -Infinity)
}

export function getMin(arr: number[]) {
  return arr.reduce((min, v) => (min <= v ? min : v), Infinity)
}
