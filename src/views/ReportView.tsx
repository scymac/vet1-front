// Functions
import { useState, useMemo } from 'react'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'

// MUI
import { makeStyles } from '@mui/styles'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

// Components
import Report1 from 'components/reports/report1/Report1'

// Styles
import { Measurement, Order, Setup } from 'api/Interfaces'
import TextInputField from 'components/Tools/Inputs/TextInputField'
import Report2 from 'components/reports/report2/Report2'
import componentStyles from './ReportView-CSS'

const useStyles:any = makeStyles(componentStyles)

type Props = {
  measList: Measurement[],
  order: Order,
  setup: Setup
}

export default function ReportView(props:Props) {

  const classes = useStyles()

  const [measList, setMeasList] = useState(props.measList)
  const [order, setOrder] = useState(props.order)
  const [setup, setSetup] = useState(props.setup)

  const [responsible, setResponsible] = useState('')

  useMemo(() => {
    setMeasList(props.measList)
    setOrder(props.order)
    setSetup(props.setup)
  }, [props.measList, props.order, props.setup])

  const generatePdfDocument = async (fileName:any) => {
    const blob = await pdf((
      getReport('document')
    )).toBlob()
    saveAs(blob, fileName)
  }

  const getReport = (variant: 'document'|'snapshot') => {
    if (setup.local_resistance) {
      return (
        <Report1
          responsible = {responsible}
          measList    = {measList}
          order       = {order}
          setup       = {setup}
          variant     = {variant}
        />
      )
    }
    return (
      <Report2
        responsible = {responsible}
        measList    = {measList}
        order       = {order}
        setup       = {setup}
        variant     = {variant}
      />
    )
  }

  return (
    <div
      style = {{
        margin: '1rem',
      }}
    >
      <Box
        style = {{
          display:    'flex',
          alignItems: 'center',
        }}
      >
        <Button
          variant   = "contained"
          color     = "primary"
          size      = "small"
          startIcon = {<FileDownloadIcon />}
          style = {{
            paddingLeft:  '25px',
            paddingRight: '25px',
          }}
          onClick = {() => generatePdfDocument(`Messbericht_${props.order.order_no}`)}
        >
          Herunterladen
        </Button>

        <Typography style = {{
          marginLeft:  '50px',
          marginRight: '10px',
        }}
        >
          Kontrolleur
        </Typography>
        <TextInputField
          value = {responsible}
          fieldVariant = "outlined"
          width = {300}
          onChange = {(val:string) => setResponsible(val)}
        />
      </Box>

      {getReport('snapshot')}

    </div>
  )
}

/*

<PDFDownloadLink
  document = {(
    <Report1
      measList = {measList}
      order    = {order}
      setup    = {setup}
      variant  = "document"
    />
  )}
  fileName = "MyReport"
>
  {({ loading }) => (
    loading
      ? (
        <Button
          variant   = "contained"
          color     = "primary"
          disabled
          size      = "small"
          startIcon = {<FileDownloadIcon />}
        >
          Loading Document...
        </Button>
      )
      : (
        <Button
          variant   = "contained"
          color     = "primary"
          disabled  = {measList.length === 0}
          size      = "small"
          startIcon = {<FileDownloadIcon />}
        >
          Download
        </Button>
      )
  )}
</PDFDownloadLink>

{
          measList.length === 0
            ? (
              <Button
                variant   = "contained"
                color     = "primary"
                disabled
                size      = "small"
                startIcon = {<FileDownloadIcon />}
                style = {{
                  paddingLeft:  '15px',
                  paddingRight: '15px',
                }}
              >
                Download
              </Button>
            )
            : (
              <PDFDownloadLink
                document = {(
                  getReport('document')
                )}
                fileName = "MyReport"
              >
                {({ loading }) => (
                  loading
                    ? (
                      <Button
                        variant   = "contained"
                        color     = "primary"
                        size      = "small"
                        disabled
                        startIcon = {<FileDownloadIcon />}
                        style = {{
                          paddingLeft:  '15px',
                          paddingRight: '15px',
                        }}
                      >
                        Download
                      </Button>
                    )
                    : (
                      <Button
                        variant   = "contained"
                        color     = "primary"
                        size      = "small"
                        startIcon = {<FileDownloadIcon />}
                        style = {{
                          paddingLeft:  '15px',
                          paddingRight: '15px',
                        }}
                      >
                        Download
                      </Button>
                    )
                )}
              </PDFDownloadLink>

            )
          }

*/
