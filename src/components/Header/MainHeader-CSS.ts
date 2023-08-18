import themeColors from 'assets/theme/colors'

const componentStyles = () => ({
  mainBox: {
    display:        'flex',
    position:       'absolute' as 'absolute',
    justifyContent: 'space-between',
    alignItems:     'center',
    color:          themeColors.gray.dark,
    background:     themeColors.gray.lighter,
  },
  titleBox: {
    display:    'flex',
    alignItems: 'center',
    width:      200,
  },
  iconBox: {
    display: 'flex',
  },
  ackBox: {
    marginRight: 35,
  },
  front: {
    color: themeColors.success.darker,
  },
  server: {
    marginLeft: 10,
  },
  plc: {
    marginLeft: 10,
  },
  plc2: {
    marginLeft: 10,
    rotate:     '90deg',
  },
})

export default componentStyles
