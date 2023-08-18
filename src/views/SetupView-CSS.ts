import themeColors from 'assets/theme/colors'

const componentStyles = () => ({
  main: {
    width: '100%',
  },
  formBox: {
    display:   'block',
    width:     600,
    overflowY: 'auto' as 'auto',
    position:  'absolute' as 'absolute',
    top:       50,
    left:      300,
    padding:   10,
  },
  listBox: {
    width:     250,
    overflowY: 'auto' as 'auto',
    position:  'absolute' as 'absolute',
    top:       50,
    left:      20,
    border:    '1px solid #eee',
  },
  formItem: {
    display:    'flex',
    alignItems: 'center',
  },
  formItem2: {
    marginLeft: 50,
    marginTop:  20,
  },
  formItem3: {
    marginLeft: 50,
    marginTop:  10,
  },
  formItem4: {
    marginLeft: 20,
  },
  formItemText: {
    width: '32%',
  },
  formItemField: {
    width: '63%',
  },
  formItemText2: {
    width: '55%',
  },
  formItemField2: {
    width: '25%',
  },
  formItemText3: {
    width: '90%',
  },
  formItemText4: {
    width:       180,
    marginLeft:  80,
    marginRight: 20,
  },
  formItemText5: {
    width:       480,
    marginLeft:  80,
    marginRight: 20,
  },
  formItemField3: {
    width: 12,
  },
  buttonBox: {
    display:  'flex',
    position: 'absolute' as 'absolute',
    top:      20,
    left:     20,
    color:    themeColors.gray.mid,
  },
  buttonBox2: {
    display:  'flex',
    position: 'absolute' as 'absolute',
    top:      20,
    left:     300,
    color:    themeColors.gray.mid,
  },
  labelBox: {
    display:        'flex',
    position:       'absolute' as 'absolute',
    justifyContent: 'right',
    width:          100,
    top:            20,
    left:           815,
    color:          themeColors.gray.mid,
  },
})

export default componentStyles
