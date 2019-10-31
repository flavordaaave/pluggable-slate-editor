import { findRange } from 'slate-react'

export function getCurrentTargetBlock(editor) {
  const { document } = editor.value
  const nativeSelection = window.getSelection()
  const range = findRange(nativeSelection, editor)
  return range && document.getLeafBlocksAtRange(range).first()
}
