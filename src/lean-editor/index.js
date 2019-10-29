import React from 'react'
import { Editor } from 'slate-react'

export const LeanEditor = ({ className, onChange, schema, value }) => {
  return (
    <Editor
      className={className}
      onChange={handleOnChange}
      plugins={buildPlugins(schema)}
      schema={buildDocumentSchema(schema)}
      value={value}
    />
  )

  function handleOnChange({ value }) {
    onChange(value)
  }
}

// We only need to build the document a.k.a root schema with it's nodes
// All blocks are added by the plugins itself
function buildDocumentSchema(schema) {
  const documentNodes = []

  for (let node of schema) {
    const { type } = node.config
    if (type) {
      // We add a seperate object with a single `match.type` object
      // so the user explicitly defines the exact order and accurance of each node in the root document
      documentNodes.push({
        match: { type },
        max: 1, // Prevents multiple occurences in a row
        min: 1,
      })
    }
  }

  const constructedSchema = {
    document: {
      nodes: documentNodes,
      normalize(editor, error) {
        const { code, index, node, child, rule } = error
        console.log('Document: child', child)
        console.log('Document: code', code)
        console.log('Document: rule', rule)
        console.log('Document: node', node)
        console.log('Document: index', index)
      },
    },
    blocks: {},
    inlines: [],
    rules: [],
  }
  return constructedSchema
}

function buildPlugins(schema) {
  const plugins = []

  // Add all root-level plugins
  for (let node of schema) {
    plugins.push(node)

    // Check if we have nested plugins
    const { nodes = [] } = node.config
    for (let node of nodes) {
      plugins.push(node)
    }
  }

  return plugins
}
