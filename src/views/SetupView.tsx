// Functions
import { makeStyles } from '@mui/styles'
import {
  ApiCheckSetupId, ApiDeleteSetup, ApiNewSetup, ApiUpdateSetup,
} from 'api/Requests'
import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'

// Types
import { PermissionType, ScreenDim } from 'types/types'
import { IdType, NewSetup, Setup } from 'api/Interfaces'

// Components
import Box from '@mui/material/Box'
import { List, ListItem, ListItemButton } from '@mui/material'
import TextInputField from 'components/Tools/Inputs/TextInputField'
import IconButton from 'components/Tools/Buttons/IconButton'
import Text from 'components/Tools/Text/Text'
import SimpleCheckbox from 'components/Tools/Inputs/SimpleCheckbox'
import FormDropdown from 'components/Tools/Inputs/FormDropdown'
import ConfirmationModal from 'components/Tools/Modals/ConfirmationModal'

// Styles
import themeColors from 'assets/theme/colors'
import NumInputField from 'components/Tools/Inputs/NumInputField'
import { warn } from 'assets/functions/Texts'
import { timestampFormat } from 'assets/functions/Conversions'
import componentStyles from './SetupView-CSS'

const useStyles:any = makeStyles(componentStyles)

const cte = {
  electrode_distance_mm:      2200,
  electrode_half_distance_mm: 1100,
  spot_electrode_length_mm:   58.4,
  spot_electrode_gap_mm:      58.4,
  sample_width_mm:            1000,
  t_resistance_area_cm2:      9.4245,
}

const defaultSetup = () => ({
  name:                    '',
  material:                '',
  product:                 '',
  notes:                   '',
  max_thickness:           null,
  target_thickness:        null,
  min_thickness:           null,
  electrode_distance:      cte.electrode_distance_mm,         // constant value that depends on the machine construction
  electrode_half_distance: cte.electrode_half_distance_mm,    // NOT YET IN USE - constant value that depends on the machine construction
  spot_electrode_length:   cte.spot_electrode_length_mm,
  spot_electrode_gap:      cte.spot_electrode_gap_mm,
  sample_width:            cte.sample_width_mm,
  t_resistance_area:       cte.t_resistance_area_cm2,
  thickness:               false,   // true = make the measurement
  through_resistance:      false,   // true = make the measurement
  whole_resistance:        false,   // true = make the measurement
  local_resistance:        false,   // true = make the measurement
  hmc_samples:             1,       // how many samples will the multimeter make for each electrode
  max_tres:                null,
  min_tres:                null,
  max_wres:                null,
  min_wres:                null,
  max_lres:                null,
  min_lres:                null,
})

const minTargetThickness   = 0.02     // in mm
const maxTargetThickness   = 25       // in mm
const minTargetRes         = 0.1      // in Ohm
const maxTargetRes         = 5000000  // in Ohm
const maxSampleWidth       = 1500     // in mm
const minSampleWidth       = 200      // in mm
const spotElectrodeMax     = 100      // in mm
const spotElectrodeMin     = 20       // in mm
const elektrodeDistMax     = 2500     // in mm
const elektrodeDistMin     = 1800     // in mm
const halfElektrodeDistMax = 1500     // in mm
const halfElektrodeDistMin = 700      // in mm
const tResElektrodeMax     = 15       // in cm2
const tResElektrodeMin     = 5        // in cm2

type Props = {
  screenDim : ScreenDim,
  setupList : Setup[],
  permission: PermissionType,
  listSetups: () => void,
}

