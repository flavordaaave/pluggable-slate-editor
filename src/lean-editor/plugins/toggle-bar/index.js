import React from 'react'
import { findRange } from 'slate-react'

import { NavBarComponent } from './component'

const defaultConfig = {
  commandTypes: ['toggleCommand'],
}

export const TogglebarPlugin = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { commandTypes } = config

  return {
    config,
    renderEditor(props, editor, next) {
      // Get all plugins
      const plugins = (editor && editor.props && editor.props.plugins) || []
      const buttons = generateButtons(editor, plugins, commandTypes)
      const children = next()
      return (
        <React.Fragment>
          <NavBarComponent buttons={buttons} />
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
      .filter(plugin => {
        return (
          commandTypes.findIndex(command =>
            plugin.config.hasOwnProperty(command)
          ) >= 0
        )
      })
      // Create a button object for every plugin
      .map(plugin => ({
        isActive: getIsActive(editor, plugin),
        icon: plugin.config.icon,
        isVisible: getIsVisible(editor, plugins, plugin),
        onClick:
          editor[
            plugin.config[
              commandTypes.find(command =>
                plugin.config.hasOwnProperty(command)
              )
            ]
          ],
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
    case 'block':
    default:
      return false
  }
}

function getIsVisible(editor, allPlugins, plugin) {
  const currentBlock = getCurrentTargetBlock(editor)
  const schema = getSchemaForBlock(allPlugins, currentBlock)

  switch (getPluginType(plugin)) {
    case 'mark':
      const allowedMarks =
        (((schema || {}).blocks || {})[currentBlock && currentBlock.type] || {})
          .marks || []

      return (
        allowedMarks.findIndex(mark => mark.type === plugin.config.type) >= 0
      )
    case 'inline':
    case 'block':
    default:
      return false
  }
}

function getSchemaForBlock(plugins, block) {
  const found =
    plugins.find(plugin => plugin.config.type === (block && block.type)) || {}
  return found.schema || null
}

function getCurrentTargetBlock(editor) {
  const { document } = editor.value
  const nativeSelection = window.getSelection()
  const range = findRange(nativeSelection, editor)
  return range && document.getLeafBlocksAtRange(range).first()
}
