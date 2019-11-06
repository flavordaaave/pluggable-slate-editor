import { getPluginForNode } from './getPluginForNode'

export function getPlaceholderFromPlugin(editor, node) {
  const { config } = getPluginForNode(editor, node) || {}
  return config.placeholder
}
