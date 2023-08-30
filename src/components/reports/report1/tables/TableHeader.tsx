import { Text, View, StyleSheet } from '@react-pdf/renderer'

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
