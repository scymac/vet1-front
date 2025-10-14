import themeColors from 'assets/theme/colors'
import { noSelect } from 'assets/theme/noSelect'

const classes = {
  orderButtonBox: {
    display: 'flex',
    position: 'absolute' as 'absolute',
    top: '20px',
    left: '20px',
    height: 30
  },
  orderBox: {
    position: 'absolute' as 'absolute',
    top: '50px',
    left: '20px',
    height: 40,
    border: '1px solid #eee',
    display: 'flex',
    alignItems: 'center'
  },
  tableBox: {
    position: 'absolute' as 'absolute',
    top: '110px',
    left: '20px',
    width: '100%',

    // background: "#faf"
    border: '1px solid #eee'
  },
  formItemText: {
    marginLeft: '20px'
  },
  formItemLabel1: {
    marginLeft: '10px'
  },

  menuButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '3px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: 13,
    fontWeight: 600,
    height: 25,
    cursor: 'pointer'
  },
  menuButtonSelected: {
    background: themeColors.success.lighter
  },
  menuButtonUnselected: {
    '&:hover': {
      background: themeColors.gray.lightest
    }
  },
  noSelect
}

export default classes
