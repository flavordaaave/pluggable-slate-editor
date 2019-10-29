import React from 'react'
import ItalicIcon from '@material-ui/icons/FormatItalic'

const defaultConfig = {
  icon: ItalicIcon,
  schemaType: 'italic',
  toggleCommand: 'toggleItalic',
}

export const ItalicPlugin = (config = defaultConfig) => {
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
          return <em>{props.children}</em>
        default:
          return next()
      }
    },
  }
}
