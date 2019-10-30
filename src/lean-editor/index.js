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
    // NOTE: We won't add `marks`, `inline` & `rules` here
    // since the marks within nested plugins (e.g. text) would not work w/o adding all marks on the top levels as well
  }
  return constructedSchema
}

// TODO: Prevent re-rendering of the generation process
// TODO: Filter out duplicates
function buildPlugins(schema) {
  return schema.reduce((plugins, node) => {
    return [...plugins, node, ...extractNestedPlugins(node)]
  }, [])
}

function extractNestedPlugins(plugin) {
  const nodes = plugin.config.nodes || []
  const marks = plugin.config.marks || []

  const nestedPlugins = nodes.reduce((array, node) => {
    return [...array, ...extractNestedPlugins(node)]
  }, [])

  return [...nodes, ...marks, ...nestedPlugins]
}
