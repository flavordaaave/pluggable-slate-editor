export function getCurrentTargetBlock(editor) {
  if (!editor || !editor.value) return null
  return editor.value.blocks.first()
}
