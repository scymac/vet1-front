// return false if is a number
export default function isnan(val: number | string | null | undefined) {
  return Number.isNaN(Number(val))
}
