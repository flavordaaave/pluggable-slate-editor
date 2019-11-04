import React from 'react'
import BoldIcon from '@material-ui/icons/FormatBold'

const defaultConfig = {
  icon: BoldIcon,
  type: 'bold',
  toggleCommand: undefined,
}

export const BoldMark = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { type } = config

  return {
    config,
    commands: generateCommands(config),
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

function generateCommands(config) {
  const commands = {}

  if (config.toggleCommand) {
    commands[config.toggleCommand] = editor => {
      editor.toggleMark(config.type)
    }
  }

  return commands
}
