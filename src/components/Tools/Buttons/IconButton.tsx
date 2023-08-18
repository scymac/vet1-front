// Functions
import { ReactElement } from 'react'
import { makeStyles } from '@mui/styles'

// Components
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import NotesIcon from '@mui/icons-material/Notes'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'

// Style
import 'assets/theme/textNoSelect.css'
import themeColors from 'assets/theme/colors'

// color style 1
const selectedIconColor     = themeColors.success.main
const defaultIconColor      = themeColors.gray.dark
const hoverBackgroundColor  = '#fefdfc'
const disabledIconColor     = '#bbb'

const componentStyles = {
  iconButton: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    5,
    background:     '#ffffff00',
    borderRadius:   '3px 3px 3px 3px',
    cursor:         'pointer',
    color:          defaultIconColor,
    '&:hover':      {
      background: hoverBackgroundColor,
      boxShadow:  '1px 2px 3px -2px rgba(0,0,0,0.7)',
      transform:  'translate(0px, -1px)',
    },
    '&:active': {
      background: '#fff',
      boxShadow:  '-1px -1px 0px 0px rgba(0,0,0,0.3)',
      transform:  'translate(0px, 0px)',
    },
  },
  iconButtonWhite: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    5,
    background:     '#ffffff00',
    borderRadius:   '3px 3px 3px 3px',
    cursor:         'pointer',
    color:          '#fff',
    '&:hover':      {
      background: hoverBackgroundColor,
      boxShadow:  '1px 2px 3px -2px rgba(0,0,0,0.7)',
      transform:  'translate(0px, -1px)',
    },
    '&:active': {
      background: hoverBackgroundColor,
      boxShadow:  '-1px -1px 0px 0px rgba(0,0,0,0.3)',
      transform:  'translate(0px, 0px)',
    },
  },
  iconButtonSelected: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    5,
    background:     '#fff',
    borderRadius:   '3px 3px 3px 3px',

    // borderBottom: '1px solid #fafafa', borderRight: '1px solid #fafafa',
    color:        selectedIconColor,
    cursor:       'default',
    borderBottom: '1px solid #f8f8f8',
    borderRight:  '1px solid #f8f8f8',
    boxShadow:    '-1px -1px 0px 0px rgba(0,0,0,0.3)',
    transform:    'translate(0px, 0px)',
  },
  iconButtonDisabled: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    5,
    background:     '#ffffff00',
    borderRadius:   '3px 3px 3px 3px',
    cursor:         'default',
    color:          disabledIconColor,
  },
  iconButtonNoEffects: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    5,
    background:     '#ffffff00',
    borderRadius:   '3px 3px 3px 3px',
    cursor:         'pointer',
    color:          defaultIconColor,
  },
  iconButtonNoEffectsWhite: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    5,
    background:     '#ffffff00',
    borderRadius:   '3px 3px 3px 3px',
    cursor:         'pointer',
    color:          '#fff',
  },
  iconButtonDisabledNoEffects: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    5,
    background:     'transparent',
    borderRadius:   '3px 3px 3px 3px',
    cursor:         'default',
    color:          disabledIconColor,
  },
  iconButtonSelectedNoEffects: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    marginRight:    5,
    background:     'transparent',
    borderRadius:   '3px 3px 3px 3px',
    color:          selectedIconColor,
    cursor:         'default',
  },
  hoverSuccess: {
    '&:hover': {
      color: themeColors.success.main,
    },
  },
  hoverInfo: {
    '&:hover': {
      color: themeColors.info.main,
    },
  },
  hoverError: {
    '&:hover': {
      color: themeColors.error.main,
    },
  },
  hoverNeutral: {
    '&:hover': {
      color: themeColors.gray.mid,
    },
  },
}

type Props = {
  icon            : string,
  color?          : string,
  visible?        : boolean,
  tooltip?        : string|ReactElement,
  value?          : any,
  disabled?       : boolean,
  disableEffects? : boolean,
  selected?       : boolean,
  width?          : number,
  height?         : number,
  activeCursor?   : string,
  marginLeft?     : number,
  marginRight?    : number,
  scale?          : number,
  theme?          : 'white'|'dark',
  onClick?        : (value:any) => void,
}

const useStyles:any = makeStyles(componentStyles)

export default function IconButton(props: Props) {

  const classes = useStyles()

  const getIcon = () => {
    switch (props.icon) {

      // React Icons
      case 'add': return (
        <AddIcon
          className = {props.disabled ? null : classes.hoverSuccess}
          style     = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'admin': return (
        <AdminPanelSettingsIcon
          style = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'arrowBack': return (
        <ArrowBackIcon
          className = {props.disabled ? null : classes.hoverNeutral}
          style     = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'delete': return (
        <DeleteIcon
          className = {props.disabled ? null : classes.hoverError}
          style     = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'edit': return (
        <EditIcon
          className = {props.disabled ? null : classes.hoverInfo}
          style     = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'factCheck': return (
        <FactCheckIcon
          className = {props.disabled ? null : classes.hoverSuccess}
          style     = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'folderOpen': return (
        <FolderOpenIcon
          className = {props.disabled ? null : classes.hoverInfo}
          style     = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'notes': return (
        <NotesIcon
          className = {props.disabled ? null : classes.hoverNeutral}
          style     = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'person': return (
        <PersonIcon
          style = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
      case 'save': return (
        <SaveIcon
          className = {props.disabled ? null : classes.hoverSuccess}
          style     = {{ transform: `scale(${props.scale === undefined ? 1 : props.scale})` }}
        />
      )
    }
  }

  const getIconFrameClass2 = () => {
    if (props.disabled && props.disableEffects) return classes.iconButtonDisabledNoEffects
    if (props.disabled) return classes.iconButtonDisabled
    if (props.selected && props.disableEffects) return classes.iconButtonSelectedNoEffects
    if (props.selected) return classes.iconButtonSelected
    if (props.theme === 'white') {
      if (props.disableEffects) return classes.iconButtonNoEffectsWhite
      return classes.iconButtonWhite
    }

    if (props.disableEffects) return classes.iconButtonNoEffects
    return classes.iconButton

  }

  const onClick = () => {
    if (!props.disabled && props.onClick !== undefined) props.onClick(props.value)
  } // on click returns a value case the parent has set one

  const postStyleBox = {
    cursor:         props.selected ? props.activeCursor : undefined,
    marginLeft:     props.marginLeft === undefined ? 0 : props.marginLeft,
    marginRight:    props.marginRight === undefined ? 0 : props.marginRight,
    height:         props.height === undefined ? 25    : props.height,
    width:          props.width === undefined ? 25     : props.width,
    iconHoverColor: '#ff0000',
    color:          props.color,
  }

  return (
    <div>
      {
        props.visible || props.visible === undefined
          ? (
            <Tooltip
              arrow
              title = {
            props.tooltip === undefined ? (
              ''
            ) : (
              <div style = {{ fontSize: 13 }}>{props.tooltip}</div>
            )
          }
              placement  = "bottom"
              enterDelay = {300}
            >
              <Box
                className = {getIconFrameClass2()}
                style     = {postStyleBox}
                onClick   = {onClick}
              >
                {getIcon()}
              </Box>
            </Tooltip>
          )
          : null
      }
    </div>
  )
}
