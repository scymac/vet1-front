import {
  Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'
import RobotoRegular from 'assets/theme/fonts/roboto/Roboto-Regular.ttf'
import RobotoBold from 'assets/theme/fonts/roboto/Roboto-Bold.ttf'
import { ReactElement } from 'react'

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
  container: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       '3mm',
    border:        '1px solid #666',
  },
  container2: {
    flexDirection: 'row',
    alignItems:    'center',
    border:        '1px solid #666',
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  rBorder: { borderRight: '1px solid #666'  },
  bBorder: { borderBottom: '1px solid #666'  },
  h100:    { height: '100%' },
  h15mm:   { height: '15mm' },
  div10:   { width: '10%' },
  div15:   { width: '15%' },
  div20:   { width: '20%' },
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
  material  : string,
  product   : string,
  thickness : string,
  lot       : string,
  surfResMax: string,
  surfResMin: string,
  tResMax   : string,
  tResMin   : string,
  results   : {
    sampleNo: string,
    surfaceRes: string[],
    surfaceResAvg: string,
    tRes: string,
    thickness: string
  }[]
}

function InfoTable(props:Props) {

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
        <View>
          <View style = {styles.row}>
            <View style = {styles.div40}>
              <Text style = {styles.textN10}>Min. </Text>
            </View>
            <View style = {styles.div60}>
              <Text style = {styles.textB10}>{min}</Text>
            </View>
          </View>
          <View style = {styles.row}>
            <View style = {styles.div40}>
              <Text style = {styles.textN10}>Max. </Text>
            </View>
            <View style = {styles.div60}>
              <Text style = {styles.textB10}>{max}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  const resultsHeader = () => (
    <View style = {{ ...styles.container2, ...styles.mt5 }}>
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

  const resultsTable = () => (
    <View style = {{ ...styles.container2, ...styles.bBorder }}>
      <View style = {{
        ...styles.div10, ...styles.rBorder, ...styles.h15mm, ...styles.hCenter,
      }}
      >
        <Text style = {styles.textN10}>{props.results[0].sampleNo}</Text>
      </View>
      <View style = {{
        ...styles.div60, ...styles.rBorder, ...styles.h15mm, ...styles.hCenter,
      }}
      >
        <View style = {{ ...styles.div80, ...styles.row, marginLeft: '-15mm' }}>
          <View>
            <View style = {{ ...styles.row }}>
              {resultTag(props.results[0].surfaceRes[0], '#fee')}
              {resultTag(props.results[0].surfaceRes[1], '#efe')}
              {resultTag(props.results[0].surfaceRes[2], '#eef')}
              {resultTag(props.results[0].surfaceRes[3], '#fee')}
            </View>
            <View style = {{ ...styles.row }}>
              {resultTag(props.results[0].surfaceRes[4], '#efe')}
              {resultTag(props.results[0].surfaceRes[5], '#eef')}
              {resultTag(props.results[0].surfaceRes[6], '#fee')}
              {resultTag(props.results[0].surfaceRes[7], '#efe')}
            </View>
            <View style = {{ ...styles.row }}>
              {resultTag(props.results[0].surfaceRes[8], '#eef')}
              {resultTag(props.results[0].surfaceRes[9], '#fee')}
              {resultTag(props.results[0].surfaceRes[10], '#efe')}
              {resultTag(props.results[0].surfaceRes[11], '#eef')}
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
              <Text style = {styles.textN10}>
                {props.results[0].surfaceResAvg}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style = {{
        ...styles.div15, ...styles.rBorder, ...styles.h15mm, ...styles.hCenter,
      }}
      >
        <Text style = {styles.textN10}>{props.results[0].tRes}</Text>
      </View>
      <View style = {{ ...styles.div15, ...styles.h15mm, ...styles.hCenter }}>
        <Text style = {styles.textN10}>{props.results[0].thickness}</Text>
      </View>
    </View>
  )

  return (
    <>
      <View style = {styles.container}>

        <View style = {styles.div50}>

          {getRow('Material', props.material)}
          {getRow('Artikelnummer', props.product)}
          {getRow('Plattendicke [mm]', props.thickness)}
          {getRow('Charge', props.lot)}

        </View>

        <View style = {styles.div50}>

          {getRow2(<>Oberflächenwiderstand [k&#x2126;]</>, props.surfResMax, props.surfResMin)}
          {getRow2(<>Durchgangswiderstand [k&#x2126;]</>, props.tResMax, props.tResMin)}

        </View>

      </View>

      {resultsHeader()}

      {resultsTable()}

    </>
  )
}

export default InfoTable
