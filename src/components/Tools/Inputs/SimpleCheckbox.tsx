// Functions
import { ReactElement } from 'react'

// Components
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

type Props = {
  checked       : boolean,
  caption       : string|ReactElement,
  height?       : number,
  marginBottom? : number,
  marginTop?    : number,
  checkboxColor?: string,
  checkedColor? : string,
  boxSize?      : number,
  textSize?     : number,
  disabled?     : boolean,
  onChange      : () => void,
}

export default function SimpleCheckbox(props:Props) {

  return (
    <Box
      style = {{
        width: '100%',
      }}
    >
      <FormGroup>
        <FormControlLabel
          style = {{
            marginLeft:   -5,
            height:       props.height === undefined ? 30     : props.height,
            marginBottom: props.marginBottom === undefined ? 0 : props.marginBottom,
            marginTop:    props.marginTop === undefined ? 0   : props.marginTop,
          }}
          control = {(
            <Checkbox
              size     = "small"
              checked  = {props.checked}
              onChange = {() => props.onChange()}
              disabled = {props.disabled === undefined ? false : props.disabled}
              sx       = {{
                color:                props.checkboxColor,
                '& .MuiSvgIcon-root': { fontSize: props.boxSize === undefined ? 18 : props.boxSize },
                '& .Mui-checked':     { color: props.checkedColor },
              }}
            />
          )}
          label = {<Typography style = {{ fontSize: props.textSize === undefined ? 13 : props.textSize }}>{props.caption}</Typography>}
        />
      </FormGroup>
    </Box>
  )
}
