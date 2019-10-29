import React from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

export const InfoBox = props => {
  const classes = useStyles()

  return <Paper {...props} className={classes.root} square elevation={2} />
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0),
  },
}))
