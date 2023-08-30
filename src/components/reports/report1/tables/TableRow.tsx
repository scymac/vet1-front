import {
  Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'

Font.register({
  family: 'Roboto',
  src:    'assets/theme/fonts/roboto/Roboto-Regular.ttf',
})

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  description: {
    width: '60%',
  },
  xyz: {
    width: '40%',
  },
})

type Props = {
  items:any[]
}

function TableRow(props:Props) {
  const rows = props.items.map((item, i) => (
    <Text key = {item + i} style = {styles.description}>{item}</Text>
  ))

  return (
    <View style = {styles.row}>
      {rows}
    </View>
  )
}

export default TableRow
