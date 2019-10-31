export function getAllCurrentTargetBlocks(editor) {
  if (!editor || !editor.value) return null
  return editor.value.blocks
}
