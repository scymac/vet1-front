import { useEffect, useState, useRef, ReactElement } from 'react'
import { Box, Tooltip, TextField, InputAdornment } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

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
  const {
    value: propValue,
    gainFocus,
    ndx,
    tooltip,
    multiline,
    fieldVariant = 'filled',
    passwordType,
    error,
    width = '100%',
    height = 30,
    backgroundColor,
    border,
    borderOffset = -1,
    readOnly,
    maxLength,
    disabled,
    inputMarginRight = 10,
    fontColor,
    marginTop = 5,
    marginBottom = 5,
    marginLeft,
    reset,
    success,
    showSuffixIcon,
    blurOnEnter,
    onBlur,
    onKeyDown,
    onChange,
    onDoubleClick,
    onClick
  } = props

  const [value, setValue] = useState(propValue)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus handling
  useEffect(() => {
    if (gainFocus !== undefined && gainFocus === ndx) {
      inputRef.current?.focus()
    }
  }, [gainFocus, ndx])

  // Sync with external value
  useEffect(() => {
    setValue(propValue)
  }, [propValue])

  // Reset
  useEffect(() => {
    if (reset) {
      setValue('')
      onChange('')
    }
  }, [reset, onChange])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    setValue(val)
    onChange(val)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const val = event.target.value
    setValue(val)
    onBlur?.({ text: val })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const val = (event.target as HTMLInputElement).value
    setValue(val)
    onKeyDown?.({ keyCode: event.keyCode, text: val })
    if (event.keyCode === 13 && blurOnEnter) inputRef.current?.blur()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: marginLeft !== undefined ? `${marginLeft}px` : undefined,
        zIndex: 10
      }}
    >
      <Tooltip
        arrow
        title={tooltip ? <Box sx={{ fontSize: '13px' }}>{tooltip}</Box> : ''}
        placement="right-start"
        enterDelay={300}
      >
        <TextField
          inputRef={inputRef}
          multiline={!!multiline}
          variant={fieldVariant}
          type={passwordType ? 'password' : 'text'}
          error={!!error}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onDoubleClick={onDoubleClick}
          onClick={onClick}
          disabled={!!disabled}
          autoComplete="off"
          InputProps={{
            readOnly: !!readOnly,
            endAdornment:
              success && showSuffixIcon ? (
                <InputAdornment position="end">
                  <CheckIcon color="success" />
                </InputAdornment>
              ) : undefined
          }}
          slotProps={{
            input: {
              sx: {
                color: fontColor,
                fontSize: '13px',
                height: `${height}px`,
                textAlign: 'left',
                marginLeft: '-2px',
                marginRight: `${inputMarginRight}px`,
                border: 'none',
                paddingTop: '0px',
                paddingBottom: '0px'
              }
            },
            htmlInput: {
              maxLength
            }
          }}
          sx={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: `${height}px`,
            backgroundColor,
            outline: border,
            outlineOffset: `${borderOffset}px`,
            borderRadius: '4px'
          }}
        />
      </Tooltip>
    </Box>
  )
}
