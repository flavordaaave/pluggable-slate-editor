import React from 'react'

import TextIcon from '@material-ui/icons/TextFormat'
import { Block } from 'slate'

import { getFirstCurrentTargetBlock } from '../../../_utils'
import { defaultNormalize } from '../../defaultNormalize'
import { ParagraphComponent } from './component'

const defaultConfig = {
  addCommand: undefined,
  allowSoftBreak: true,
  Component: ParagraphComponent,
  icon: TextIcon,
  inlines: [],
  marks: [],
  placeholder: '',
  selfMin: undefined,
  selfMax: undefined,
  toggleCommand: undefined,
  toggleDefaultType: 'paragraph',
  type: 'paragraph',
}

export const TextNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { allowSoftBreak, Component, inlines, marks, type } = config
  return {
    commands: generateCommands(config),
    config,
    onKeyDown(event, editor, next) {
      const currentBlock = getFirstCurrentTargetBlock(editor)
      if (event.key === 'Enter' && currentBlock.type === type) {
        // TODO: ONLY add a new block if selection is at the END of the text

        if (event.shiftKey) {
          if (!allowSoftBreak) return
          // Insert soft-linebreak
          return editor.insertText('\n')
        }
        return editor.splitBlock()
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
          nodes: [{ match: [{ object: 'text' }, { object: 'inline' }] }],
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
          inlines: inlines.reduce((array, inline) => {
            const { config } = inline
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
          normalize: defaultNormalize,
        },
      },
    },
  }
}

function generateCommands(config) {
  const commands = {}

  if (config.toggleCommand) {
    commands[config.toggleCommand] = editor => {
      const currentBlock = getFirstCurrentTargetBlock(editor)
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
      const currentBlock = getFirstCurrentTargetBlock(editor)
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
