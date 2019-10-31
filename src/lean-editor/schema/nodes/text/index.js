import React from 'react'

import TextIcon from '@material-ui/icons/TextFormat'
import { Block } from 'slate'

import { ParagraphComponent } from './component'
import { getCurrentTargetBlock } from '../../../_utils'

const defaultConfig = {
  addCommand: undefined,
  allowSoftBreak: true,
  Component: ParagraphComponent,
  icon: TextIcon,
  insertTypeOnEnter: undefined,
  marks: [],
  toggleCommand: undefined,
  toggleDefaultType: 'paragraph',
  type: 'paragraph',
}

export const TextNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { allowSoftBreak, Component, insertTypeOnEnter, marks, type } = config
  return {
    commands: generateCommands(config),
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

function generateCommands(config) {
  const commands = {}

  if (config.toggleCommand) {
    commands[config.toggleCommand] = editor => {
      const currentBlock = getCurrentTargetBlock(editor)
      if (currentBlock.type === config.type) {
        // Toggle to default block
        return editor.setNodeByKey(currentBlock.key, config.toggleDefaultType)
      }
      // Toggle towards this type
      return editor.setNodeByKey(currentBlock.key, config.type)
    }
  }

  if (config.addCommand) {
    commands[config.addCommand] = editor => {
      const { value } = editor
      const { document } = value
      const currentBlock = getCurrentTargetBlock(editor)
      const parent = document.getParent(currentBlock.key)
      const index = parent.nodes.findIndex(
        node => node.key === currentBlock.key
      )
      const block = Block.create(config.type)
      return editor
        .insertNodeByKey(parent.key, index + 1, block)
        .moveToStartOfNextText()
    }
  }

  return commands
}
