// Functions
import { useEffect, useState, ReactElement } from 'react'
import { makeStyles } from '@mui/styles'

// Components
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import CheckIcon from '@mui/icons-material/Check'

// Style
import componentStyles from './TextInputField-CSS'

const useStyles = makeStyles(componentStyles)

type Props = {
  ndx?: number
  value: string
  height?: number
  width?: number | string
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  tooltip?: string | ReactElement
  fieldVariant?: 'filled' | 'outlined'
  passwordType?: boolean
  gainFocus?: number
  disabled?: boolean
  blurOnEnter?: boolean
  inputMarginRight?: number
  readOnly?: boolean
  reset?: boolean
  error?: boolean
  multiline?: boolean
  maxLength?: number
  success?: boolean
  fontColor?: string
  backgroundColor?: string
  border?: string
  borderOffset?: number
  showSuffixIcon?: boolean
  onBlur?: (p: { text: string }) => void
  onKeyDown?: (p: { keyCode: number; text: string }) => void
  onChange: (val: string) => void
  onDoubleClick?: () => void
  onClick?: () => void
}

export default function TextInputField(props: Props) {
  const classes = useStyles()

  useEffect(() => {
    if (props.gainFocus !== undefined) {
      if (props.gainFocus === props.ndx)
        document.getElementById('TextInputField')!.focus()
    }
  }, [props.gainFocus])

  const [value, setValue] = useState(props.value)

  const onChange = (event: any) => {
    const val = event.target.value
    setValue(val)
    props.onChange(val)
  }

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.reset !== undefined) {
      setValue('')
      props.onChange('')
    }
  }, [props.reset])

  const onBlur = (event: any) => {
    if (props.onBlur !== undefined) {
      setValue(event.target.defaultValue)
      props.onBlur({ text: event.target.defaultValue })
    }
  }
  const onKeyDown = (event: any) => {
    setValue(event.target.defaultValue)
    if (props.onKeyDown !== undefined)
      props.onKeyDown({
        keyCode: event.keyCode,
        text: event.target.defaultValue
      })
    if (event.keyCode === 13 && props.blurOnEnter)
      document.getElementById('TextInputField')!.blur()
  }
  const onDoubleClick = () => {
    if (props.onDoubleClick !== undefined) props.onDoubleClick()
  }
  const onClick = () => {
    if (props.onClick !== undefined) props.onClick()
  }

  return (
    <Box
      className={classes.mainBox}
      style={{
        marginTop: props.marginTop === undefined ? 5 : props.marginTop,
        marginBottom: props.marginBottom === undefined ? 5 : props.marginBottom,
        marginLeft: props.marginLeft,
        zIndex: 10
      }}
    >
      <Tooltip
        arrow
        title={
          props.tooltip === undefined ? null : (
            <div style={{ fontSize: 13 }}>{props.tooltip}</div>
          )
        }
        placement="right-start"
        enterDelay={300}
      >
        <div style={{ width: '100%' }}>
          <TextField
            id="TextInputField"
            multiline={props.multiline === undefined ? false : props.multiline}
            label=""
            variant={
              props.fieldVariant === undefined ? 'filled' : props.fieldVariant
            }
            autoComplete="off"
            type={props.passwordType ? 'password' : 'text'}
            error={props.error}
            maxRows={4}
            minRows={4}
            style={{
              width: props.width === undefined ? '100%' : props.width,
              height: props.height === undefined ? 30 : props.height,
              background: props.backgroundColor,
              outline: props.border,
              outlineOffset:
                props.borderOffset === undefined ? -1 : props.borderOffset,
              borderRadius: 4
            }}
            InputProps={{
              readOnly: props.readOnly === undefined ? false : props.readOnly
            }}
            inputProps={{
              maxLength: props.maxLength,
              style: {
                color: props.fontColor,
                fontSize: 13,
                height: props.height === undefined ? 30 : props.height,
                textAlign: 'left',
                marginLeft: -2,
                marginRight:
                  props.inputMarginRight === undefined
                    ? 10
                    : props.inputMarginRight,
                border: 'none',
                paddingBottom: 0,
                paddingTop: 0
              }
            }}
            value={value}
            disabled={props.disabled === undefined ? false : props.disabled}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
          />
        </div>
      </Tooltip>
      {props.success && props.showSuffixIcon ? (
        <CheckIcon
          color="success"
          style={{
            marginLeft: 5,
            marginRight: -30
          }}
        />
      ) : null}
    </Box>
  )
}
