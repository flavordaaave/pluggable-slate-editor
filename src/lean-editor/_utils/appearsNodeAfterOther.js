/**
 * Returns true if node1 appears AFTER node1
 *
 * @param {*} editor
 * @param {*} node1
 * @param {*} node2
 */
export function appearsNodeAfterOther(editor, maybeAfterNode, originNode) {
  const {
    value: { document },
  } = editor

  const maybeAfterNodePath = document.getPath(maybeAfterNode)
  const originNodePath = document.getPath(originNode)

  // We compare the 2 path arrays for the first item that does NOT match
  const indexThatDiffers = maybeAfterNodePath.findIndex(
    (pathVal, i) => pathVal !== originNodePath.get(i)
  )
  return (
    maybeAfterNodePath.get(indexThatDiffers) >
    originNodePath.get(indexThatDiffers)
  )
}
