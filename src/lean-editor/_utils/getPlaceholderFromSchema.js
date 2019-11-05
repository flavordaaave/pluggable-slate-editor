import { getPluginForNode } from './getPluginForNode'

export function getPlaceholderFromSchema(editor, node) {
  const { schema } = getPluginForNode(editor, node) || {}
  return (
    schema.blocks &&
    schema.blocks[node.type] &&
    schema.blocks[node.type].placeholder
  )
}
