import React from 'react'

import { ParagraphComponent } from './component'

const defaultConfig = {
  type: 'paragraph',
}

export const ParagraphNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { type } = config
  return {
    config,
    renderBlock: (props, editor, next) => {
      switch (props.node.type) {
        case type:
          return <ParagraphComponent {...props} />
        default:
          return next()
      }
    },
    schema: {
      document: {
        blocks: {
          [type]: {
            nodes: [
              {
                match: { object: 'text' },
              },
            ],
            marks: [],
          },
        },
      },
    },
  }
}
