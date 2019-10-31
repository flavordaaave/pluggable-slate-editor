import { Text } from 'slate'

export function isTextBlock(block) {
  if (!block) return false
  const firstNode = block.nodes && block.nodes.first()
  return Text.isText(firstNode)
}
