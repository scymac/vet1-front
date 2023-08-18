// Functions
import { useEffect, useState, ReactElement } from 'react'

// Types
import { DropdownOption, TooltipPlacement } from 'types/types'

// Components
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import Typography from '@mui/material/Typography'
import Select from 'react-select'

// Styles
import './FormDropdown.css'

type Props = {
  height?:                  number,
  width?:                   number|string,
  alignment?:               'horizontal'|'vertical',
  marginBottom?:            number,
  titleFontSize?:           number,
  optionsFontSize?:         number,
  labelFontSize?:           number,
  valueContainerMarginTop?: number,
  optionPadding?:           number,
  titleWidth?:              number,
  titleAlignment?:          'left'|'right',
  borderRadius?:            number,
  selectedOption:           undefined|null|string,
  options:                  DropdownOption[],
  validation?:              null|number,
  title?:                   string|ReactElement,
  tooltip?:                 string|ReactElement,
  tooltipPlacement?:        TooltipPlacement,
  placeholder?:             string,
  disabled?:                boolean,
  maxMenuHeight?:           number,
  onChange:                 (val: string) => void
}

export default function FormDropdown(props:Props) {

  const customStyle = {
    control: (provided:any, state:any) => ({
      ...provided,
      background:  '#fff',
      borderColor: '#9e9e9e',
      minHeight:   props.height === undefined ? 30 : props.height,
      height:      props.height === undefined ? 30 : props.height,
      width:       '100%',
      marginLeft:  '5px',
      fontSize:    props.optionsFontSize === undefined ? 12 : props.optionsFontSize,
      boxShadow:   state.isFocused ? null : null,
      border:      'none',
    }),
    valueContainer: (provided:any, state:any) => ({
      ...provided,
      height:     props.height === undefined ? 30 : props.height,
      padding:    '0 6px',
      marginTop:  props.valueContainerMarginTop,
      fontSize:   props.labelFontSize === undefined ? 14 : props.labelFontSize,
      fontWeight: 400,
    }),
    indicatorSeparator: (state:any) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided:any, state:any) => ({
      ...provided,
      height: props.height === undefined ? 30 : props.height,
    }),
    option: (provided:any, state:any) => ({
      ...provided,
      borderBottom: '1px dotted #EEE',
      color:        state.isSelected ? '#fff' : '#515252',
      padding:      props.optionPadding === undefined ? 5 : props.optionPadding,
      fontSize:     props.optionsFontSize === undefined ? 12 : props.optionsFontSize,
      fontFamily:   state.data.fontFamily,
      fontWeight:   400,
    }),
    singleValue: (provided:any, state:any) => ({
      ...provided,
      fontFamily: state.data.fontFamily,
    }),
  }

  const [options, setOptions] = useState(props.options)

  useEffect(() => {
    setOptions(props.options)
  }, [props.options])

  const handleChange = (selOption:any) => {
    props.onChange(selOption.value)
  }

  const getSelectedOption = () => {
    for (let i = 0; i < options.length; i += 1) {
      if (props.selectedOption === options[i].value) return options[i]
    }
    return undefined
  }

  const [inputFocused, setInputFocused] = useState(false)

  const getBorder = () => {
    if (props.validation === 1)   return '1px solid rgb(0,200,0)'                                                       // -1 = input rejected, 1 = validated, 0 = default(no input)
    if (props.validation === -1)  return '1px solid rgb(200,0,0)'
    if (inputFocused)             return '1px solid rgb(90,110,205)'
    return '1px solid rgb(255,255,255)'
  }

  return (
    <Box
      style = {{
        display:      props.alignment === 'horizontal' ? 'flex' : undefined,
        alignItems:   'center',
        marginBottom: props.marginBottom === undefined ? 0 : props.marginBottom,
      }}
    >
      {
          props.title === undefined ? null
            : (
              <Box
                style = {{
                  display:        'flex',
                  justifyContent: props.alignment === 'vertical' || props.alignment === undefined ? 'left' : props.titleAlignment,
                  alignItems:     'center',
                  background:     'none',
                  marginBottom:   props.alignment === 'vertical' || props.alignment === undefined  ? -5 : 0,
                  marginLeft:     2,
                  marginRight:    props.alignment === 'horizontal' ? 10 : undefined,
                  width:          props.titleWidth,
                }}
              >
                <Typography
                  style = {{
                    fontWeight: 600,
                    fontSize:   props.titleFontSize === undefined ? 14 : props.titleFontSize,
                  }}
                >
                  {props.title}
                </Typography>
              </Box>
            )
        }
      <Tooltip
        TransitionComponent = {Zoom}
        arrow
        title      = {props.tooltip === undefined ? '' : <div style = {{ fontSize: 14 }}>{props.tooltip}</div>}
        placement  = {props.tooltipPlacement === undefined ? 'right' : props.tooltipPlacement}
        enterDelay = {300}
      >
        <Box
          style = {{
            display:        'flex',
            justifyContent: 'left',
            alignItems:     'center',
            width:          props.width === undefined ? '100%' : props.width,
            height:         props.height === undefined ? 40 : props.height,
            background:     '#fff',
            borderRadius:   props.borderRadius === undefined ? 3 : props.borderRadius,
            border:         getBorder(),
            transition:     'border ease-in 0.2s',
            marginTop:      props.alignment === 'vertical' || props.alignment === undefined ? 10 : 0,
            marginBottom:   props.alignment === 'vertical' || props.alignment === undefined ? 10 : 0,
          }}
        >
          <Box
            style = {{
              display:        'flex',
              justifyContent: 'left',
              alignItems:     'center',
              width:          props.width === undefined ? '100%' : props.width,
              height:         props.height === undefined ? 40 : props.height,
              boxShadow:      '0px 1px 2px 0px #00000022',
            }}
          >
            <Box
              style = {{
                width:       props.width === undefined ? '100%' : props.width,
                marginRight: 10,
                zIndex:      20,
              }}
            >
              <Select
                placeholder   = {props.placeholder === undefined ? 'Select...' : props.placeholder}
                styles        = {customStyle}
                value         = {getSelectedOption()}
                onChange      = {handleChange}
                options       = {options}
                isDisabled    = {props.disabled === undefined ? false : props.disabled}
                maxMenuHeight = {props.maxMenuHeight === undefined ? 200 : props.maxMenuHeight}
              />
            </Box>
          </Box>
        </Box>
      </Tooltip>
    </Box>
  )
}
