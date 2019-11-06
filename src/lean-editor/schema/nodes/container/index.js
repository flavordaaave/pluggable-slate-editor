import React from 'react'

import BlockIcon from '@material-ui/icons/AspectRatio'
import { Block } from 'slate'

import {
  getAllCurrentTargetBlocks,
  getFirstCurrentTargetBlock,
  getParentForBlock,
} from '../../../_utils'
import { defaultNormalize } from '../../defaultNormalize'
import { ContainerComponent } from './component'

const defaultConfig = {
  addCommand: undefined,
  Component: ContainerComponent,
  icon: BlockIcon,
  maxNodes: undefined,
  minNodes: undefined,
  nodes: [],
  preventBackspaceDeletion: false,
  toggleCommand: undefined,
  toggleNodesDefaultType: 'paragraph',
  type: 'body',
}

export const ContainerNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { Component, nodes, preventBackspaceDeletion, type } = config
  return {
    commands: generateCommands(config),
    config,
    onKeyDown(event, editor, next) {
      const currentBlock = getFirstCurrentTargetBlock(editor)
      // Prevent deletion of block when cursor is at the beginning of the block and backspace is pressed
      if (event.key === 'Backspace') {
        const {
          value: { document, selection },
        } = editor
        const previousNode = document.getPreviousNode(currentBlock.key)
        if (
          previousNode.type === type &&
          selection.anchor.offset === 0 &&
          selection.focus.offset === 0 &&
          preventBackspaceDeletion
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
          nodes: generateNodes(config),
          normalize: (editor, error) => {
            const { code, child } = error
            if (code === 'child_type_invalid' && nodes.length > 0) {
              // Replace the invalid child with an empty block of the first node from the config
              return editor.replaceNodeByKey(
                child.key,
                Block.create(nodes[0].config.type)
              )
            }
            defaultNormalize(editor, error)
          },
        },
      },
    },
  }
}

function generateCommands(config) {
  const { nodes } = config
  const commands = {}

  if (config.toggleCommand) {
    commands[config.toggleCommand] = editor => {
      const currentBlock = getFirstCurrentTargetBlock(editor)
      const allCurrentBlocks = getAllCurrentTargetBlocks(editor)
      const parentBlock = getParentForBlock(editor, currentBlock)
      // currentBlock will always be a child of this container
      // so to get the contsainer type we need to look at the paren
      if (parentBlock.type === config.type) {
        return editor.withoutNormalizing(c => {
          c.unwrapBlock(parentBlock.type)
          allCurrentBlocks.forEach(block => {
            c.setNodeByKey(block.key, config.toggleNodesDefaultType)
          })
        })
      }
      // Toggle towards this type
      return editor.withoutNormalizing(c => {
        // TODO: Use the first child that has text nodes
        const firstValidChildType = ((nodes[0] || {}).config || {}).type || null
        // TODO: Only set on blocks that contains text nodes
        c.setBlocks(firstValidChildType).wrapBlock(config.type)
      })
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
      // Create an empty child node of the first type that is valid for this block
      const firstValidChildType = ((nodes[0] || {}).config || {}).type || null
      if (!firstValidChildType) return
      const block = Block.create({
        type: config.type,
        nodes: [Block.create(firstValidChildType)],
      })

      return editor
        .insertNodeByKey(parent.key, index + 1, block)
        .moveToStartOfNextText()
    }
  }

  return commands
}

function generateNodes(config) {
  const { maxNodes, minNodes, nodes } = config
  if (!Array.isArray(nodes)) return []
  return [
    {
      match: nodes.map(node => ({
        type: node.config.type,
      })),
      ...(typeof maxNodes === 'number' ? { max: maxNodes } : {}),
      ...(typeof minNodes === 'number' ? { min: minNodes } : {}),
    },
  ]
}
