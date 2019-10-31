import React from 'react'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

export const ActionBarComponent = ({ buttons }) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <ButtonGroup className={classes.buttonGroup}>
        {buttons.map(
          button =>
            button.isVisible && (
              <IconButton
                color={button.isActive ? 'primary' : 'default'}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  button.onClick()
                }}
              >
                <button.Icon />
              </IconButton>
            )
        )}
      </ButtonGroup>
      <Divider />
    </React.Fragment>
  )
}

const useStyles = makeStyles({
  buttonGroup: {
    display: 'block',
    height: '48px !important',
    textAlign: 'center',
    width: '100%',
  },
})
