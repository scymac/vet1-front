// Input must be like: 2023-06-27T14:18:02.684Z
export const meanFromStrArray = (array:string[]) => {
  const sum = array.reduce((a, b) => Number(a) + Number(b), 0)
  const avg = (sum / array.length) || 0
  return avg
}

// (3.26, 2) -> 3.5     (3.26, 10) -> 3.3       (-3.22123, 1000) -> -3.221
export function nearToDecimal(num:number, decimal:number) {
  let dec = decimal
  if (dec < 1) dec = 1
  return Math.round(num * dec) / dec
}

export const round = (num:number, dec:number) => Math.round((num + Number.EPSILON) * 10 ** dec) / 10 ** dec
