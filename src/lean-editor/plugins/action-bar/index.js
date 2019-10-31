import React from 'react'

import { ActionBarComponent } from './component'
import { getFirstCurrentTargetBlock, getParentForBlock } from '../../_utils'

/**
 * TODO: Allow passing in an array of specific command names to be displayed
 */

const defaultConfig = {
  commandTypes: ['toggleCommand'],
  Component: ActionBarComponent,
}

export const ActionBarPlugin = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { commandTypes, Component } = config

  return {
    config,
    renderEditor(props, editor, next) {
      // Get all plugins
      const plugins = (editor && editor.props && editor.props.plugins) || []
      const buttons = generateButtons(editor, plugins, commandTypes)
      const children = next()
      return (
        <React.Fragment>
          <Component buttons={buttons} />
          {children}
        </React.Fragment>
      )
    },
  }
}

function generateButtons(editor, plugins, commandTypes) {
  return (
    plugins
      // Get those plugins that have one of the `commandTypes`
      .filter(plugin => findValidCommandType(commandTypes, plugin))
      // Create a button object for every plugin
      .map(plugin => ({
        Icon: plugin.config.icon,
        isActive: getIsActive(editor, plugin),
        isVisible: getIsVisible(editor, plugins, plugin, commandTypes),
        key: plugin.config[findValidCommandType(commandTypes, plugin)],
        label: plugin.config[findValidCommandType(commandTypes, plugin)],
        onClick:
          editor[plugin.config[findValidCommandType(commandTypes, plugin)]],
      }))
  )
}

function getPluginType(plugin) {
  if (plugin.hasOwnProperty('renderMark')) return 'mark'
  if (plugin.hasOwnProperty('renderInline')) return 'inline'
  if (plugin.hasOwnProperty('renderBlock')) return 'block'
}

function getIsActive(editor, plugin, schemaType) {
  switch (getPluginType(plugin)) {
    case 'mark':
      return (
        editor &&
        editor.value.activeMarks.some(mark => mark.type === plugin.config.type)
      )
    case 'inline':
    case 'block': {
      const currentBlock = getFirstCurrentTargetBlock(editor)
      return (
        currentBlock &&
        currentBlock.type &&
        currentBlock.type === plugin.config.type
      )
    }

    default:
      return false
  }
}

function getIsVisible(editor, allPlugins, plugin, commandTypes) {
  const currentBlock = getFirstCurrentTargetBlock(editor)

  switch (getPluginType(plugin)) {
    case 'mark': {
      const schema = getSchemaForBlock(allPlugins, currentBlock)
      const allowedMarks =
        (((schema || {}).blocks || {})[currentBlock && currentBlock.type] || {})
          .marks || []

      return (
        allowedMarks.findIndex(mark => mark.type === plugin.config.type) >= 0
      )
    }
    case 'inline':
    case 'block': {
      const parentBlock = getParentForBlock(editor, currentBlock)
      if (!parentBlock) return false
      const schema = getSchemaForBlock(allPlugins, parentBlock)

      const allowedBlocks =
        ((((schema || {}).blocks || {})[parentBlock && parentBlock.type] || {})
          .nodes || [{}])[0].match || []
      return (
        allowedBlocks.findIndex(block => block.type === plugin.config.type) >= 0
      )
    }

    default:
      return false
  }
}

function getSchemaForBlock(plugins, block) {
  const found =
    plugins.find(plugin => plugin.config.type === (block && block.type)) || {}
  return found.schema || null
}

function findValidCommandType(commandTypes, plugin) {
  return commandTypes.find(
    command =>
      plugin.config.hasOwnProperty(command) &&
      plugin.config[command] !== undefined
  )
}