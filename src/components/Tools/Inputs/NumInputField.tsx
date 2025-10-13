import { useState, useEffect, ReactElement } from 'react'
import { nearToDecimal } from 'assets/functions/Calculations'
import isnan from 'assets/functions/Validation'
import { Box, Tooltip, TextField, Zoom } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

import classes from './NumInputField-CSS'

type Props = {
  tooltip?: string | ReactElement
  fieldVariant?: 'filled' | 'outlined'
  showArrows?: boolean
  height?: number
  width?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  value: number
  minValue?: number
  maxValue?: number
  minEqual?: boolean
  maxEqual?: boolean
  step?: number
  refresh?: boolean
  disabled?: boolean
  error?: boolean
  inputMarginRight?: number
  readOnly?: boolean
  precision?: number
  success?: boolean
  fontColor?: string
  backgroundColor?: string
  border?: string
  borderOffset?: number
  showSuffixIcon?: boolean
  onChange: (val: number) => void
}

export default function NumInputField(props: Props) {
  const [precision, setPrecision] = useState(() => props.precision ?? 2)
  const [step, setStep] = useState(() => props.step ?? 1)

  const [value, setValue] = useState(() => {
    if (props.value == null) return 'auto'
    return props.value.toFixed(precision)
  })
  const [valueBK, setValueBK] = useState(value)

  useEffect(() => {
    const val =
      props.value !== undefined ? props.value.toFixed(precision) : 'auto'
    setValue(val)
    setValueBK(val)
  }, [props.value, props.refresh])

  const handleFieldChange = (event: any) => {
    const val = event.target.value
    setValue(val)
  }

  const validateNumber = (inputVal: string) => {
    let val = inputVal.replaceAll(',', '.')
    if (val === '') val = valueBK
    else if (isnan(Number(val))) val = valueBK
    else if (props.minValue !== undefined && Number(val) < props.minValue)
      val = props.minValue.toFixed(precision)
    else if (props.minValue !== undefined && Number(val) === props.minValue) {
      if (props.minEqual ?? true) val = props.minValue.toFixed(precision)
      else val = valueBK
    } else if (props.maxValue !== undefined && Number(val) > props.maxValue)
      val = props.maxValue.toFixed(precision)
    else if (props.maxValue !== undefined && Number(val) === props.maxValue) {
      if (props.maxEqual ?? true) val = props.maxValue.toFixed(precision)
      else val = valueBK
    }

    return val
  }

  const commitValue = (committedVal: string) => {
    const val = validateNumber(committedVal)
    const numVal = props.step
      ? nearToDecimal(Number(val), 1 / step)
      : Number(val)
    const displayVal = numVal.toFixed(precision)
    setValue(displayVal)
    setValueBK(displayVal)
    props.onChange(numVal)
  }

  const handleKeyDown = (event: any) => {
    const key = event.keyCode
    if (key === 13) commitValue(value)
    else if (key === 27) {
      const numVal = props.step
        ? nearToDecimal(Number(valueBK), 1 / step)
        : Number(valueBK)
      setValue(numVal.toFixed(precision))
      props.onChange(numVal)
    }
  }

  const handleBlur = () => commitValue(value)
  const onAdd = () => commitValue((Number(value) + step).toString())
  const onSubtract = () => commitValue((Number(value) - step).toString())

  return (
    <Box
      sx={{
        ...classes.mainBox,
        marginTop: props.marginTop ?? '5px',
        marginBottom: props.marginBottom ?? '5px',
        marginLeft: props.marginLeft ?? 0,
        zIndex: 10
      }}
    >
      <Tooltip
        arrow
        title={
          props.tooltip ? <Box sx={{ fontSize: 13 }}>{props.tooltip}</Box> : ''
        }
        placement="right"
        slotProps={{
          transition: {
            component: Zoom,
            timeout: 300
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          <TextField
            variant={props.fieldVariant ?? 'filled'}
            autoComplete="off"
            value={value}
            type="text"
            error={props.error}
            disabled={props.disabled}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                readOnly: props.readOnly ?? false,
                sx: {
                  height: props.height ?? 30,
                  color: props.fontColor,
                  fontSize: 13,
                  marginRight: props.inputMarginRight
                    ? `${props.inputMarginRight}px`
                    : '0px',
                  paddingBottom: 0,
                  paddingTop: 0
                }
              },
              htmlInput: {
                step: props.step,
                min: props.minValue,
                max: props.maxValue
              }
            }}
            sx={{
              backgroundColor: props.backgroundColor,
              width: props.width ?? '100%',
              borderRadius: 1,
              outline: props.border,
              outlineOffset: props.borderOffset ?? -1
            }}
          />
        </Box>
      </Tooltip>

      {props.showArrows && (
        <Box>
          <Box sx={classes.arrowButton} onClick={onAdd}>
            &#9650;
          </Box>
          <Box sx={classes.arrowButton} onClick={onSubtract}>
            &#9660;
          </Box>
        </Box>
      )}

      {props.success && props.showSuffixIcon && (
        <CheckIcon
          color="success"
          sx={{
            marginLeft: '5px',
            marginRight: '-30px'
          }}
        />
      )}
    </Box>
  )
}
