import React from 'react'
import { Editor } from 'slate-react'

import { defaultNormalize } from './schema/defaultNormalize'

let documentSchema = null
let generatedPlugins = null

export const LeanEditor = ({ className, onChange, plugins, schema, value }) => {
  // We only want to generate the schema and plugins once since those operations are pretty expensive
  if (!documentSchema) {
    documentSchema = buildDocumentSchema(schema)
  }
  if (!generatedPlugins) {
    generatedPlugins = removeDuplicatedPlugins([
      ...plugins,
      ...buildSchemaPlugins(schema),
    ])
  }

  return (
    <Editor
      className={className}
      onChange={handleOnChange}
      plugins={generatedPlugins}
      schema={documentSchema}
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
    const { selfMaxInRoot, selfMinInRoot, type } = node.config
    if (type) {
      // We add a seperate object with a single `match.type` object
      // so the user explicitly defines the exact order and accurance of each node in the root document
      documentNodes.push({
        match: { type },
        // TODO: The `selfMaxInRoot` and `selfMinInRoot` props should not be set on the plugin level
        // But only on the rootDocument
        max: typeof selfMaxInRoot === 'number' ? selfMaxInRoot : 1,
        min: typeof selfMinInRoot === 'number' ? selfMinInRoot : 1,
      })
    }
  }

  const constructedSchema = {
    document: {
      nodes: documentNodes,
      normalize: defaultNormalize,
    },
    blocks: {},
    // NOTE: We won't add `marks`, `inline` & `rules` here
    // since the marks within nested plugins (e.g. text) would not work w/o adding all marks on the top levels as well
  }
  return constructedSchema
}

function buildSchemaPlugins(schema) {
  return schema.reduce((plugins, node) => {
    return [...plugins, node, ...extractNestedPlugins(node)]
  }, [])
}

function extractNestedPlugins(plugin) {
  const inlines = plugin.config.inlines || []
  const marks = plugin.config.marks || []
  const nodes = plugin.config.nodes || []

  const nestedPlugins = nodes.reduce((array, node) => {
    return [...array, ...extractNestedPlugins(node)]
  }, [])

  return [...inlines, ...marks, ...nodes, ...nestedPlugins]
}

function removeDuplicatedPlugins(allPlugins) {
  const filteredPlugins = []

  for (let plugin of allPlugins) {
    if (
      !filteredPlugins
        .map(o => JSON.stringify(o))
        .includes(JSON.stringify(plugin))
    ) {
      filteredPlugins.push(plugin)
    }
  }

  return filteredPlugins
}
