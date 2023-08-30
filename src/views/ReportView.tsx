// Functions
import { makeStyles } from '@mui/styles'
import { Button } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { PDFDownloadLink } from '@react-pdf/renderer'

// Components
import Report1 from 'components/reports/report1/Report1'

// Styles
import { Measurement, Order, Setup } from 'api/Interfaces'
import componentStyles from './ReportView-CSS'

const useStyles:any = makeStyles(componentStyles)

type Props = {
  measList: Measurement[],
  order: Order,
  setup: Setup
}

export default function ReportView(props:Props) {

  const classes = useStyles()

  return (
    <div
      style = {{
        margin: '1rem',
      }}
    >
      <PDFDownloadLink
        document = {(
          <Report1
            measList = {props.measList}
            order    = {props.order}
            variant  = "document"
            setup    = {props.setup}
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
                disabled  = {false} // if there is at lease 1 measurement
                size      = "small"
                startIcon = {<FileDownloadIcon />}
              >
                Download
              </Button>
            )
        )}
      </PDFDownloadLink>

      <Report1
        variant  = "snapshot"
        measList = {props.measList}
        order    = {props.order}
        setup    = {props.setup}
      />

    </div>
  )
}
