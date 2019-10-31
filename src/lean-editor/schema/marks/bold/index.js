import React from 'react'
import BoldIcon from '@material-ui/icons/FormatBold'

const defaultConfig = {
  icon: BoldIcon,
  type: 'bold',
  toggleCommand: 'toggleBold',
}

export const BoldMark = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { type, toggleCommand } = config

  return {
    config,
    commands: {
      [toggleCommand]: editor => {
        editor.toggleMark(type)
      },
    },
    renderMark(props, editor, next) {
      switch (props.mark.type) {
        case type:
          return <strong>{props.children}</strong>
        default:
          return next()
      }
    },
  }
}
