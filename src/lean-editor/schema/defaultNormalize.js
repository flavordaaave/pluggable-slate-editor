import { Block } from 'slate'

// Taken from https://github.com/ianstormtaylor/slate/blob/master/packages/slate/src/plugins/schema.js
// and enhanced with some additional rules

export function defaultNormalize(editor, error) {
  const {
    child,
    code,
    count,
    index,
    key,
    limit,
    mark,
    next,
    node,
    previous,
    rule,
  } = error
  console.log('code', code)
  switch (code) {
    case 'child_max_invalid':
    case 'child_object_invalid':
    case 'child_type_invalid':
    case 'child_unknown':
    case 'first_child_object_invalid':
    case 'first_child_type_invalid':
    case 'last_child_object_invalid':
    case 'last_child_type_invalid': {
      return child.object === 'text' &&
        node.object === 'block' &&
        node.nodes.size === 1
        ? editor.removeNodeByKey(node.key)
        : editor.removeNodeByKey(child.key)
    }

    case 'previous_sibling_object_invalid':
    case 'previous_sibling_type_invalid': {
      return previous.object === 'text' &&
        node.object === 'block' &&
        node.nodes.size === 1
        ? editor.removeNodeByKey(node.key)
        : editor.removeNodeByKey(previous.key)
    }

    case 'next_sibling_object_invalid':
    case 'next_sibling_type_invalid': {
      return next.object === 'text' &&
        node.object === 'block' &&
        node.nodes.size === 1
        ? editor.removeNodeByKey(node.key)
        : editor.removeNodeByKey(next.key)
    }

    case 'child_min_invalid': {
      // The index does NOT help us find the missing child here since it does not handle the case where
      // other nodes appeare more than once (e.g. 2x `headline`).
      // So we go through the nodes as they are defined in rule/schema and compare them to the nodes from the error
      // In order to get the missing node type
      const expectedNodes = rule.nodes.map(node => node.match.type)
      const receivedNodes = node.toJSON().nodes.map(node => node.type)
      const missingNodeIndex = expectedNodes.findIndex(
        node => !receivedNodes.includes(node)
      )
      const missingType = expectedNodes[missingNodeIndex]
      if (missingType) {
        // Than we need to get the index where we need to insert the missing type
        let indexToAddNode = missingNodeIndex
        if (missingNodeIndex === 0) {
          const typeBeforeMissing =
            missingNodeIndex > 0
              ? expectedNodes[missingNodeIndex - 1]
              : expectedNodes[0]
          const indexToAddMissingAfter = receivedNodes.lastIndexOf(
            typeBeforeMissing
          )
          indexToAddNode = indexToAddMissingAfter + 1
        }
        return editor.insertNodeByKey(
          node.key,
          indexToAddNode,
          Block.create({
            type: missingType,
            nodes: [],
          })
        )
      }
    }

    case 'node_text_invalid':
    case 'parent_object_invalid':
    case 'parent_type_invalid': {
      return node.object === 'document'
        ? node.nodes.forEach(n => editor.removeNodeByKey(n.key))
        : editor.removeNodeByKey(node.key)
    }

    case 'node_data_invalid': {
      return node.data.get(key) === undefined && node.object !== 'document'
        ? editor.removeNodeByKey(node.key)
        : editor.setNodeByKey(node.key, { data: node.data.delete(key) })
    }

    case 'node_mark_invalid': {
      return node
        .getTexts()
        .forEach(t => editor.removeMarkByKey(t.key, 0, t.text.length, mark))
    }

    default: {
      return editor.removeNodeByKey(node.key)
    }
  }
}
