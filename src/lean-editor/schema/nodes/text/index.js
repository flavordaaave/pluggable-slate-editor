import React from 'react'

import { Block } from 'slate'

import { ParagraphComponent } from './component'
import { getCurrentTargetBlock } from '../../../_utils'

const defaultConfig = {
  allowSoftBreak: true,
  Component: ParagraphComponent,
  insertTypeOnEnter: undefined,
  marks: [],
  type: 'paragraph',
}

export const TextNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { allowSoftBreak, Component, insertTypeOnEnter, marks, type } = config
  return {
    config,
    onKeyDown(event, editor, next) {
      const currentBlock = getCurrentTargetBlock(editor)
      if (event.key === 'Enter' && currentBlock.type === type) {
        if (event.shiftKey) {
          if (!allowSoftBreak) return
          // Insert soft-linebreak
          return editor.insertText('\n')
        }
        // Insert a new block
        // As of default we insert a new block of the same type
        // but if configured we insert the block type as defined in the config
        const { value } = editor
        const { document } = value
        const parent = document.getParent(currentBlock.key)
        const index = parent.nodes.findIndex(
          node => node.key === currentBlock.key
        )
        const block = Block.create(insertTypeOnEnter || type)
        return editor
          .insertNodeByKey(parent.key, index + 1, block)
          .moveToStartOfNextText()
      }
      next()
    },
    renderBlock: (props, editor, next) => {
      switch (props.node.type) {
        case type:
          return <Component {...props} />
        default:
          return next()
      }
    },
    schema: {
      blocks: {
        [type]: {
          nodes: [
            {
              match: { object: 'text' },
            },
          ],
          marks: marks.reduce((array, mark) => {
            const { config } = mark
            if (config.type) {
              return [
                ...array,
                {
                  type: config.type,
                },
              ]
            }
            return array
          }, []),
        },
      },
    },
  }
}
