import React from 'react'

import { ParagraphComponent } from './component'

const defaultConfig = {
  Component: ParagraphComponent,
  type: 'paragraph',
}

export const TextNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { Component, type } = config
  return {
    config,
    renderBlock: (props, editor, next) => {
      switch (props.node.type) {
        case type:
          return <Component {...props} />
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
