import themeColors from 'assets/theme/colors'
import { noSelect } from 'assets/theme/noSelect'

const componentStyles = () => ({

  orderButtonBox: {
    display:  'flex',
    position: 'absolute' as 'absolute',
    top:      20,
    left:     20,
    height:   30,
  },
  orderBox: {
    position:   'absolute' as 'absolute',
    top:        50,
    left:       20,
    height:     40,
    border:     '1px solid #eee',
    display:    'flex',
    alignItems: 'center',
  },
  tableBox: {
    position: 'absolute' as 'absolute',
    top:      110,
    left:     20,
    width:    '100%',

    // background: "#faf"
    border: '1px solid #eee',
  },
  formItemText: {
    marginLeft: 20,
  },
  formItemLabel1: {
    marginLeft: 10,
  },

  menuButton: {
    display:        'flex',
    justifyContent: 'center',
    alignItems:     'center',
    border:         '1px solid #ddd',
    borderRadius:   '3px',
    paddingLeft:    '10px',
    paddingRight:   '10px',
    fontSize:       13,
    fontWeight:     600,
    marginLeft:     '3px',
    height:         25,
  },
  menuButtonSelected: {
    background: themeColors.success.lighter,
  },
  menuButtonUnselected: {
    cursor:    'pointer',
    '&:hover': {
      background: themeColors.gray.lightest,
    },
  },
  noSelect,
})

export default componentStyles
