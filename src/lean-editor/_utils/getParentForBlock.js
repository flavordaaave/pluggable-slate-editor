export function getParentForBlock(editor, block) {
  if (!block || !block.key) return null
  const { value } = editor
  const { document } = value
  return document.getParent(block.key)
}
