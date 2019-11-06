import React from 'react'

import TextIcon from '@material-ui/icons/TextFormat'
import { Block } from 'slate'

import {
  appearsNodeAfterOther,
  getFirstCurrentTargetBlock,
} from '../../../_utils'
import { defaultNormalize } from '../../defaultNormalize'
import { ParagraphComponent } from './component'

const defaultConfig = {
  allowBackspaceDeleteBlock: false,
  addCommand: undefined,
  allowSoftBreak: true,
  Component: ParagraphComponent,
  icon: TextIcon,
  inlines: [],
  marks: [],
  placeholder: '',
  toggleCommand: undefined,
  toggleDefaultType: 'paragraph',
  type: 'paragraph',
}

export const TextNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const {
    allowBackspaceDeleteBlock,
    allowSoftBreak,
    Component,
    inlines,
    marks,
    type,
  } = config
  return {
    commands: generateCommands(config),
    config,
    ...limitSelectionToType(type),
    onKeyDown(event, editor, next) {
      const currentBlock = getFirstCurrentTargetBlock(editor)
      // Add handler for soft-linebreaks
      if (event.key === 'Enter' && currentBlock.type === type) {
        if (event.shiftKey) {
          if (!allowSoftBreak) return
          // Insert soft-linebreak
          return editor.insertText('\n')
        }
        return editor.splitBlock()
      }

      // Prevent deletion of block when cursor is at the beginning of the block and backspace is pressed
      if (event.key === 'Backspace' && currentBlock.type === type) {
        const {
          value: { document, selection },
        } = editor
        const previousBlock = document.getPreviousBlock(currentBlock.key)
        if (
          selection.anchor.offset === 0 &&
          selection.focus.offset === 0 &&
          !allowBackspaceDeleteBlock &&
          previousBlock.type !== currentBlock.type
        ) {
          return
        }
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

/**
 * Prevents that a TRIPLE mouse click sets a selection accorss different block types.
 */
function limitSelectionToType(type) {
  return {
    onSelect(_, editor, next) {
      const {
        value: { document, selection },
      } = editor
      const anchorKey = selection.anchor.key
      const anchorNode = anchorKey && document.getClosestBlock(anchorKey)
      // If the selection starts within this type...
      if (anchorNode && anchorNode.type === type) {
        const focusKey = selection.focus.key
        const focusNode = focusKey && document.getClosestBlock(focusKey)
        // ...and the selection goes into a block of another type
        if (anchorNode.type !== focusNode.type) {
          // Assuming the blocks in SlateJS have ascending keys
          // we can decide wether the selection was made forward or backwards
          if (appearsNodeAfterOther(editor, focusNode, anchorNode)) {
            // Selection was made forward
            const edgeBlock = document.getPreviousBlock(focusNode.key)
            return editor.withoutNormalizing(c => {
              c.moveFocusToEndOfNode(edgeBlock)
            })
          } else {
            // Selection was made backwards
            const edgeBlock = document.getNextBlock(focusNode.key)
            return editor.withoutNormalizing(c => {
              return c.moveFocusToStartOfNode(edgeBlock)
            })
          }
        }
      }
      next()
    },
  }
}
