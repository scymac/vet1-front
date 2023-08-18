/* eslint-disable react/button-has-type */
import { useRef, useState, useEffect } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import SuccessIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'
import themeColors from 'assets/theme/colors'
import Box from '@mui/material/Box'

const buttonStyle = {
  marginLeft:      '20px',
  border:          'none',
  backgroundColor: 'transparent',
  cursor:          'pointer',
  color:           '#FFFFFF',
}

export default function AlertTemplate({
  message,
  options,
  style,
  close,
}: {
  message:any,
  options:any,
  style:any,
  close:any,
}) {
  const [boxHeight, setBoxHeight] = useState(0)
  const ref:any = useRef(null)

  useEffect(() => {
    setBoxHeight(ref.current.clientHeight - 20)
  }, [ref])

  const getColor = () => {
    if (options.type === 'info') return themeColors.info.main
    if (options.type === 'success') return themeColors.success.main
    return themeColors.error.main
  }

  const alertStyle = {
    backgroundColor: '#fff',
    color:           getColor(),
    padding:         10,
    borderRadius:    '3px',
    display:         'flex',
    justifyContent:  'space-between',
    alignItems:      'center',
    boxShadow:       '0px 2px 2px 2px rgba(0, 0, 0, 0.07)',
    width:           500,
    boxSizing:       'border-box',
  }

  const getMessage = () => {
    if (options.type === 'info') {
      return (
        <>
          <b>INFO</b>
          <br />
          {message}
        </>
      )
    }
    if (options.type === 'success') {
      return (
        <>
          <b>SUCCESS</b>
          <br />
          {message}
        </>
      )
    }
    return (
      <>
        <b>ERROR</b>
        <br />
        {message}
      </>
    )
  }

  return (
    <div ref   = {ref} style = {{ ...alertStyle, ...style }}>
      <Box style = {{
        background:   getColor(),
        width:        4,
        height:       boxHeight,
        borderRadius: '3px 0px 0px 3px',
        marginRight:  8,
      }}
      />
      {options.type === 'info'    && <InfoIcon />}
      {options.type === 'success' && <SuccessIcon />}
      {options.type === 'error'   && <ErrorIcon />}
      <span
        style = {{
          flex:         2,
          marginLeft:   15,
          marginTop:    10,
          marginBottom: 10,
          color:        themeColors.gray.dark,
        }}
      >
        {getMessage()}
      </span>
      <button
        onClick = {close}
        style   = {buttonStyle}
      >
        <CloseIcon />
      </button>
    </div>
  )
}
