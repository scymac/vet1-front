import {
  View, Text, Image, Document, StyleSheet, Font, Page,
} from '@react-pdf/renderer'
import RobotoRegular from 'assets/theme/fonts/roboto/Roboto-Regular.ttf'
import RobotoBold from 'assets/theme/fonts/roboto/Roboto-Bold.ttf'
import { ReactElement } from 'react'
import Logo from 'assets/logo/vonroll_logo.png'
import { roundDown, roundUp } from 'assets/functions/Calculations'
import themeColors from 'assets/theme/colors'

// import { Page } from 'react-pdf'

// import { Page } from 'react-pdf'

Font.register({
  family: 'Roboto',
  fonts:  [
    {
      src:    RobotoRegular,
      format: 'truetype',
    },
    {
      src:        RobotoBold,
      format:     'truetype',
      fontWeight: 'bold',
    },
  ],
})

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
    fontSize:  10,
    bottom:    '10mm',
    left:      0,
    right:     0,
    textAlign: 'center',
    color:     'grey',
  },

  footer: {
    position:  'absolute',
    bottom:    '20mm',
    left:      '20mm',
    right:     '20mm',
    textAlign: 'center',
    color:     'grey',
  },

  tableContainer: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    marginTop:     '10mm',
  },

  container: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       '3mm',
    border:        '1px solid #ccc',
    marginTop:     '10mm',
  },
  container2: {
    flexDirection: 'row',
    alignItems:    'center',
    border:        '1px solid #ccc',
  },
  container3: {
    flexDirection: 'row',
    alignItems:    'center',
    borderLeft:    '1px solid #ccc',
    borderRight:   '1px solid #ccc',
    borderBottom:  '1px solid #ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  rBorder: { borderRight: '1px solid #ccc'  },
  bBorder: { borderBottom: '1px solid #ccc'  },
  h100:    { height: '100%' },
  h15mm:   { height: '15mm' },
  div10:   { width: '10%' },
  div15:   { width: '15%' },
  div20:   { width: '20%' },
  div25:   { width: '25%' },
  div40:   { width: '40%' },
  div50:   { width: '50%' },
  div60:   { width: '60%' },
  div80:   { width: '80%' },
  div100:  { width: '100%' },
  hCenter: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
  },
  textN10: {
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize:   10,
  },
  textB10: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize:   10,
  },
  mt2: {
    marginTop: '2mm',
  },
  mt5: {
    marginTop: '5mm',
  },
})

type Props = {
  responsible : string,
  material    : string,
  product     : string,
  maxThickness: string,
  thickness   : string,
  minThickness: string,
  lot         : string,
  surfResMax  : string,
  surfResMin  : string,
  tResMax     : string,
  tResMin     : string,
  results     : {
    sampleNo     : string,
    surfaceRes   : string[],
    surfaceResAvg: string,
    tRes         : string,
    thickness    : string
  }[]
}

