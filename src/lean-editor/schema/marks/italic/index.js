import React from 'react'
import ItalicIcon from '@material-ui/icons/FormatItalic'

const defaultConfig = {
  icon: ItalicIcon,
  type: 'italic',
  toggleCommand: 'toggleItalic',
}

export const ItalicMark = (configOverrides = {}) => {
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
          return <em>{props.children}</em>
        default:
          return next()
      }
    },
  }
}
