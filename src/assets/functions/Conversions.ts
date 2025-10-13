// Input must be like: 2023-06-27T14:18:02.684Z
export const timestampFormat = (txt: string) => {
  const year = txt.slice(0, 4)
  const month = txt.slice(5, 7)
  const day = txt.slice(8, 10)
  return `${day}.${month}.${year}`
}
export const timestampFormat2 = (txt: string) => {
  const year = txt.slice(0, 4)
  const month = txt.slice(5, 7)
  const day = txt.slice(8, 10)
  const hour = txt.slice(11, 13)
  const min = txt.slice(14, 16)
  const sec = txt.slice(17, 19)
  return `${day}.${month}.${year} ${hour}:${min}:${sec}`
}
