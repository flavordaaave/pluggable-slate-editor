import React from 'react'

import ImageIcon from '@material-ui/icons/Image'
import { Block } from 'slate'

import { getFirstCurrentTargetBlock } from '../../../_utils'
import { ImageComponent } from './component'

const defaultConfig = {
  addCommand: 'addImage',
  Component: ImageComponent,
  icon: ImageIcon,
  toggleCommand: undefined,
  toggleNodesDefaultType: 'paragraph',
  type: 'image',
}

export const ImageNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { addCommand, Component, type } = config
  return {
    commands: {
      [addCommand]: editor => {
        const { value } = editor
        const { document } = value
        const currentBlock = getFirstCurrentTargetBlock(editor)
        const parent = document.getParent(currentBlock.key)
        const index = parent.nodes.findIndex(
          node => node.key === currentBlock.key
        )

        const src = window.prompt('Enter the Image URL:')

        if (src == null) {
          return
        }

        const block = Block.create({
          type: type,
          data: {
            src,
          },
        })

        return editor
          .insertNodeByKey(parent.key, index + 1, block)
          .moveToStartOfNextText()
      },
    },
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
      },
    },
  }
}
