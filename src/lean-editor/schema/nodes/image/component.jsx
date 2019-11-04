import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import React from 'react'

export const ImageComponent = props => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <img {...props} className={classes.image} alt="slate-img" />

      <IconButton className={classes.deleteButton} onClick={props.onDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  image: {
    width: '90%',
  },
  wrapper: {
    position: 'relative',
    width: '100%',
  },
}))
