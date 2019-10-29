import React from 'react'
import InfoButton from '@material-ui/icons/Info'

import { InfoBoxComponent } from './component'

const defaultConfig = {
  icon: InfoButton,
  type: 'infoBox',
  toggleCommand: 'toggleInfoBox',
}

export const InfoBoxNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { type, toggleCommand } = config

  return {
    config,
    commands: {
      [toggleCommand]: editor => {
        const isActive = editor.value.blocks.some(block => block.type === type)

        // Otherwise, set the currently selected blocks type to "type".
        editor.setBlocks(isActive ? 'paragraph' : type)
      },
    },
    renderBlock(props, editor, next) {
      switch (props.node.type) {
        case type:
          return <InfoBoxComponent {...props} />
        default:
          return next()
      }
    },
  }
}
