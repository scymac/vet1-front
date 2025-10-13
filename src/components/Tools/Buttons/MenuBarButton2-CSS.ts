const componentStyles = () => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    marginLeft: 1000,
    marginRight: 0,
    height: 60,
    color: '#555',
    background: '#eee',
    fontWeight: 600,
    cursor: 'pointer',
    '&:active': {
      color: '#ffffffaa'
    },
    '&:hover': {
      background: '#ffffff33'
    }
  },
  selected: {
    background: '#ffffff33'
  }
})

export default componentStyles
