import React from 'react'

import { CodeComponent } from './component'

const defaultConfig = {
  type: 'code',
}

export const CodeNode = (config = defaultConfig) => {
  const { type } = config
  return {
    config,
    renderBlock: (props, editor, next) => {
      switch (props.node.type) {
        case type:
          return <CodeComponent {...props} />
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
