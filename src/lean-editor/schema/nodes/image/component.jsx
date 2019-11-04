import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

export const ImageComponent = props => {
  const classes = useStyles()

  return <img {...props} className={classes.container} alt="slate-img" />
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
}))
