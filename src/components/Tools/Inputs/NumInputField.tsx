/* eslint-disable react/jsx-no-duplicate-props */
// Functions
import { useState, useEffect, ReactElement } from 'react'
import { makeStyles } from '@mui/styles'
import { nearToDecimal } from 'assets/functions/Calculations'
import isnan from 'assets/functions/Validation'

// React UI
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import CheckIcon from '@mui/icons-material/Check'

// Style
import componentStyles from './NumInputField-CSS'

const useStyles = makeStyles(componentStyles)

type Props = {
  tooltip?         : string|ReactElement,
  fieldVariant?    : 'filled'|'outlined'
  showArrows?      : boolean,
  height?          : number,
  width?           : number,
  marginTop?       : number
  marginBottom?    : number,
  marginLeft?      : number,
  value            : number,
  minValue?        : number,
  maxValue?        : number,
  minEqual?        : boolean,
  maxEqual?        : boolean,
  step?            : number,
  refresh?         : boolean,
  disabled?        : boolean,
  error?           : boolean,
  inputMarginRight?: number,
  readOnly?        : boolean,
  precision?       : number,
  success?         : boolean,
  fontColor?       : string,
  backgroundColor? : string,
  border?          : string,
  borderOffset?    : number,
  showSuffixIcon?  : boolean,
  onChange         : (val:number) => void
}

export default function NumInputField(props:Props) {
  const classes = useStyles()

  const [precision, setPresicion] = useState(() => {
    if (props.precision === undefined) return 2
    return props.precision
  })
  const [value, setValue] = useState(() => {
    if (props.value === null || props.value === undefined) return 'auto'
    return props.value.toFixed(precision)
  })
  const [valueBK, setValueBK] = useState(() => {
    if (props.value === null || props.value === undefined) return 'auto'
    return props.value.toFixed(precision)
  })
  const [step, setStep] = useState(() => {
    if (props.step === undefined) return 1
    return props.step
  })

  useEffect(() => {
    const val = props.value !== undefined ? props.value.toFixed(precision) : 'auto'
    setValue(val)
    setValueBK(val)
  }, [props.value, props.refresh])

  // TextField changes are validated and passed to the chart if valid
  const handleFieldChange = (event:any) => {
    const val = event.target.value
    setValue(val)
  }

  const validateNumber = (inputVal:string) => {
    let val = inputVal.replaceAll(',', '.')
    if (val === '') val = valueBK
    else if (isnan(Number(val))) val = valueBK

    else if (props.minValue !== undefined && Number(val) < props.minValue) val = props.minValue.toFixed(precision)
    else if (props.minValue !== undefined && Number(val) === props.minValue) {
      if (props.minEqual || props.minEqual === undefined) val = props.minValue.toFixed(precision)
      else val = valueBK
    }

    else if (props.maxValue !== undefined && Number(val) > props.maxValue) val = props.maxValue.toFixed(precision)
    else if (props.maxValue !== undefined && Number(val) === props.maxValue) {
      if (props.maxEqual || props.maxEqual === undefined) val = props.maxValue.toFixed(precision)
      else val = valueBK
    }

    return val
  }

  const commitValue = (commitedVal:string) => {
    const val = validateNumber(commitedVal)
    if (props.step === undefined) {
      setValue(val)
      setValueBK(val)
      props.onChange(Number(val))
    }
    else {
      setValue(nearToDecimal(Number(val), 1 / step).toFixed(precision))                                                 // if step = 0.5, 1 / step = 2
      setValueBK(nearToDecimal(Number(val), 1 / step).toFixed(precision))
      props.onChange(nearToDecimal(Number(val), 1 / step))
    }
  }

  // When TextField looses focus final validation is made
  const handleKeyDown = (event:any) => {
    const key = event.keyCode
    if (key === 13) commitValue(value)
    else if (key === 27) {
      if (props.step === undefined) {
        setValue(valueBK)
        props.onChange(Number(valueBK))
      }
      else {
        setValue(nearToDecimal(Number(valueBK), 1 / step).toFixed(precision))
        props.onChange(nearToDecimal(Number(valueBK), 1 / step))
      }
    }
  }

  const handleBlur = () => { commitValue(value) }
  const onAdd      = () => { commitValue((Number(value) + step).toString()) }
  const onSubtract = () => { commitValue((Number(value) - step).toString()) }

  return (
    <Box
      className = {classes.mainBox}
      style     = {{
        marginTop:    props.marginTop === undefined ? 5 : props.marginTop,
        marginBottom: props.marginBottom === undefined ? 5 : props.marginBottom,
        marginLeft:   props.marginLeft,
        zIndex:       10,
      }}
    >
      <Tooltip
        arrow
        title      = {props.tooltip === undefined ? null : <div style = {{ fontSize: 13 }}>{props.tooltip}</div>}
        placement  = "right"
        enterDelay = {300}
      >
        <div>
          <TextField
            id           = "outlined-basic"
            label        = ""
            variant      = {props.fieldVariant === undefined ? 'filled' : props.fieldVariant}
            autoComplete = "off"
            value        = {value}
            type         = "text"
            error        = {props.error}
            InputProps   = {{
              readOnly: props.readOnly === undefined ? false : props.readOnly,
            }}
            style = {{
              backgroundColor: props.backgroundColor,
              width:           props.width === undefined ? '100%' : props.width,
              borderRadius:    4,
              outline:         props.border,
              outlineOffset:   props.borderOffset === undefined ? -1 : props.borderOffset,
            }}
            inputProps = {{
              style: {
                height:        props.height === undefined ? 30   : props.height,
                color:         props.fontColor,
                fontSize:      13,
                marginLeft:    -2,
                marginRight:   props.inputMarginRight === undefined ? 10 : props.inputMarginRight,
                paddingBottom: 0,
                paddingTop:    0,
              },
              step: props.step,
              min:  props.minValue,
              max:  props.maxValue,
            }}
            disabled  = {props.disabled === undefined ? false : props.disabled}
            onChange  = {handleFieldChange}
            onBlur    = {handleBlur}
            onKeyDown = {handleKeyDown}
          />
        </div>
      </Tooltip>
      {
          props.showArrows
            ? (
              <Box>
                <Box
                  className = {classes.arrowButton}
                  onClick   = {onAdd}
                >
                  &#9650;
                </Box>
                <Box
                  className = {classes.arrowButton}
                  onClick   = {onSubtract}
                >
                  &#9660;
                </Box>
              </Box>
            )
            : null
        }
      {
        props.success && props.showSuffixIcon
          ? (
            <CheckIcon
              color = "success"
              style = {{
                marginLeft:  5,
                marginRight: -30,
              }}
            />
          )
          : null
      }
    </Box>
  )
}
