import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

export const ParagraphComponent = props => {
  const classes = useStyles()

  return (
    <Typography {...props} className={classes.typography} variant="body1" />
  )
}

const useStyles = makeStyles(theme => ({
  typography: {
    margin: theme.spacing(1, 0),
  },
}))
