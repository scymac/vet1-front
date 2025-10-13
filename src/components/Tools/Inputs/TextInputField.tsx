import { useEffect, useRef, useState, ReactElement } from 'react'
import { Box, Tooltip, TextField, InputAdornment } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { TooltipPlacement } from 'types/types'

type Props = {
  value: string
  onChange: (val: string) => void
  onBlur?: (val: string) => void
  onKeyDown?: (keyCode: number, val: string) => void
  onDoubleClick?: () => void
  onClick?: () => void

  tooltip?: string | ReactElement
  tooltipPlacement?: TooltipPlacement
  fieldVariant?: 'filled' | 'outlined'
  passwordType?: boolean
  multiline?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  success?: boolean
  showSuffixIcon?: boolean
  placeholder?: string

  width?: number | string
  height?: number
  maxLength?: number
  fontColor?: string
  backgroundColor?: string
  border?: string

  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  inputMarginRight?: number
}

export default function TextInputField({
  value,
  onChange,
  onBlur,
  onKeyDown,
  onDoubleClick,
  onClick,
  tooltip,
  fieldVariant = 'filled',
  passwordType = false,
  multiline = false,
  disabled = false,
  readOnly = false,
  error = false,
  success = false,
  showSuffixIcon = false,
  width = '100%',
  height = 30,
  maxLength,
  fontColor,
  backgroundColor,
  border,
  marginTop = 5,
  marginBottom = 5,
  marginLeft,
  inputMarginRight = 0,
  placeholder = '',
  tooltipPlacement = 'right-start'
}: Props) {
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    setLocalValue(val)
    onChange(val)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const val = event.target.value
    setLocalValue(val)
    onBlur?.(val)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const val = (event.target as HTMLInputElement).value
    setLocalValue(val)
    onKeyDown?.(event.keyCode, val)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: marginLeft !== undefined ? `${marginLeft}px` : undefined,
        width: typeof width === 'number' ? `${width}px` : width,
        zIndex: 10
      }}
    >
      <Tooltip
        arrow
        title={tooltip ? <Box sx={{ fontSize: '13px' }}>{tooltip}</Box> : ''}
        placement={tooltipPlacement ?? 'right-start'}
        enterDelay={300}
      >
        <TextField
          inputRef={inputRef}
          multiline={multiline}
          variant={fieldVariant}
          type={passwordType ? 'password' : 'text'}
          error={error}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onDoubleClick={onDoubleClick}
          onClick={onClick}
          disabled={disabled}
          autoComplete="off"
          placeholder={placeholder ?? ''}
          slotProps={{
            input: {
              readOnly,
              sx: {
                color: fontColor,
                fontSize: '13px',
                height: `${height}px`,
                marginRight: `${inputMarginRight}px`,
                border: 'none',
                paddingTop: '0px',
                paddingBottom: '0px',
                display: 'flex',
                alignItems: 'center'
              },
              endAdornment:
                success && showSuffixIcon ? (
                  <InputAdornment position="end">
                    <CheckIcon color="success" />
                  </InputAdornment>
                ) : undefined
            },
            htmlInput: {
              maxLength
            }
          }}
          sx={{
            width: '100%',
            height: `${height}px`,
            backgroundColor,
            outline: border,
            borderRadius: '4px'
          }}
        />
      </Tooltip>
    </Box>
  )
}
