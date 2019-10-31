import React from 'react'

import BlockIcon from '@material-ui/icons/AspectRatio'
import { Block } from 'slate'

import {
  getAllCurrentTargetBlocks,
  getFirstCurrentTargetBlock,
  getParentForBlock,
} from '../../../_utils'
import { ContainerComponent } from './component'

const defaultConfig = {
  addCommand: undefined,
  Component: ContainerComponent,
  icon: BlockIcon,
  nodes: [],
  toggleCommand: undefined,
  toggleNodesDefaultType: 'paragraph',
  type: 'body',
}

export const ContainerNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { Component, nodes, type } = config
  return {
    commands: generateCommands(config, nodes),
    config,
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
          nodes:
            (nodes &&
              nodes.length > 0 && [
                {
                  match: nodes.map(node => ({
                    type: node.config.type,
                  })),
                },
              ]) ||
            [],
          normalize(editor, error) {
            const { code, index, node, child, rule } = error
            console.log('ContainerNode: node', node)
            console.log('ContainerNode: child', child)
            console.log('ContainerNode: code', code)
            console.log('ContainerNode: rule', rule)
          },
        },
      },
    },
  }
}

function generateCommands(config, nodes) {
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
