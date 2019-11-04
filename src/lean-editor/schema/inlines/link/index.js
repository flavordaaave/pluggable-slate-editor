import React from 'react'
import LinkIcon from '@material-ui/icons/Link'

const defaultConfig = {
  icon: LinkIcon,
  type: 'link',
  toggleCommand: undefined,
}

export const LinkInline = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { type } = config

  return {
    config,
    commands: generateCommands(config),
    renderInline(props, editor, next) {
      switch (props.node.type) {
        case type:
          const { data } = props.node
          const href = data.get('href')
          return (
            <a {...props.attributes} href={href}>
              {props.children}
            </a>
          )
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
      const { value } = editor
      const hasLinks = value.inlines.some(inline => inline.type === config.type)
      if (hasLinks) {
        editor.unwrapInline(config.type)
      } else if (value.selection.isExpanded) {
        const href = window.prompt('Enter the URL of the link:')

        if (href == null) {
          return
        }
        editor.wrapInline({
          type: config.type,
          data: { href },
        })
        editor.moveToEnd()
      }
    }
  }

  return commands
}
