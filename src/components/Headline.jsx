import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

export const Headline = props => {
  const classes = useStyles()

  return <Typography {...props} className={classes.typography} variant="h2" />
}

const useStyles = makeStyles(theme => ({
  typography: {
    margin: theme.spacing(2, 0),
    textAlign: 'center',
  },
}))
