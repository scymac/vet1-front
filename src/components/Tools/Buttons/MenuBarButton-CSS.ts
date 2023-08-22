const componentStyles = () => ({
  main: {
    display:        'flex',
    justifyContent: 'center',
    alignItems:     'center',
    marginLeft:     -30,
    marginRight:    -30,
    height:         40,
    color:          '#fff',
    fontWeight:     600,
    cursor:         'pointer',
    '&:active':     {
      color: '#ffffffaa',
    },
  },
  selected: {
    background: '#ffffff33',
  },

})

export default componentStyles
