import React from 'react'
import ItalicIcon from '@material-ui/icons/FormatItalic'

const defaultConfig = {
  icon: ItalicIcon,
  type: 'italic',
  toggleCommand: undefined,
}

export const ItalicMark = (configOverrides = {}) => {
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
          return <em>{props.children}</em>
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
