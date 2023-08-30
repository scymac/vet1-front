import {
  Page, View, Text, Image, Document, StyleSheet,

} from '@react-pdf/renderer'
import Logo from 'assets/logo/vonroll_logo.png'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TableRow from './tables/TableRow'
import InfoTable from './tables/InfoTable'

const styles = StyleSheet.create({
  body: {
    paddingVertical:   '25mm',
    paddingHorizontal: '20mm',
  },
  headerView: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    width:          '100%',
  },
  title1: {
    fontSize:   18,
    fontWeight: 'bold',
  },
  title2: {
    marginTop:  '5px',
    fontSize:   14,
    fontWeight: 'bold',
  },
  text: {

    // margin:    12,
    fontSize:  14,
    textAlign: 'justify',

  },
  image: {
    width:  '35mm',
    height: '7.5mm',
  },
  header: {
    fontSize: 12,

    // marginBottom: 20,
    textAlign: 'center',
    color:     'grey',

  },
  pageNumber: {
    position:  'absolute',
    fontSize:  12,
    bottom:    '10mm',
    left:      0,
    right:     0,
    textAlign: 'center',
    color:     'grey',
  },

  tableContainer: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    marginTop:     '10mm',
  },
})

type Props = {variant: 'document'|'snapshot'}

function Report1(props:Props) {

  const pdfDocument = (
    <Document>

      <Page
        key = {1}
        size = "A4"
        style = {styles.body}
      >
        <View style = {styles.headerView}>
          <View>
            <Text style = {styles.title1}>Widerstandsmessung</Text>
            <Text style = {styles.title2}>Messbericht</Text>
          </View>
          <Image style = {styles.image} src = {Logo} />
        </View>
        <View style = {styles.tableContainer}>
          <InfoTable
            material = "Vetronit"
            product = "432.10-01"
            thickness = "0.20"
            lot = "1234567"
            surfResMin = "1.5"
            surfResMax = "20.0"
            tResMin = "0.0057"
            tResMax = ".057"
          />
        </View>
        <Text
          style = {styles.pageNumber}
          render = {({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>

    </Document>
  )

  const pdfSnap = (
    <Box
      style = {{
        border:        '1px solid #666',
        marginTop:     '1rem',
        marginBottom:  '1rem',
        overflow:      'auto',
        paddingBottom: '30mm',
        paddingTop:    '30mm',
        paddingLeft:   '20mm',
        paddingRight:  '20mm',
        width:         '210mm',
        height:        '297mm',
      }}
    >

      <Box
        style = {{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
        }}
      >
        <Typography
          style = {{
            fontSize:   20,
            fontWeight: 800,
          }}
        >
          Widerstandsmessung
          <br />
          Messbericht
        </Typography>
        <img
          src = {Logo}
          alt = "logo"
          width = {200}
        />
      </Box>

      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
      <Box style = {{ marginTop: '50mm' }}>asdfasdfasdfasdf</Box>
    </Box>
  )

  return props.variant === 'document' ? pdfDocument : pdfSnap
}

export default Report1
