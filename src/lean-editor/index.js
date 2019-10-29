import React from 'react'
import { Editor } from 'slate-react'

export const LeanEditor = ({ className, onChange, schema, value }) => {
  return (
    <Editor
      className={className}
      onChange={handleOnChange}
      plugins={buildPlugins(schema)}
      schema={buildSchema(schema)}
      value={value}
    />
  )

  function handleOnChange({ value }) {
    onChange(value)
  }
}

function buildSchema(schema) {
  const documentNodes = schema.map(node => ({
    match: { type: node.type },
  }))

  const documentBlocks = {}

  for (let node of schema) {
    documentBlocks[node.type] = {
      nodes: [
        {
          match: node.nodes.map(block => ({
            type: block.config.type,
          })),
        },
      ],
    }
  }

  const constructedSchema = {
    document: {
      nodes: documentNodes,
      normalize(editor, { code, index, node, child, rule }) {
        console.log('child', child)
        console.log('code', code)
        console.log('rule', rule)
      },
    },
    blocks: documentBlocks,
    inlines: [],
    rules: [],
  }
  return constructedSchema
}

function buildPlugins(schema) {
  const plugins = []

  for (let node of schema) {
    for (let block of node.nodes) {
      plugins.push(block)
    }
  }

  return plugins
}