export default function MeasurementView(props:Props) {

  const classes = useStyles()
  const alert   = useAlert()

  const [selSetup, setSelSetup]       = useState('')
  const [setupBuffer, setSetupBuffer] = useState<NewSetup>(defaultSetup())
  const [created, setCreated]         = useState('')
  const [modified, setModified]       = useState('')
  const [isEditing, setIsEditing]     = useState(false)
  const [isCreating, setIsCreating]   = useState(false)
  const [setupInUse, setSetupInUse]   = useState(false)

  //* ** Get setup list on load */
  useEffect(() => { props.listSetups() }, [])

  const correctResistances = (input: NewSetup) => { // convert kOmh to Ohm
    const out = input
    out.max_lres = out.max_lres === null ? null : Number(out.max_lres) * 1000
    out.min_lres = out.min_lres === null ? null : Number(out.min_lres) * 1000
    out.max_tres = out.max_tres === null ? null : Number(out.max_tres) * 1000
    out.min_tres = out.min_tres === null ? null : Number(out.min_tres) * 1000
    out.max_wres = out.max_wres === null ? null : Number(out.max_wres) * 1000
    out.min_wres = out.min_wres === null ? null : Number(out.min_wres) * 1000
    return out
  }

  //* ** API */
  const newSetup = async () => {
    try {
      const res = await ApiNewSetup(setupBuffer)
      if (res.ok) {
        const id = res.message as IdType
        alert.success('Einstellung erstellt!')
        props.listSetups()
        setSelSetup(id.id)
        setIsCreating(false)
      }
      else alert.error(res.statusMessage)
    }
    catch {
      alert.error('Server Offline')
    }
  }
  const updateSetup = async () => {
    try {
      const res = await ApiUpdateSetup(selSetup, setupBuffer)
      if (res.ok) {
        alert.success('Einstellung aktualisiert!')
        setIsEditing(false)
        props.listSetups()
      }
      else alert.error(res.statusMessage)
    }
    catch {
      alert.error('Server Offline')
    }
  }
  const deleteSetup = async () => {
    try {
      const res = await ApiDeleteSetup(selSetup)
      if (res.ok) {
        alert.success('Einstellung gelöscht!')
        props.listSetups()
        setSelSetup('')
        setSetupBuffer(defaultSetup())
      }
      else alert.error(res.statusMessage)
    }
    catch {
      alert.error('Server Offline')
    }
  }

  const checkIfSetupInUse = async () => {
    try {
      const res = await ApiCheckSetupId(selSetup)
      if (res.ok) {
        const inUse = res.message as string
        setSetupInUse(inUse === 'true')
      }
      else alert.error(res.statusMessage)
    }
    catch {
      console.log('no response')
    }
  }

  const onListClick = (id:string) => {
    setSelSetup(id)
    if (id !== '') {
      const record = props.setupList.filter((setup) => setup.id === id)[0]
      setCreated(timestampFormat(record.created))
      setModified(timestampFormat(record.modified))
      setSetupBuffer((p) => {
        const prev = p
        prev.name               = record.name
        prev.material           = record.material
        prev.product            = record.product
        prev.notes              = record.notes
        prev.max_thickness      = record.max_thickness
        prev.target_thickness   = record.target_thickness
        prev.min_thickness      = record.min_thickness
        prev.electrode_distance = record.electrode_distance
        prev.sample_width       = record.sample_width
        prev.thickness          = record.thickness
        prev.through_resistance = record.through_resistance
        prev.whole_resistance   = record.whole_resistance
        prev.local_resistance   = record.local_resistance
        prev.hmc_samples        = record.hmc_samples
        prev.max_tres           = record.max_tres// === null ? null : Number(record.max_tres) / 1000 // Ohm to kOhm
        prev.min_tres           = record.min_tres// === null ? null : Number(record.min_tres) / 1000
        prev.max_wres           = record.max_wres// === null ? null : Number(record.max_wres) / 1000
        prev.min_wres           = record.min_wres// === null ? null : Number(record.min_wres) / 1000
        prev.max_lres           = record.max_lres// === null ? null : Number(record.max_lres) / 1000
        prev.min_lres           = record.min_lres// === null ? null : Number(record.min_lres) / 1000
        return ({ ...prev })
      })
    }
  }

  //* ** Navigation */
  const switchToNewSetupForm = () => {
    setIsCreating(true)
    setSetupBuffer(defaultSetup())
    setSelSetup('')
  }
  const getFormBorderColor = () => {
    if (isCreating) return `1px solid ${themeColors.success.main}`
    if (isEditing) return `1px solid ${themeColors.info.main}`
    return '1px solid #eee'
  }
  const cancelForm = () => {
    if (isCreating) {
      setSetupBuffer(defaultSetup())
      setSelSetup('')
      setIsCreating(false)
    }
    else {
      onListClick(selSetup)
      setIsEditing(false)
    }
  }

  const onSaveClick = (val:any) => {
    if (isCreating) newSetup()
    else updateSetup()
  }

  const onThicknessChange = () => {
    setSetupBuffer((p) => {
      const prev = p
      prev.thickness = !prev.thickness
      prev.max_thickness = null
      prev.min_thickness = null
      return { ...prev }
    })
  }
  const onTresChange = () => {
    setSetupBuffer((p) => {
      const prev = p
      prev.through_resistance = !prev.through_resistance
      prev.max_tres = null
      prev.min_tres = null
      return { ...prev }
    })
  }
  const onWresChange = () => {
    setSetupBuffer((p) => {
      const prev = p
      prev.whole_resistance = !prev.whole_resistance
      prev.max_wres = null
      prev.min_wres = null
      return { ...prev }
    })
  }
  const onLresChange = () => {
    setSetupBuffer((p) => {
      const prev = p
      prev.local_resistance = !prev.local_resistance
      prev.max_lres = null
      prev.min_lres = null
      return { ...prev }
    })
  }

  const getNameConflict = () => (
    isCreating
      ? props.setupList.filter((s) => s.name === setupBuffer.name).length > 0
      : props.setupList.filter((s) => s.name === setupBuffer.name && s.id !== selSetup).length > 0
  )
  const getSaveDisabled = () => (
    getNameConflict()
      || (
        !setupBuffer.thickness
        && !setupBuffer.through_resistance
        && !setupBuffer.whole_resistance
        && !setupBuffer.local_resistance
      )
      || setupBuffer.name.length === 0
      || setupBuffer.material.length === 0
      || setupBuffer.product.length === 0

      // thickness
      || (
        setupBuffer.thickness
        && (
          Number(setupBuffer.target_thickness) < minTargetThickness
          || Number(setupBuffer.target_thickness) > maxTargetThickness
          || Number(setupBuffer.max_thickness) < minTargetThickness
          || Number(setupBuffer.max_thickness) > maxTargetThickness
          || Number(setupBuffer.min_thickness) < minTargetThickness
          || Number(setupBuffer.min_thickness) > maxTargetThickness
          || Number(setupBuffer.min_thickness) >= Number(setupBuffer.target_thickness)
          || Number(setupBuffer.max_thickness) <= Number(setupBuffer.target_thickness)
        )
      )

      // t_res
      || (
        setupBuffer.through_resistance
        && (
          Number(setupBuffer.max_tres) < minTargetRes
          || Number(setupBuffer.max_tres) > maxTargetRes
          || Number(setupBuffer.min_tres) < minTargetRes
          || Number(setupBuffer.min_tres) > maxTargetRes
          || Number(setupBuffer.min_tres) >= Number(setupBuffer.max_tres)
        )
      )

      // w_res
      || (
        setupBuffer.whole_resistance
        && (
          Number(setupBuffer.max_wres) < minTargetRes
          || Number(setupBuffer.max_wres) > maxTargetRes
          || Number(setupBuffer.min_wres) < minTargetRes
          || Number(setupBuffer.min_wres) > maxTargetRes
          || Number(setupBuffer.min_wres) >= Number(setupBuffer.max_wres)
        )
      )

      // l_res
      || (
        setupBuffer.local_resistance
        && (
          Number(setupBuffer.max_lres) < minTargetRes
          || Number(setupBuffer.max_lres) > maxTargetRes
          || Number(setupBuffer.min_lres) < minTargetRes
          || Number(setupBuffer.min_lres) > maxTargetRes
          || Number(setupBuffer.min_lres) >= Number(setupBuffer.max_lres)
        )
      )

  )
  const getSaveTooltip = () => (
    <>
      Speichern
      {getSaveDisabled() ? <br /> : null}
      {getNameConflict() ? (
        <>
          <br />
          {' '}
          - Die Bezeichnung muss eindeutig sein.
        </>
      ) : null}
      {
        (
          !setupBuffer.thickness
          && !setupBuffer.through_resistance
          && !setupBuffer.whole_resistance
          && !setupBuffer.local_resistance
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Mindestens 1 Messung auswählen.
          </>
          ) : null
      }
      {setupBuffer.name.length === 0 ? (
        <>
          <br />
          {' '}
          {warn}
          {' '}
          Bezeichnung darf nicht leer sein
        </>
      ) : null}
      {setupBuffer.material.length === 0 ? (
        <>
          <br />
          {' '}
          {warn}
          {' '}
          Material darf nicht leer sein
        </>
      ) : null}
      {setupBuffer.product.length === 0 ? (
        <>
          <br />
          {' '}
          {warn}
          {' '}
          Produkt darf nicht leer sein
        </>
      ) : null}
      {
        (
          setupBuffer.thickness
          && (
            Number(setupBuffer.max_thickness) < minTargetThickness
            || Number(setupBuffer.max_thickness) > maxTargetThickness
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Max. Dicke muss zwischen
            {' '}
            {minTargetThickness}
            {' '}
            -
            {' '}
            {maxTargetThickness}
            {' '}
            eingestellt
          </>
          ) : null
      }
      {
        (
          setupBuffer.thickness
          && (
            Number(setupBuffer.min_thickness) < minTargetThickness
            || Number(setupBuffer.min_thickness) > maxTargetThickness
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Min. Dicke muss zwischen
            {' '}
            {minTargetThickness}
            {' '}
            -
            {' '}
            {maxTargetThickness}
            {' '}
            eingestellt
          </>
          ) : null
      }
      {
        (
          setupBuffer.thickness
          && (
            Number(setupBuffer.min_thickness) >= Number(setupBuffer.max_thickness)
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Min. Dicke muss kleiner als max Dicke sein
          </>
          ) : null
      }
      {
        (
          setupBuffer.through_resistance
          && (
            Number(setupBuffer.max_tres) < minTargetRes
            || Number(setupBuffer.max_tres) > maxTargetRes
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Max. Durchgangswid. muss zwischen
            {' '}
            {minTargetRes}
            {' '}
            -
            {' '}
            {maxTargetRes}
            {' '}
            eingestellt
          </>
          ) : null
      }
      {
        (
          setupBuffer.through_resistance
          && (
            Number(setupBuffer.min_tres) < minTargetRes
            || Number(setupBuffer.min_tres) > maxTargetRes
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Min. Durchgangswid. muss zwischen
            {' '}
            {minTargetRes}
            {' '}
            -
            {' '}
            {maxTargetRes}
            {' '}
            eingestellt
          </>
          ) : null
      }
      {
        (
          setupBuffer.through_resistance
          && (
            Number(setupBuffer.min_tres) >= Number(setupBuffer.max_tres)
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Min. Durchgangswid. muss kleiner als Max. Durchgangswid. sein
          </>
          ) : null
      }
      {
        (
          setupBuffer.whole_resistance
          && (
            Number(setupBuffer.max_wres) < minTargetRes
            || Number(setupBuffer.max_wres) > maxTargetRes
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Max. ges. Oberflächenwid. muss zwischen
            {' '}
            {minTargetRes}
            {' '}
            -
            {' '}
            {maxTargetRes}
            {' '}
            eingestellt
          </>
          ) : null
      }
      {
        (
          setupBuffer.whole_resistance
          && (
            Number(setupBuffer.min_wres) < minTargetRes
            || Number(setupBuffer.min_wres) > maxTargetRes
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Min. ges. Oberflächenwid. muss zwischen
            {' '}
            {minTargetRes}
            {' '}
            -
            {' '}
            {maxTargetRes}
            {' '}
            eingestellt
          </>
          ) : null
      }
      {
        (
          setupBuffer.whole_resistance
          && (
            Number(setupBuffer.min_wres) >= Number(setupBuffer.max_wres)
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Min. ges. Oberflächenwid. muss kleiner als Max. ges. Oberflächenwid. sein
          </>
          ) : null
      }
      {
        (
          setupBuffer.local_resistance
          && (
            Number(setupBuffer.max_lres) < minTargetRes
            || Number(setupBuffer.max_lres) > maxTargetRes
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Max. lok. Oberflächenwid. muss zwischen
            {' '}
            {minTargetRes}
            {' '}
            -
            {' '}
            {maxTargetRes}
            {' '}
            eingestellt
          </>
          ) : null
      }
      {
        (
          setupBuffer.local_resistance
          && (
            Number(setupBuffer.min_lres) < minTargetRes
            || Number(setupBuffer.min_lres) > maxTargetRes
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Min. lok. Oberflächenwid. muss zwischen
            {' '}
            {minTargetRes}
            {' '}
            -
            {' '}
            {maxTargetRes}
            {' '}
            eingestellt
          </>
          ) : null
      }
      {
        (
          setupBuffer.local_resistance
          && (
            Number(setupBuffer.min_lres) >= Number(setupBuffer.max_lres)
          )
        ) ? (
          <>
            <br />
            {' '}
            {warn}
            {' '}
            Min. lok. Oberflächenwid. muss kleiner als Max. lok. Oberflächenwid. sein
          </>
          ) : null
      }
    </>
  )

  //* ** MODAL */
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  //* ** RENDERS */
  const renderList = () => props.setupList.map((setup) => (
    <ListItem
      key = {setup.id}
      disablePadding
      onClick = {() => { if (!isEditing) onListClick(setup.id) }}
    >
      <ListItemButton
        key      = {setup.id}
        selected = {setup.id === selSetup}
      >
        {setup.name}
      </ListItemButton>
    </ListItem>
  ))

  return (
    <>
      <ConfirmationModal
        show             = {showConfirmationModal}
        close            = {() => { setShowConfirmationModal(false) }}
        onConfirm        = {deleteSetup}
        screenDimensions = {props.screenDim}
        title            = {`${setupBuffer.name} LÖSCHEN`}
        question         = {setupInUse ? 'Diese Einstellung wird von einem Auftrag verwendet und kann nicht gelöscht werden.' : 'Sind Sie sicher, dass Sie diese Einstellung löschen wollen?'}
        icon             = "delete"
        yesCaption       = "LÖSCHEN"
        noCaption        = "NEIN"
        confirmColor     = "error"
        disableConfirmation = {setupInUse}
      />
      <Box>
        <Box
          className = {classes.buttonBox}
        >
          <IconButton
            icon    = "add"
            tooltip = "Neu"
            width   = {25}
            height  = {25}
            onClick = {() => { switchToNewSetupForm() }}
            visible = {!isEditing && !isCreating}
          />
        </Box>
        <Box
          className = {classes.buttonBox2}
        >
          <IconButton
            icon    = "arrowBack"
            tooltip = "Zurück"
            width   = {25}
            height  = {25}
            onClick = {() => cancelForm()}
            visible = {isEditing || isCreating}
          />
          <IconButton
            icon       = "edit"
            tooltip    = "Bearbeiten"
            marginLeft = {10}
            width      = {25}
            height     = {25}
            onClick    = {() => { setIsEditing(true) }}
            visible    = {!isEditing && !isCreating}
            disabled   = {selSetup === ''}
          />
          <IconButton
            icon       = "save"
            tooltip    = {getSaveTooltip()}
            marginLeft = {10}
            width      = {25}
            height     = {25}
            onClick    = {onSaveClick}
            visible    = {isEditing || isCreating}
            disabled   = {getSaveDisabled()}
          />
          <IconButton
            icon       = "delete"
            tooltip    = "Löschen"
            marginLeft = {10}
            width      = {25}
            height     = {25}
            onClick    = {() => { setShowConfirmationModal(true); checkIfSetupInUse() }}
            visible    = {!isEditing && !isCreating}
            disabled   = {selSetup === ''}
          />
        </Box>
        {
          isCreating || isEditing
            ? (
              <Box
                className = {classes.labelBox}
              >
                <Text
                  text  = {isCreating ? 'NEU' : 'BEARBEITEN'}
                  color = {isCreating ? themeColors.success.main : themeColors.info.main}
                  type  = "h5"
                />
              </Box>
            )
            :  null
        }
        <Box
          className = {classes.listBox}
          style     = {{ height: props.screenDim.height - 115 }}
        >
          <List component = "nav">
            {renderList()}
          </List>
        </Box>

        <Box
          className = {classes.formBox}
          style     = {{
            height: props.screenDim.height - 135,
            border: getFormBorderColor(),
          }}
        >

          {
            isCreating || selSetup.length > 0
              ? (
                <>
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText}>
                      <Text
                        text       = "* Bezeichnung"
                        marginLeft = {10}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <TextInputField
                        value          = {setupBuffer.name}
                        onChange       = {(val:string) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.name = val; return { ...p }
                          })
                        }}
                        fieldVariant   = "outlined"
                        height         = {30}
                        disabled       = {!isCreating && !isEditing}
                        error          = {getNameConflict()}
                        tooltip        = {props.setupList.filter((s) => s.name === setupBuffer.name).length > 0 ? 'Die Bezeichnung muss eindeutig sein.' : undefined}
                        success        = {setupBuffer.name.length > 0}
                        border         = {setupBuffer.name.length > 0 ? undefined : `1px solid ${themeColors.warning.light}`}
                        showSuffixIcon = {isCreating || isEditing}
                      />
                    </Box>
                  </Box>
                  {
                !isCreating && !isEditing
                  ? (
                    <>
                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText}>
                          <Text
                            text       = "* Erstellt am"
                            marginLeft = {10}
                          />
                        </Box>
                        <Box className = {classes.formItemField}>
                          <TextInputField
                            value        = {created}
                            onChange     = {() => null}
                            fieldVariant = "outlined"
                            height       = {30}
                            disabled     = {!isCreating && !isEditing}
                          />
                        </Box>
                      </Box>
                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText}>
                          <Text
                            text       = "* letzte Änderung"
                            marginLeft = {10}
                          />
                        </Box>
                        <Box className = {classes.formItemField}>
                          <TextInputField
                            value        = {modified}
                            onChange     = {() => null}
                            fieldVariant = "outlined"
                            height       = {30}
                            disabled     = {!isCreating && !isEditing}
                          />
                        </Box>
                      </Box>
                    </>
                  )
                  : null
              }
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText}>
                      <Text
                        text       = "* Material"
                        marginLeft = {10}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <TextInputField
                        value          = {setupBuffer.material}
                        onChange       = {(val:string) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.material = val; return { ...p }
                          })
                        }}
                        fieldVariant   = "outlined"
                        height         = {30}
                        disabled       = {!isCreating && !isEditing}
                        success        = {setupBuffer.material.length > 0}
                        border         = {setupBuffer.material.length > 0 ? undefined : `1px solid ${themeColors.warning.light}`}
                        showSuffixIcon = {isCreating || isEditing}
                      />
                    </Box>
                  </Box>
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText}>
                      <Text
                        text       = "* Produkt"
                        marginLeft = {10}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <TextInputField
                        value           = {setupBuffer.product}
                        onChange        = {(val:string) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.product = val; return { ...p }
                          })
                        }}
                        fieldVariant    = "outlined"
                        height          = {30}
                        disabled        = {!isCreating}
                        success         = {setupBuffer.product.length > 0}
                        border          = {setupBuffer.product.length > 0 ? undefined : `1px solid ${themeColors.warning.light}`}
                        showSuffixIcon  = {isCreating || isEditing}
                        backgroundColor = {isEditing ? themeColors.gray.lightest : undefined}
                      />
                    </Box>
                  </Box>
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText}>
                      <Text
                        text       = "Bemerkungen"
                        marginLeft = {20}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <TextInputField
                        value        = {setupBuffer.notes}
                        onChange     = {(val:string) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.notes = val; return { ...p }
                          })
                        }}
                        fieldVariant = "outlined"
                        disabled     = {!isCreating && !isEditing}
                      />
                    </Box>
                  </Box>
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText6}>
                      <Text
                        text       = "* Elektrodenabstand [mm]"
                        marginLeft = {10}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <NumInputField
                        value           = {cte.electrode_distance_mm}
                        onChange        = {(val:number) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.electrode_distance = val; return { ...p }
                          })
                        }}
                        fieldVariant    = "outlined"
                        disabled        = {props.permission !== 'admin'}
                        backgroundColor = {(isEditing || isCreating) && props.permission !== 'admin' ? themeColors.gray.lightest : undefined}
                        precision       = {0}
                        showSuffixIcon = {isCreating || isEditing}
                        error          = {
                          (
                            Number(setupBuffer.electrode_distance) < elektrodeDistMin
                            || Number(setupBuffer.electrode_distance) > elektrodeDistMax
                          )
                        }
                        tooltip = {(
                          <>
                            Min:
                            {' '}
                            {elektrodeDistMin.toFixed(0)}
                            {' '}
                            mm
                            <br />
                            Max:
                            {' '}
                            {elektrodeDistMax.toFixed(0)}
                            {' '}
                            mm
                          </>
                        )}
                        minEqual
                        maxEqual
                        minValue  = {elektrodeDistMin}
                        maxValue  = {elektrodeDistMax}
                        step      = {1}
                        success   = {Number(setupBuffer.electrode_distance) >= elektrodeDistMin
                            && Number(setupBuffer.electrode_distance) <= elektrodeDistMax}
                        border    = {
                            Number(setupBuffer.electrode_distance) >= elektrodeDistMin
                            && Number(setupBuffer.electrode_distance) <= elektrodeDistMax ? undefined
                              : `1px solid ${themeColors.warning.light}`
                          }
                      />
                    </Box>
                  </Box>
                  {
                    0 ? null
                      : (
                        <Box className = {classes.formItem}>
                          <Box className = {classes.formItemText6}>
                            <Text
                              text       = "* Halb-Elektrodenabs. [mm]"
                              marginLeft = {10}
                            />
                          </Box>
                          <Box className = {classes.formItemField}>
                            <NumInputField
                              value           = {cte.electrode_half_distance_mm}
                              onChange        = {(val:number) => {
                                setSetupBuffer((prev) => {
                                  const p = prev
                                  p.electrode_half_distance = val; return { ...p }
                                })
                              }}
                              fieldVariant    = "outlined"
                              disabled        = {props.permission !== 'admin'}
                              backgroundColor = {(isEditing || isCreating) && props.permission !== 'admin' ? themeColors.gray.lightest : undefined}
                              precision       = {0}
                              showSuffixIcon  = {isCreating || isEditing}
                              error           = {
                                (
                                  Number(setupBuffer.electrode_half_distance) < halfElektrodeDistMin
                                  || Number(setupBuffer.electrode_half_distance) > halfElektrodeDistMax
                                )
                              }
                              tooltip = {(
                                <>
                                  Min:
                                  {' '}
                                  {halfElektrodeDistMin.toFixed(0)}
                                  {' '}
                                  mm
                                  <br />
                                  Max:
                                  {' '}
                                  {halfElektrodeDistMax.toFixed(0)}
                                  {' '}
                                  mm
                                </>
                              )}
                              minEqual
                              maxEqual
                              minValue  = {halfElektrodeDistMin}
                              maxValue  = {halfElektrodeDistMax}
                              step      = {1}
                              success   = {Number(setupBuffer.electrode_half_distance) >= halfElektrodeDistMin
                                && Number(setupBuffer.electrode_half_distance) <= halfElektrodeDistMax}
                              border    = {
                                Number(setupBuffer.electrode_half_distance) >= halfElektrodeDistMin
                                && Number(setupBuffer.electrode_half_distance) <= halfElektrodeDistMax ? undefined
                                  : `1px solid ${themeColors.warning.light}`
                              }
                            />
                          </Box>
                        </Box>
                      )
                  }
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText6}>
                      <Text
                        text       = "* Länge Spot-Elektrode [mm]"
                        marginLeft = {10}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <NumInputField
                        value           = {cte.spot_electrode_length_mm}
                        onChange        = {(val:number) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.spot_electrode_length = val; return { ...p }
                          })
                        }}
                        fieldVariant    = "outlined"
                        disabled        = {props.permission !== 'admin'}
                        backgroundColor = {(isEditing || isCreating) && props.permission !== 'admin' ? themeColors.gray.lightest : undefined}
                        precision       = {1}
                        showSuffixIcon  = {isCreating || isEditing}
                        error           = {
                                (
                                  Number(setupBuffer.spot_electrode_length) < spotElectrodeMin
                                  || Number(setupBuffer.spot_electrode_length) > spotElectrodeMax
                                )
                              }
                        tooltip = {(
                          <>
                            Min:
                            {' '}
                            {spotElectrodeMin.toFixed(0)}
                            {' '}
                            mm
                            <br />
                            Max:
                            {' '}
                            {spotElectrodeMax.toFixed(0)}
                            {' '}
                            mm
                          </>
                              )}
                        minEqual
                        maxEqual
                        minValue  = {spotElectrodeMin}
                        maxValue  = {spotElectrodeMax}
                        step      = {0.1}
                        success   = {Number(setupBuffer.spot_electrode_length) >= spotElectrodeMin
                                && Number(setupBuffer.spot_electrode_length) <= spotElectrodeMax}
                        border    = {
                                Number(setupBuffer.spot_electrode_length) >= spotElectrodeMin
                                && Number(setupBuffer.spot_electrode_length) <= spotElectrodeMax ? undefined
                                  : `1px solid ${themeColors.warning.light}`
                              }
                      />
                    </Box>
                  </Box>
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText6}>
                      <Text
                        text       = "* Abstand Spot-Elektrode [mm]"
                        marginLeft = {10}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <NumInputField
                        value           = {cte.spot_electrode_gap_mm}
                        onChange        = {(val:number) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.spot_electrode_gap = val; return { ...p }
                          })
                        }}
                        fieldVariant    = "outlined"
                        disabled        = {props.permission !== 'admin'}
                        backgroundColor = {(isEditing || isCreating) && props.permission !== 'admin' ? themeColors.gray.lightest : undefined}
                        precision       = {1}
                        showSuffixIcon  = {isCreating || isEditing}
                        error           = {
                                (
                                  Number(setupBuffer.spot_electrode_gap) < spotElectrodeMin
                                  || Number(setupBuffer.spot_electrode_gap) > spotElectrodeMax
                                )
                              }
                        tooltip = {(
                          <>
                            Min:
                            {' '}
                            {spotElectrodeMin.toFixed(0)}
                            {' '}
                            mm
                            <br />
                            Max:
                            {' '}
                            {spotElectrodeMax.toFixed(0)}
                            {' '}
                            mm
                          </>
                              )}
                        minEqual
                        maxEqual
                        minValue  = {spotElectrodeMin}
                        maxValue  = {spotElectrodeMax}
                        step      = {0.1}
                        success   = {Number(setupBuffer.spot_electrode_gap) >= spotElectrodeMin
                                && Number(setupBuffer.spot_electrode_gap) <= spotElectrodeMax}
                        border    = {
                                Number(setupBuffer.spot_electrode_gap) >= spotElectrodeMin
                                && Number(setupBuffer.spot_electrode_gap) <= spotElectrodeMax ? undefined
                                  : `1px solid ${themeColors.warning.light}`
                              }
                      />
                    </Box>
                  </Box>
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText6}>
                      <Text
                        text       = "* Fläche Durchgangswid. Elektr. [cm²]"
                        marginLeft = {10}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <NumInputField
                        value           = {cte.t_resistance_area_cm2}
                        onChange        = {(val:number) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.t_resistance_area = val; return { ...p }
                          })
                        }}
                        fieldVariant    = "outlined"
                        disabled        = {props.permission !== 'admin'}
                        backgroundColor = {(isEditing || isCreating) && props.permission !== 'admin' ? themeColors.gray.lightest : undefined}
                        precision       = {4}
                        showSuffixIcon  = {isCreating || isEditing}
                        error           = {
                                (
                                  Number(setupBuffer.t_resistance_area) < tResElektrodeMin
                                  || Number(setupBuffer.t_resistance_area) > tResElektrodeMax
                                )
                              }
                        tooltip = {(
                          <>
                            Min:
                            {' '}
                            {tResElektrodeMin.toFixed(0)}
                            {' '}
                            mm
                            <br />
                            Max:
                            {' '}
                            {tResElektrodeMax.toFixed(0)}
                            {' '}
                            mm
                          </>
                              )}
                        minEqual
                        maxEqual
                        minValue  = {tResElektrodeMin}
                        maxValue  = {tResElektrodeMax}
                        step      = {0.0001}
                        success   = {Number(setupBuffer.t_resistance_area) >= tResElektrodeMin
                                && Number(setupBuffer.t_resistance_area) <= tResElektrodeMax}
                        border    = {
                                Number(setupBuffer.t_resistance_area) >= tResElektrodeMin
                                && Number(setupBuffer.t_resistance_area) <= tResElektrodeMax ? undefined
                                  : `1px solid ${themeColors.warning.light}`
                              }
                      />
                    </Box>
                  </Box>
                  <Box className = {classes.formItem}>
                    <Box className = {classes.formItemText6}>
                      <Text
                        text       = "* Plattenbreite [mm]"
                        marginLeft = {10}
                      />
                    </Box>
                    <Box className = {classes.formItemField}>
                      <NumInputField
                        value    = {setupBuffer.sample_width}
                        onChange = {(val:number) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.sample_width = val; return { ...p }
                          })
                        }}
                        tooltip  = {(
                          <>
                            min:
                            {' '}
                            {minSampleWidth.toFixed(0)}
                            {' '}
                            mm
                            <br />
                            max:
                            {' '}
                            {maxSampleWidth.toFixed(0)}
                            {' '}
                            mm
                          </>
                        )}
                        fieldVariant   = "outlined"
                        disabled       = {!isCreating && !isEditing}
                        precision      = {0}
                        minValue       = {minSampleWidth}
                        maxValue       = {maxSampleWidth}
                        success        = {setupBuffer.sample_width >= minSampleWidth && setupBuffer.sample_width <= maxSampleWidth}
                        border         = {setupBuffer.sample_width >= minSampleWidth && setupBuffer.sample_width <= maxSampleWidth ? undefined : `1px solid ${themeColors.warning.light}`}
                        showSuffixIcon = {isCreating || isEditing}
                      />
                    </Box>
                  </Box>

                  <Box className = {`${classes.formItem} ${classes.formItem4}`}>
                    <Box className = {classes.formItemText2}>
                      <Text
                        text = "Anzahl der Spannungsmessungen pro Probe"
                      />
                    </Box>
                    <Box className = {classes.formItemField2}>
                      <FormDropdown
                        options = {[
                          { value: '1', label: '1' },
                          { value: '3', label: '3' },
                          { value: '5', label: '5' },
                        ]}
                        selectedOption = {setupBuffer.hmc_samples !== undefined ? setupBuffer.hmc_samples.toFixed(0) : '1'}
                        onChange       = {(val:string) => {
                          setSetupBuffer((prev) => {
                            const p = prev
                            p.hmc_samples = Number(val); return { ...p }
                          })
                        }}
                        height         = {30}
                        disabled       = {!isCreating && !isEditing}
                      />
                    </Box>
                  </Box>

                  <Box className = {`${classes.formItem} ${classes.formItem2}`}>
                    <Box className = {classes.formItemField3}>
                      <SimpleCheckbox
                        checked  = {setupBuffer.thickness}
                        caption  = ""
                        onChange = {onThicknessChange}
                        disabled = {!isCreating && !isEditing}
                      />
                    </Box>
                    <Box className = {classes.formItemText3}>
                      <Text
                        text       = "Dicke messen"
                        marginLeft = {20}
                      />
                    </Box>
                  </Box>
                  {
                !setupBuffer.thickness ? null
                  : (
                    <>
                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText4}>
                          <Text
                            text = "* Max. Dicke [mm]"
                          />
                        </Box>
                        <NumInputField
                          value          = {Number(setupBuffer.max_thickness)}
                          onChange       = {(val:number) => {
                            setSetupBuffer((prev) => {
                              const p = prev
                              p.max_thickness = val; return { ...p }
                            })
                          }}
                          fieldVariant   = "outlined"
                          height         = {30}
                          disabled       = {!isCreating && !isEditing}
                          showSuffixIcon = {isCreating || isEditing}
                          error          = {
                            (
                              Number(setupBuffer.max_thickness) < minTargetThickness
                              || Number(setupBuffer.max_thickness) > maxTargetThickness
                              || Number(setupBuffer.max_thickness) <= Number(setupBuffer.target_thickness)
                            )
                            && Number(setupBuffer.max_thickness) !== 0
                          }
                          tooltip = {(
                            <>
                              Min:
                              {' '}
                              {minTargetThickness.toFixed(2)}
                              {' '}
                              mm
                              <br />
                              Max:
                              {' '}
                              {maxTargetThickness.toFixed(2)}
                              {' '}
                              mm
                              <br />
                              <br />
                              Max &gt; Soll &gt; Min
                            </>
                          )}
                          width = {150}
                          minEqual
                          maxEqual
                          minValue  = {minTargetThickness}
                          maxValue  = {maxTargetThickness}
                          precision = {3}
                          step      = {0.001}
                          success   = {Number(setupBuffer.max_thickness) >= minTargetThickness
                            && Number(setupBuffer.max_thickness) <= maxTargetThickness
                            && Number(setupBuffer.max_thickness) >= Number(setupBuffer.target_thickness)}
                          border    = {
                            Number(setupBuffer.max_thickness) >= minTargetThickness
                            && Number(setupBuffer.max_thickness) <= maxTargetThickness
                            && Number(setupBuffer.max_thickness) > Number(setupBuffer.target_thickness) ? undefined : `1px solid ${themeColors.warning.light}`
                          }
                        />
                      </Box>

                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText4}>
                          <Text
                            text = "* Soll-Dicke [mm]"
                          />
                        </Box>
                        <NumInputField
                          value          = {Number(setupBuffer.target_thickness)}
                          onChange       = {(val:number) => {
                            setSetupBuffer((prev) => {
                              const p = prev
                              p.target_thickness = val; return { ...p }
                            })
                          }}
                          fieldVariant   = "outlined"
                          height         = {30}
                          disabled       = {!isCreating && !isEditing}
                          showSuffixIcon = {isCreating || isEditing}
                          error          = {
                        (Number(setupBuffer.target_thickness) < minTargetThickness || Number(setupBuffer.target_thickness) > maxTargetThickness)
                        && Number(setupBuffer.target_thickness) !== 0
                      }
                          tooltip = {(
                            <>
                              Min:
                              {' '}
                              {minTargetThickness.toFixed(2)}
                              {' '}
                              mm
                              <br />
                              Max:
                              {' '}
                              {maxTargetThickness.toFixed(2)}
                              {' '}
                              mm
                              <br />
                              <br />
                              Max &gt; Soll &gt; Min
                            </>
                          )}
                          width = {150}
                          minEqual
                          maxEqual
                          minValue  = {minTargetThickness}
                          maxValue  = {maxTargetThickness}
                          precision = {3}
                          step      = {0.001}
                          success   = {Number(setupBuffer.target_thickness) >= minTargetThickness && Number(setupBuffer.target_thickness) <= maxTargetThickness}
                          border    = {Number(setupBuffer.target_thickness) >= minTargetThickness && Number(setupBuffer.target_thickness) <= maxTargetThickness ? undefined : `1px solid ${themeColors.warning.light}`}
                        />
                      </Box>

                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText4}>
                          <Text
                            text = "* Min. Dicke [mm]"
                          />
                        </Box>
                        <NumInputField
                          value          = {Number(setupBuffer.min_thickness)}
                          onChange       = {(val:number) => {
                            setSetupBuffer((prev) => {
                              const p = prev
                              p.min_thickness = val; return { ...p }
                            })
                          }}
                          fieldVariant   = "outlined"
                          height         = {30}
                          disabled       = {!isCreating && !isEditing}
                          showSuffixIcon = {isCreating || isEditing}
                          error          = {
                        (
                          Number(setupBuffer.min_thickness) >= Number(setupBuffer.target_thickness)
                          || Number(setupBuffer.min_thickness) < minTargetThickness
                          || Number(setupBuffer.min_thickness) > maxTargetThickness
                        ) && Number(setupBuffer.min_thickness) !== 0
                      }
                          tooltip      = {(
                            <>
                              Min:
                              {' '}
                              {minTargetThickness.toFixed(2)}
                              {' '}
                              mm
                              <br />
                              Max:
                              {' '}
                              {maxTargetThickness.toFixed(2)}
                              {' '}
                              mm
                              <br />
                              <br />
                              Max &gt; Soll &gt; Min
                            </>
                          )}
                          width = {150}
                          minEqual
                          maxEqual
                          minValue  = {minTargetThickness}
                          maxValue  = {maxTargetThickness}
                          precision = {3}
                          step      = {0.001}
                          success   = {
                            Number(setupBuffer.min_thickness) >= minTargetThickness
                            && Number(setupBuffer.min_thickness) <= maxTargetThickness
                            && Number(setupBuffer.min_thickness) < Number(setupBuffer.target_thickness)
                          }
                          border    = {
                            Number(setupBuffer.min_thickness) >= minTargetThickness
                            && Number(setupBuffer.min_thickness) <= maxTargetThickness
                            && Number(setupBuffer.min_thickness) < Number(setupBuffer.target_thickness) ? undefined : `1px solid ${themeColors.warning.light}`
                          }
                        />
                      </Box>
                    </>
                  )
              }

                  <Box className = {`${classes.formItem} ${classes.formItem3}`}>
                    <Box className = {classes.formItemField3}>
                      <SimpleCheckbox
                        checked  = {setupBuffer.through_resistance}
                        caption  = ""
                        onChange = {onTresChange}
                        disabled = {!isCreating && !isEditing}
                      />
                    </Box>
                    <Box className = {classes.formItemText3}>
                      <Text
                        text       = "Durchgangswiderstand messen"
                        marginLeft = {20}
                      />
                    </Box>
                  </Box>
                  {
                    !setupBuffer.through_resistance ? null
                      : (
                        <>
                          <Box className = {classes.formItem}>
                            <Box className = {classes.formItemText5}>
                              <Text
                                text = "* Max. Durchgangswiderstand [kΩ]"
                              />
                            </Box>
                            <NumInputField
                              value          = {Number(setupBuffer.max_tres) / 1000}
                              onChange       = {(val:number) => {
                                setSetupBuffer((prev) => {
                                  const p = prev
                                  p.max_tres = val * 1000
                                  return { ...p }
                                })
                              }}
                              fieldVariant   = "outlined"
                              height         = {30}
                              disabled       = {!isCreating && !isEditing}
                              showSuffixIcon = {isCreating || isEditing}
                              error          = {
                                (Number(setupBuffer.max_tres) < minTargetRes || Number(setupBuffer.max_tres) > maxTargetRes)
                                && Number(setupBuffer.max_tres) !== 0
                              }
                              tooltip      = {(
                                <>
                                  min:
                                  {' '}
                                  {(minTargetRes / 1000).toFixed(4)}
                                  {' '}
                                  kΩ
                                  <br />
                                  max:
                                  {' '}
                                  {(maxTargetRes / 1000).toFixed(0)}
                                  {' '}
                                  kΩ
                                  <br />
                                  <br />
                                  max grosser als min
                                </>
                              )}
                              width        = {150}
                              minEqual
                              maxEqual
                              minValue  = {minTargetRes / 1000}
                              maxValue  = {maxTargetRes / 1000}
                              precision = {4}
                              step      = {0.0001}
                              success   = {
                                Number(setupBuffer.max_tres) >= minTargetRes
                                && Number(setupBuffer.max_tres) <= maxTargetRes
                              }
                              border = {Number(setupBuffer.max_tres) >= minTargetRes && Number(setupBuffer.max_tres) <= maxTargetRes ? undefined : `1px solid ${themeColors.warning.light}`}
                            />
                          </Box>
                          <Box className = {classes.formItem}>
                            <Box className = {classes.formItemText5}>
                              <Text
                                text = "* Min. Durchgangswiderstand [kΩ]"
                              />
                            </Box>
                            <NumInputField
                              value          = {Number(setupBuffer.min_tres) / 1000}
                              onChange       = {(val:number) => {
                                setSetupBuffer((p) => {
                                  const prev = p
                                  prev.min_tres = val * 1000
                                  return { ...prev }
                                })
                              }}
                              fieldVariant   = "outlined"
                              height         = {30}
                              disabled       = {!isCreating && !isEditing}
                              showSuffixIcon = {isCreating || isEditing}
                              error          = {
                                (
                                  Number(setupBuffer.min_tres) >= Number(setupBuffer.max_tres)
                                  || Number(setupBuffer.min_tres) < minTargetRes
                                  || Number(setupBuffer.min_tres) > maxTargetRes
                                ) && Number(setupBuffer.min_tres) !== 0
                              }
                              tooltip = {(
                                <>
                                  min:
                                  {' '}
                                  {(minTargetRes / 1000).toFixed(4)}
                                  {' '}
                                  kΩ
                                  <br />
                                  max:
                                  {' '}
                                  {(maxTargetRes / 1000).toFixed(0)}
                                  {' '}
                                  kΩ
                                  <br />
                                  <br />
                                  min kleiner als max
                                </>
                              )}
                              width     = {150}
                              minEqual
                              maxEqual
                              minValue  = {minTargetRes / 1000}
                              maxValue  = {maxTargetRes / 1000}
                              precision = {4}
                              step      = {0.0001}
                              success   = {
                                Number(setupBuffer.min_tres) >= minTargetRes && Number(setupBuffer.min_tres) <= maxTargetRes
                                && Number(setupBuffer.min_tres) < Number(setupBuffer.max_tres)
                              }
                              border    = {
                                Number(setupBuffer.min_tres) >= minTargetRes && Number(setupBuffer.min_tres) <= maxTargetRes
                                && Number(setupBuffer.min_tres) < Number(setupBuffer.max_tres) ? undefined : `1px solid ${themeColors.warning.light}`
                              }
                            />
                          </Box>
                        </>
                      )
                  }

                  <Box className = {`${classes.formItem} ${classes.formItem3}`}>
                    <Box className = {classes.formItemField3}>
                      <SimpleCheckbox
                        checked  = {setupBuffer.whole_resistance}
                        caption  = ""
                        onChange = {onWresChange}
                        disabled = {!isCreating && !isEditing}
                      />
                    </Box>
                    <Box className = {classes.formItemText3}>
                      <Text
                        text       = "Gesamter Oberflächenwiderstand messen"
                        marginLeft = {20}
                      />
                    </Box>
                  </Box>
                  {
                !setupBuffer.whole_resistance ? null
                  : (
                    <>
                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText5}>
                          <Text
                            text = "* Max. gesamter Widerstand [kΩ]"
                          />
                        </Box>
                        <NumInputField
                          value          = {Number(setupBuffer.max_wres) / 1000}
                          onChange       = {(val:number) => {
                            setSetupBuffer((p) => {
                              const prev = p
                              prev.max_wres = val * 1000
                              return { ...prev }
                            })
                          }}
                          fieldVariant   = "outlined"
                          height         = {30}
                          disabled       = {!isCreating && !isEditing}
                          showSuffixIcon = {isCreating || isEditing}
                          error          = {
                            (Number(setupBuffer.max_wres) < minTargetRes || Number(setupBuffer.max_wres) > maxTargetRes)
                            && Number(setupBuffer.max_wres) !== 0
                          }
                          tooltip      = {(
                            <>
                              min:
                              {' '}
                              {(minTargetRes / 1000).toFixed(4)}
                              {' '}
                              kΩ
                              <br />
                              max:
                              {' '}
                              {(maxTargetRes / 1000).toFixed(0)}
                              {' '}
                              kΩ
                              <br />
                              <br />
                              max grosser als min
                            </>
                          )}
                          width     = {150}
                          minEqual
                          maxEqual
                          minValue  = {minTargetRes}
                          maxValue  = {maxTargetRes}
                          precision = {4}
                          step      = {0.0001}
                          success   = {
                            Number(setupBuffer.max_wres) >= minTargetRes && Number(setupBuffer.max_wres) <= maxTargetRes
                            && Number(setupBuffer.min_wres) < Number(setupBuffer.max_wres)
                          }
                          border = {Number(setupBuffer.max_wres) >= minTargetRes && Number(setupBuffer.max_wres) <= maxTargetRes ? undefined : `1px solid ${themeColors.warning.light}`}
                        />
                      </Box>
                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText5}>
                          <Text
                            text = "* Min. gesamter Widerstand [kΩ]"
                          />
                        </Box>
                        <NumInputField
                          value          = {Number(setupBuffer.min_wres) / 1000}
                          onChange       = {(val:number) => {
                            setSetupBuffer((p) => {
                              const prev = p
                              prev.min_wres = val * 1000
                              return { ...prev }
                            })
                          }}
                          fieldVariant   = "outlined"
                          height         = {30}
                          disabled       = {!isCreating && !isEditing}
                          showSuffixIcon = {isCreating || isEditing}
                          error          = {
                            (
                              Number(setupBuffer.min_wres) >= Number(setupBuffer.max_wres)
                              || Number(setupBuffer.min_wres) < minTargetRes
                              || Number(setupBuffer.min_wres) > maxTargetRes
                            ) && Number(setupBuffer.min_wres) !== 0
                          }
                          tooltip = {(
                            <>
                              min:
                              {' '}
                              {(minTargetRes / 1000).toFixed(4)}
                              {' '}
                              kΩ
                              <br />
                              max:
                              {' '}
                              {(maxTargetRes / 1000).toFixed(0)}
                              {' '}
                              kΩ
                              <br />
                              <br />
                              min kleiner als max
                            </>
                          )}
                          width     = {150}
                          minEqual
                          maxEqual
                          minValue  = {minTargetRes}
                          maxValue  = {maxTargetRes}
                          precision = {4}
                          step      = {0.0001}
                          success   = {
                            Number(setupBuffer.min_wres) >= minTargetRes && Number(setupBuffer.min_wres) <= maxTargetRes
                            && Number(setupBuffer.min_wres) < Number(setupBuffer.max_wres)
                          }
                          border    = {
                            Number(setupBuffer.min_wres) >= minTargetRes && Number(setupBuffer.min_wres) <= maxTargetRes
                            && Number(setupBuffer.min_wres) < Number(setupBuffer.max_wres) ? undefined : `1px solid ${themeColors.warning.light}`
                          }
                        />
                      </Box>
                    </>
                  )
                }

                  <Box className = {`${classes.formItem} ${classes.formItem3}`}>
                    <Box className = {classes.formItemField3}>
                      <SimpleCheckbox
                        checked  = {setupBuffer.local_resistance}
                        caption  = ""
                        onChange = {onLresChange}
                        disabled = {!isCreating && !isEditing}
                      />
                    </Box>
                    <Box className = {classes.formItemText3}>
                      <Text
                        text       = "lokaler Oberflächenwiderstand messen (12 Proben)"
                        marginLeft = {20}
                      />
                    </Box>
                  </Box>
                  {
                !setupBuffer.local_resistance ? null
                  : (
                    <>
                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText5}>
                          <Text
                            text = "* Max. lokaler Widerstand [kΩ]"
                          />
                        </Box>
                        <NumInputField
                          value          = {Number(setupBuffer.max_lres) / 1000}
                          onChange       = {(val:number) => {
                            setSetupBuffer((p) => {
                              const prev = p
                              prev.max_lres = val * 1000
                              return { ...prev }
                            })
                          }}
                          fieldVariant   = "outlined"
                          height         = {30}
                          disabled       = {!isCreating && !isEditing}
                          showSuffixIcon = {isCreating || isEditing}
                          error          = {
                            (Number(setupBuffer.max_lres) < minTargetRes || Number(setupBuffer.max_lres) > maxTargetRes)
                            && Number(setupBuffer.max_lres) !== 0
                          }
                          tooltip      = {(
                            <>
                              min:
                              {' '}
                              {(minTargetRes / 1000).toFixed(4)}
                              {' '}
                              kΩ
                              <br />
                              max:
                              {' '}
                              {(maxTargetRes / 1000).toFixed(0)}
                              {' '}
                              kΩ
                              <br />
                              <br />
                              max grosser als min
                            </>
                          )}
                          width     = {150}
                          minEqual
                          maxEqual
                          minValue  = {minTargetRes / 1000}
                          maxValue  = {maxTargetRes / 1000}
                          precision = {4}
                          step      = {0.0001}
                          success   = {
                            Number(setupBuffer.max_lres) >= minTargetRes && Number(setupBuffer.max_lres) <= maxTargetRes
                            && Number(setupBuffer.min_lres) < Number(setupBuffer.max_lres)
                          }
                          border = {Number(setupBuffer.max_lres) >= minTargetRes && Number(setupBuffer.max_lres) <= maxTargetRes ? undefined : `1px solid ${themeColors.warning.light}`}
                        />
                      </Box>
                      <Box className = {classes.formItem}>
                        <Box className = {classes.formItemText5}>
                          <Text
                            text = "* Min. lokaler Widerstand [kΩ]"
                          />
                        </Box>
                        <NumInputField
                          value          = {Number(setupBuffer.min_lres) / 1000}
                          onChange       = {(val:number) => {
                            setSetupBuffer((p) => {
                              const prev = p
                              prev.min_lres = val * 1000
                              return { ...prev }
                            })
                          }}
                          fieldVariant   = "outlined"
                          height         = {30}
                          disabled       = {!isCreating && !isEditing}
                          showSuffixIcon = {isCreating || isEditing}
                          error          = {
                            (
                              Number(setupBuffer.min_lres) >= Number(setupBuffer.max_lres)
                              || Number(setupBuffer.min_lres) < minTargetRes
                              || Number(setupBuffer.min_lres) > maxTargetRes
                            ) && Number(setupBuffer.min_lres) !== 0
                          }
                          tooltip      = {(
                            <>
                              min:
                              {' '}
                              {(minTargetRes / 1000).toFixed(4)}
                              {' '}
                              kΩ
                              <br />
                              max:
                              {' '}
                              {(maxTargetRes / 1000).toFixed(0)}
                              {' '}
                              kΩ
                              <br />
                              <br />
                              min kleiner als max
                            </>
                          )}
                          width     = {150}
                          minEqual
                          maxEqual
                          minValue  = {minTargetRes / 1000}
                          maxValue  = {maxTargetRes / 1000}
                          precision = {4}
                          step      = {0.0001}
                          success   = {
                            Number(setupBuffer.min_lres) >= minTargetRes && Number(setupBuffer.min_lres) <= maxTargetRes
                            && Number(setupBuffer.min_lres) < Number(setupBuffer.max_lres)
                          }
                          border    = {
                            Number(setupBuffer.min_lres) >= minTargetRes && Number(setupBuffer.min_lres) <= maxTargetRes
                            && Number(setupBuffer.min_lres) < Number(setupBuffer.max_lres) ? undefined : `1px solid ${themeColors.warning.light}`
                          }
                        />
                      </Box>
                    </>
                  )
              }
                  <hr style = {{ marginTop: 20 }} />
                  <Box className = {classes.formItemText3}>
                    <Text
                      text       = "* Pflichfelder"
                      marginLeft = {20}
                      marginTop  = {20}
                    />
                  </Box>
                </>
              )
              : null
          }

        </Box>

      </Box>

    </>
  )
}
