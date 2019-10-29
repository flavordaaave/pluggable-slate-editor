import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

export const ContainerComponent = props => {
  const classes = useStyles()

  return <Container {...props} className={classes.container} maxWidth="md" />
}

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2),
  },
}))
