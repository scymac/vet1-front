const classes = {
  mainBox: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    width: '100%'
  },
  icon: {
    transform: 'scale(0.8)'
  },
  arrowButton: {
    background: '#ddd',
    display: 'flex',
    justifyContent: 'center',
    margin: 1,
    marginLeft: 2,
    cursor: 'pointer',
    height: 9,
    width: 15,
    fontSize: 7,
    WebkitTouchCallout: 'none' as const, // iOS Safari
    WebkitUserSelect: 'none' as const, // Safari
    KhtmlUserSelect: 'none' as const, // Konqueror HTML
    MozUserSelect: 'none' as const, // Old versions of Firefox
    MsUserSelect: 'none' as const, // Internet Explorer/Edge
    userSelect: 'none' as const, // Non-prefixed version, currently supported by Chrome, Opera and Firefox

    '&:hover': {
      background: '#ccc'
    },
    '&:active': {
      background: '#ccc',
      transform: 'translate(1px, 0px)'
    }
  },
  iconRotated90: {
    transform: 'scale(0.8) rotate(90deg)'
  },
  iconRotated180: {
    transform: 'scale(0.8) rotate(180deg)'
  },
  slider: {
    marginLeft: '5px',
    marginRight: '0px'
  }
}

export default classes
