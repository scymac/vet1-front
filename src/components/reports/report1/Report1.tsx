import {
  Page, View, Text, Image, Document, StyleSheet,

} from '@react-pdf/renderer'
import Logo from 'assets/logo/vonroll_logo.png'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Measurement, Order, Setup } from 'api/Interfaces'
import { avg } from 'assets/functions/Calculations'
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

type Props = {
  variant : 'document'|'snapshot',
  measList: Measurement[],
  order   : Order,
  setup   : Setup
}

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
            material   = {props.setup.material}
            product    = {props.order.product_no}
            thickness  = {((Number(props.setup.max_thickness) + Number(props.setup.min_thickness)) / 2).toFixed(2)}
            lot        = {props.order.order_no}
            surfResMin = {(Number(props.setup.min_lres) / 1000).toFixed(4)}
            surfResMax = {(Number(props.setup.max_lres) / 1000).toFixed(4)}
            tResMin    = {(Number(props.setup.min_tres) / 1000).toFixed(4)}
            tResMax    = {(Number(props.setup.max_lres) / 1000).toFixed(4)}
            results    = {
              props.measList.map((m) => ({
                sampleNo:   m.sample_no.toFixed(0),
                surfaceRes: [
                  (Number(m.l_res1.resistance) / 1000).toFixed(3),
                  (Number(m.l_res2.resistance) / 1000).toFixed(3),
                  (Number(m.l_res3.resistance) / 1000).toFixed(3),
                  (Number(m.l_res4.resistance) / 1000).toFixed(3),
                  (Number(m.l_res5.resistance) / 1000).toFixed(3),
                  (Number(m.l_res6.resistance) / 1000).toFixed(3),
                  (Number(m.l_res7.resistance) / 1000).toFixed(3),
                  (Number(m.l_res8.resistance) / 1000).toFixed(3),
                  (Number(m.l_res9.resistance) / 1000).toFixed(3),
                  (Number(m.l_res10.resistance) / 1000).toFixed(3),
                  (Number(m.l_res11.resistance) / 1000).toFixed(3),
                  (Number(m.l_res12.resistance) / 1000).toFixed(3),
                ],
                surfaceResAvg: avg([
                  (Number(m.l_res1.resistance) / 1000),
                  (Number(m.l_res2.resistance) / 1000),
                  (Number(m.l_res3.resistance) / 1000),
                  (Number(m.l_res4.resistance) / 1000),
                  (Number(m.l_res5.resistance) / 1000),
                  (Number(m.l_res6.resistance) / 1000),
                  (Number(m.l_res7.resistance) / 1000),
                  (Number(m.l_res8.resistance) / 1000),
                  (Number(m.l_res9.resistance) / 1000),
                  (Number(m.l_res10.resistance) / 1000),
                  (Number(m.l_res11.resistance) / 1000),
                  (Number(m.l_res12.resistance) / 1000),
                ]).toFixed(3),
                tRes:      (Number(m.t_res.resistance) / 1000).toFixed(3),
                thickness: Number(m.thickness).toFixed(3),
              }))
            }
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
