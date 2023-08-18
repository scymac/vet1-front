import { useEffect } from 'react'

type Props = {
  getScreenDimensions: (dim: ScreenDim) => void
}

export type ScreenDim = {
  height: number,
  width: number
}

export default function ScreenDimFunction(props: Props) {

  // * SCREEN *
  // Screen size monitor and shift the view up when the sidebar hides
  const getScreenDimensions = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    props.getScreenDimensions({ width, height })
  }
  useEffect(() => { getScreenDimensions() }, [])                                                                        // update margin top on page load
  useEffect(() => {                                                                                                     // update margin top every time the browser screen is resized
    window.addEventListener('resize', getScreenDimensions)
    return () => {
      window.removeEventListener('resize', getScreenDimensions)
    }
  })

  return null
}
