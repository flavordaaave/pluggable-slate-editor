import React from 'react'

import ImageIcon from '@material-ui/icons/Image'
import { Block } from 'slate'

import { getFirstCurrentTargetBlock } from '../../../_utils'
import { defaultNormalize } from '../../defaultNormalize'
import { ImageComponent } from './component'

const defaultConfig = {
  addCommand: undefined,
  Component: ImageComponent,
  icon: ImageIcon,
  onAddDataResolver: () => {},
  selfMinInRoot: undefined,
  selfMaxInRoot: undefined,
  toggleCommand: undefined,
  toggleNodesDefaultType: 'paragraph',
  type: 'image',
}

export const ImageNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { Component, type } = config
  return {
    commands: generateCommands(config),
    config,
    renderBlock: (props, editor, next) => {
      switch (props.node.type) {
        case type:
          const { data } = props.node
          const src = data.get('src')
          const onDelete = () => editor.removeNodeByKey(props.node.key)
          return (
            <Component {...props.attributes} onDelete={onDelete} src={src} />
          )
        default:
          return next()
      }
    },
    schema: {
      blocks: {
        [type]: {},
        normalize: defaultNormalize,
      },
    },
  }
}

function generateCommands(config) {
  const commands = {}

  if (config.addCommand) {
    commands[config.addCommand] = async editor => {
      const { value } = editor
      const { document } = value
      const currentBlock = getFirstCurrentTargetBlock(editor)
      const parent = document.getParent(currentBlock.key)
      const index = parent.nodes.findIndex(
        node => node.key === currentBlock.key
      )

      const { src } = await config.onAddDataResolver()

      if (src == null) {
        return
      }

      const block = Block.create({
        type: config.type,
        data: {
          src,
        },
      })

      return editor
        .insertNodeByKey(parent.key, index + 1, block)
        .moveToStartOfNextText()
    }
  }

  return commands
}
