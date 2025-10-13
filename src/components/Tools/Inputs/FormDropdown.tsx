import { useEffect, useState, ReactElement } from 'react'
import { Box, Tooltip, Zoom, Typography } from '@mui/material'
import Select from 'react-select'
import { DropdownOption, TooltipPlacement } from 'types/types'
import './FormDropdown.css'

type Props = {
  height?: number
  width?: number | string
  alignment?: 'horizontal' | 'vertical'
  marginBottom?: number
  titleFontSize?: number
  optionsFontSize?: number
  labelFontSize?: number
  valueContainerMarginTop?: number
  optionPadding?: number
  titleWidth?: number
  titleAlignment?: 'left' | 'right'
  borderRadius?: number
  selectedOption: undefined | null | string
  options: DropdownOption[]
  validation?: null | number
  title?: string | ReactElement
  tooltip?: string | ReactElement
  tooltipPlacement?: TooltipPlacement
  placeholder?: string
  disabled?: boolean
  maxMenuHeight?: number
  onChange: (val: string) => void
}

export default function FormDropdown(props: Props) {
  const [options, setOptions] = useState(props.options)
  const [inputFocused, setInputFocused] = useState(false)

  useEffect(() => {
    setOptions(props.options)
  }, [props.options])

  const handleChange = (selOption: any) => {
    props.onChange(selOption.value)
  }

  const getSelectedOption = () => {
    return options.find(opt => opt.value === props.selectedOption)
  }

  // MUI-like border logic
  const getBorderColor = () => {
    if (props.validation === 1) return 'rgb(46, 125, 50)' // green
    if (props.validation === -1) return 'rgb(211, 47, 47)' // red
    if (inputFocused) return 'rgb(25, 118, 210)' // blue (MUI focus)
    return 'rgba(0, 0, 0, 0.23)' // default MUI outline
  }

  const customStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      background: props.disabled ? '#f5f5f5' : '#fff',
      borderColor: getBorderColor(),
      borderWidth: '1px',
      borderStyle: 'solid',
      minHeight: props.height ?? 40,
      height: props.height ?? 40,
      width: '100%',
      borderRadius: props.borderRadius ?? '4px',
      fontSize: props.optionsFontSize ?? 13,
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(25, 118, 210, 0.2)' : 'none',
      '&:hover': {
        borderColor:
          props.validation === 1
            ? 'rgb(46, 125, 50)'
            : props.validation === -1
              ? 'rgb(211, 47, 47)'
              : 'rgba(0, 0, 0, 0.87)'
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: props.height ?? 40,
      padding: '0 8px',
      marginTop: props.valueContainerMarginTop ?? 0,
      fontSize: props.labelFontSize ?? 14,
      fontWeight: 400
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: props.height ?? 40
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#1976d2'
        : state.isFocused
          ? '#e3f2fd'
          : '#fff',
      color: state.isSelected ? '#fff' : '#333',
      padding: props.optionPadding ?? '6px',
      fontSize: props.optionsFontSize ?? 13
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: props.borderRadius ?? '4px',
      boxShadow:
        'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'
    })
  }

  return (
    <Box
      sx={{
        display: props.alignment === 'horizontal' ? 'flex' : 'block',
        alignItems: 'center',
        marginBottom: `${props.marginBottom ?? 0}px`
      }}
    >
      {props.title && (
        <Box
          sx={{
            display: 'flex',
            justifyContent:
              props.alignment === 'vertical' || props.alignment === undefined
                ? 'flex-start'
                : (props.titleAlignment ?? 'left'),
            alignItems: 'center',
            marginBottom:
              props.alignment === 'vertical' || props.alignment === undefined
                ? '-5px'
                : '0px',
            marginRight: props.alignment === 'horizontal' ? '10px' : undefined,
            width: props.titleWidth
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: `${props.titleFontSize ?? 14}px`
            }}
          >
            {props.title}
          </Typography>
        </Box>
      )}

      <Tooltip
        arrow
        title={
          props.tooltip ? (
            <Box sx={{ fontSize: '13px' }}>{props.tooltip}</Box>
          ) : (
            ''
          )
        }
        placement={props.tooltipPlacement ?? 'right'}
        enterDelay={300}
        slots={{
          transition: Zoom
        }}
        slotProps={{
          transition: { timeout: 300 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: props.width ?? '100%',
            height: `${props.height ?? 40}px`,
            transition: 'border-color 0.2s ease',
            zIndex: 5
          }}
        >
          <Box
            sx={{
              flexGrow: 1
            }}
          >
            <Select
              placeholder={props.placeholder ?? 'Select...'}
              styles={customStyle}
              value={getSelectedOption()}
              onChange={handleChange}
              options={options}
              isDisabled={props.disabled}
              maxMenuHeight={props.maxMenuHeight ?? 200}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
          </Box>
        </Box>
      </Tooltip>
    </Box>
  )
}
