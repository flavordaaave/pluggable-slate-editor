import React from 'react'
import LinkIcon from '@material-ui/icons/Link'

const defaultConfig = {
  icon: LinkIcon,
  type: 'link',
  toggleCommand: 'toggleLink',
}

export const LinkInline = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { type, toggleCommand } = config

  return {
    config,
    commands: {
      [toggleCommand]: editor => {
        const { value } = editor
        const hasLinks = value.inlines.some(inline => inline.type === type)
        if (hasLinks) {
          editor.unwrapInline(type)
        } else if (value.selection.isExpanded) {
          const href = window.prompt('Enter the URL of the link:')

          if (href == null) {
            return
          }
          editor.wrapInline({
            type,
            data: { href },
          })
          editor.moveToEnd()
        }
      },
    },
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