function PdfDocument1(props:Props) {

  const validateValue = (validation: 'thickness'|'t_res'|'l_res'|'avg', value: string) => {
    switch (validation) {
      case 'thickness': return (
        <Text style = {{
          ...styles.textN10,
          color:      Number(value) > Number(props.maxThickness) || Number(value) < Number(props.minThickness) ? themeColors.error.main : undefined,
          fontWeight: Number(value) > Number(props.maxThickness) || Number(value) < Number(props.minThickness) ? 'bold' : undefined,
        }}
        >
          {value}
        </Text>
      )
      case 't_res': return (
        <Text style = {{
          ...styles.textN10,
          color:      Number(value) > Number(props.tResMax) || Number(value) < Number(props.tResMin) ? themeColors.error.main : undefined,
          fontWeight: Number(value) > Number(props.tResMax) || Number(value) < Number(props.tResMin) ? 'bold' : undefined,
        }}
        >
          {value}
        </Text>
      )
      case 'avg': return (
        <Text style = {{
          ...styles.textN10,
          color:      Number(value) > Number(props.surfResMax) || Number(value) < Number(props.surfResMin) ? themeColors.error.main : undefined,
          fontWeight: Number(value) > Number(props.surfResMax) || Number(value) < Number(props.surfResMin) ? 'bold' : undefined,
        }}
        >
          {value}
        </Text>
      )
      case 'l_res': return (
        <View style = {{
          width:           '25%',
          marginRight:     '10mm',
          backgroundColor: undefined,
        }}
        >
          <Text style = {{
            ...styles.textN10,
            textAlign:  'right',
            color:      Number(value) > Number(props.surfResMax) || Number(value) < Number(props.surfResMin) ? themeColors.error.main : undefined,
            fontWeight: Number(value) > Number(props.surfResMax) || Number(value) < Number(props.surfResMin) ? 'bold' : undefined,
          }}
          >
            {value}
          </Text>
        </View>
      )
    }
  }

  const getRow = (title: string, value: string) => (
    <View style = {{ ...styles.row, ...styles.mt2 }}>
      <View style = {styles.div40}>
        <Text style = {styles.textN10}>{title}</Text>
      </View>
      <View style = {styles.div60}>
        <Text style = {styles.textB10}>{value}</Text>
      </View>
    </View>
  )

  const getRow2 = (title: ReactElement, max: string, min: string) => (
    <View style = {{ ...styles.row, ...styles.mt2 }}>
      <View style = {styles.div60}>
        <Text style = {styles.textN10}>{title}</Text>
      </View>
      <View style = {styles.div40}>
        <View style = {styles.row}>
          <View style = {styles.div50}>
            <Text style = {styles.textN10}>{min}</Text>
          </View>
          <View style = {styles.div50}>
            <Text style = {styles.textN10}>{max}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  const resultsHeader = (
    <View style = {{ ...styles.container2, ...styles.mt5, backgroundColor: '#f5f5f5' }}>
      <View style = {{
        ...styles.div10, ...styles.rBorder, ...styles.hCenter, ...styles.h100,
      }}
      >
        <Text style = {{ ...styles.textB10, ...styles.hCenter }}>Platte Nummer</Text>
      </View>
      <View style = {{
        ...styles.div60, ...styles.rBorder, ...styles.hCenter, ...styles.h100,
      }}
      >
        <Text style = {styles.textB10}>Oberflächenwiderstand [k&#x2126;]</Text>
      </View>
      <View style = {{
        ...styles.div15, ...styles.rBorder, ...styles.hCenter, ...styles.h100,
      }}
      >
        <Text style = {styles.textB10}>Durchgangswiderstand [k&#x2126;]</Text>
      </View>
      <View style = {{ ...styles.div15, ...styles.hCenter }}>
        <Text style = {styles.textB10}>Dicke [mm]</Text>
      </View>
    </View>
  )

  const resultTag = (caption: string, color: string) => (
    <View style = {{ width: '25%', marginRight: '10mm', backgroundColor: undefined  }}>
      <Text style = {{ ...styles.textN10, textAlign: 'right' }}>{caption}</Text>
    </View>
  )

  const resultsTable = (from:number, to:number) => (
    props.results.map((m, i) => (
      i >= from - 1 && i <= to - 1
        ? (

          <View style = {{ ...styles.container3, ...styles.bBorder }}>
            <View style = {{
              ...styles.div10, ...styles.rBorder, ...styles.h15mm, ...styles.hCenter,
            }}
            >
              <Text style = {styles.textN10}>{props.results[i].sampleNo}</Text>
            </View>
            <View style = {{
              ...styles.div60, ...styles.rBorder, ...styles.h15mm, ...styles.hCenter,
            }}
            >
              <View style = {{ ...styles.div80, ...styles.row, marginLeft: '-15mm' }}>
                <View>
                  <View style = {{ ...styles.row }}>
                    {validateValue('l_res', props.results[i].surfaceRes[0])}
                    {validateValue('l_res', props.results[i].surfaceRes[1])}
                    {validateValue('l_res', props.results[i].surfaceRes[2])}
                    {validateValue('l_res', props.results[i].surfaceRes[3])}
                  </View>
                  <View style = {{ ...styles.row }}>
                    {validateValue('l_res', props.results[i].surfaceRes[4])}
                    {validateValue('l_res', props.results[i].surfaceRes[5])}
                    {validateValue('l_res', props.results[i].surfaceRes[6])}
                    {validateValue('l_res', props.results[i].surfaceRes[7])}
                  </View>
                  <View style = {{ ...styles.row }}>
                    {validateValue('l_res', props.results[i].surfaceRes[8])}
                    {validateValue('l_res', props.results[i].surfaceRes[9])}
                    {validateValue('l_res', props.results[i].surfaceRes[10])}
                    {validateValue('l_res', props.results[i].surfaceRes[11])}
                  </View>
                </View>
                <View style = {{
                  ...styles.row, marginRight: '-15mm', marginLeft: '10mm', width: '35mm',
                }}
                >
                  <View>
                    <Text style = {styles.textN10}>
                      Mtlw.
                    </Text>
                    {validateValue('avg', props.results[i].surfaceResAvg)}
                  </View>
                </View>
              </View>
            </View>
            <View style = {{
              ...styles.div15, ...styles.rBorder, ...styles.h15mm, ...styles.hCenter,
            }}
            >
              {validateValue('t_res', props.results[i].tRes)}
            </View>
            <View style = {{ ...styles.div15, ...styles.h15mm, ...styles.hCenter }}>
              {validateValue('thickness', props.results[i].thickness)}
            </View>
          </View>
        )
        : null
    ))

  )

  const pdfPage = (content: ReactElement) => (
    <Page
      key = {1}
      size = "A4"
      style = {styles.body}
    >
      {content}
    </Page>
  )
  const pdfHeader = (
    <View style = {styles.headerView}>
      <View>
        <Text style = {styles.title1}>Widerstandsmessung</Text>
        <Text style = {styles.title2}>Messbericht</Text>
      </View>
      <Image style = {styles.image} src = {Logo} />
    </View>
  )
  const pdfInfo = (
    <View style = {styles.container}>

      <View style = {styles.div50}>

        {getRow('Material', props.material)}
        {getRow('Artikelnummer', props.product)}
        {getRow('Plattendicke [mm]', props.thickness)}
        {getRow('Charge', props.lot)}

      </View>

      <View style = {styles.div50}>

        {getRow2(<div />, 'Max.', 'Min.')}
        {getRow2(<>Plattendicke [mm]</>, props.maxThickness, props.minThickness)}
        {getRow2(<>Oberflächenwiderstand [k&#x2126;]</>, props.surfResMax, props.surfResMin)}
        {getRow2(<>Durchgangswiderstand [k&#x2126;]</>, props.tResMax, props.tResMin)}

      </View>

    </View>
  )

  const getExtraPages = () => {
    const len = props.results.length
    const firstSample = 10 // page 1 last serial ndx
    const nrPerPage = 12
    const pageNr = roundUp(len / nrPerPage, 0)
    const pageArray:ReactElement[] = []
    for (let i = 0; i < pageNr; i += 1) {
      pageArray.push(results(firstSample + (i * nrPerPage) + 1, firstSample + (i * nrPerPage) + nrPerPage))
    }
    return pageArray.map((resultPart, ii) => (
      pdfPage(
        <>
          {pdfHeader}
          {resultPart}
          {ii === pageNr - 1 ? footer : null}
          {pagination}
        </>,
      )
    ))
  }

  const results = (from:number, to:number) => (
    <>
      {resultsHeader}
      {resultsTable(from, to)}
    </>
  )

  const pagination = (
    <Text
      style = {styles.pageNumber}
      render = {({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
    />
  )

  const today = () => {
    const now = new Date()
    return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`
  }
  const footer = (
    <View style = {{
      ...styles.footer,
      ...styles.container2,
      ...styles.mt5,
      paddingHorizontal: '2mm',
      paddingVertical:   '3mm',
    }}
    >
      <View style = {{ ...styles.row, ...styles.div25 }}>
        <Text style = {styles.textN10}>Datum: </Text>
        <Text style = {styles.textB10}>{today()}</Text>
      </View>
      <View style = {{ ...styles.row, ...styles.div50 }}>
        <Text style = {styles.textN10}>Kontrolleur: </Text>
        <Text style = {styles.textB10}>{props.responsible}</Text>
      </View>
      <View>
        <Text style = {styles.textN10}>Visum: </Text>
      </View>
    </View>
  )

  return (
    <Document>
      {pdfPage(
        <>
          {pdfHeader}
          {pdfInfo}
          {results(1, 10)}
          {props.results.length <= 10 ? footer : null}
          {pagination}
        </>,
      )}
      {props.results.length > 10 ? getExtraPages() : null}
    </Document>
  )
}

export default PdfDocument1
