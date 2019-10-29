import React from 'react'
import InfoButton from '@material-ui/icons/Info'

import { InfoBoxComponent } from './component'

const defaultConfig = {
  icon: InfoButton,
  schemaType: 'infoBox',
  toggleCommand: 'toggleInfoBox',
}

export const InfoBoxBlock = (config = defaultConfig) => {
  const { schemaType, toggleCommand } = config

  return {
    config,
    commands: {
      [toggleCommand]: editor => {
        const isActive = editor.value.blocks.some(
          block => block.type === schemaType
        )

        // Otherwise, set the currently selected blocks type to "type".
        editor.setBlocks(isActive ? 'paragraph' : schemaType)
      },
    },
    renderBlock(props, editor, next) {
      switch (props.node.type) {
        case schemaType:
          return <InfoBoxComponent {...props} />
        default:
          return next()
      }
    },
  }
}
