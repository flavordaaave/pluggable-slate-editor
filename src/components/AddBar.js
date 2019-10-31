import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'

export const AddBar = ({ buttons }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const activeButtons =
    (buttons &&
      buttons.filter(button => !button.isActive && button.isVisible)) ||
    []

  return (
    activeButtons &&
    activeButtons.length > 0 && (
      <SpeedDial
        ariaLabel="Add menu"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
      >
        {activeButtons.map(button => (
          <SpeedDialAction
            key={button.key}
            icon={<button.Icon />}
            tooltipTitle={button.label}
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              setOpen(false)
              button.onClick()
            }}
          />
        ))}
      </SpeedDial>
    )
  )

  function handleClose() {
    setOpen(false)
  }

  function handleOpen() {
    setOpen(true)
  }
}

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'fixed',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      left: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}))
