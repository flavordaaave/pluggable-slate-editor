import React from 'react'
import BoldIcon from '@material-ui/icons/FormatBold'

const defaultConfig = {
  icon: BoldIcon,
  schemaType: 'bold',
  toggleCommand: 'toggleBold',
}

export const BoldPlugin = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { schemaType, toggleCommand } = config

  return {
    config,
    commands: {
      [toggleCommand]: editor => {
        editor.toggleMark(schemaType)
      },
    },
    renderMark(props, editor, next) {
      switch (props.mark.type) {
        case schemaType:
          return <strong>{props.children}</strong>
        default:
          return next()
      }
    },
  }
}
