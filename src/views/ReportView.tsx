// Functions
import { makeStyles } from '@mui/styles'
import { Button } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { PDFDownloadLink } from '@react-pdf/renderer'

// Components
import Report1 from 'components/reports/report1/Report1'

// Styles
import componentStyles from './ReportView-CSS'

const useStyles:any = makeStyles(componentStyles)

type Props = {}

export default function MeasurementView(props:Props) {

  const classes = useStyles()

  return (
    <div
      style = {{
        margin: '1rem',
      }}
    >
      <PDFDownloadLink document = {<Report1 variant = "document" />} fileName = "MyReport">
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

      <Report1 variant = "snapshot" />

    </div>
  )
}
