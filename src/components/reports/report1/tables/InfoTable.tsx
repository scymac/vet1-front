import { Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  border: {
    border:  '1px solid #666',
    padding: '3mm',
  },
  div: {
    width: '50%',
  },
  subRow1: {
    width: '40%',
  },
  subRow2: {
    width: '60%',
  },
  text1: {
    fontWeight: 'normal',
    fontSize:   10,
  },
  text2: {
    fontWeight: 'bold',
    fontSize:   10,
  },
  mt: {
    marginTop: '2mm',
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
}

function InfoTable(props:Props) {

  const getRow = (title: string, value: string) => (
    <View style = {{ ...styles.row, ...styles.mt }}>
      <View style = {styles.subRow1}>
        <Text style = {styles.text1}>{title}</Text>
      </View>
      <View style = {styles.subRow2}>
        <Text style = {styles.text2}>{value}</Text>
      </View>
    </View>
  )

  const getRow2 = (title: string, max: string, min: string) => (
    <View style = {{ ...styles.row, ...styles.mt }}>
      <View style = {styles.subRow2}>
        <Text style = {styles.text1}>{title}</Text>
      </View>
      <View style = {styles.subRow1}>
        <View>
          <View style = {styles.row}>
            <View style = {styles.subRow1}>
              <Text style = {styles.text2}>Min.</Text>
            </View>
            <View style = {styles.subRow1}>
              <Text style = {styles.text2}>{min}</Text>
            </View>
          </View>
          <View style = {styles.row}>
            <View style = {styles.subRow1}>
              <Text style = {styles.text2}>Max.</Text>
            </View>
            <View style = {styles.subRow1}>
              <Text style = {styles.text2}>{max}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <View style = {{ ...styles.row, ...styles.border }}>

      <View style = {styles.div}>

        {getRow('Material', props.material)}
        {getRow('Artikelnummer', props.product)}
        {getRow('Plattendicke [mm]', props.thickness)}
        {getRow('Charge', props.lot)}

      </View>

      <View style = {styles.div}>

        {getRow2('Oberflächenwiderstand [kΩ]', props.surfResMax, props.surfResMin)}
        {getRow2('Durchgangswiderstand [kΩ]', props.tResMax, props.tResMin)}

      </View>

    </View>
  )
}

export default InfoTable
