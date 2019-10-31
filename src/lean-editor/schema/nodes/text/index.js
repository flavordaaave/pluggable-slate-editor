import React from 'react'

import { ParagraphComponent } from './component'

const defaultConfig = {
  Component: ParagraphComponent,
  marks: [],
  type: 'paragraph',
}

export const TextNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { Component, marks, type } = config
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
      blocks: {
        [type]: {
          nodes: [
            {
              match: { object: 'text' },
            },
          ],
          marks: marks.reduce((array, mark) => {
            const { config } = mark
            if (config.type) {
              return [
                ...array,
                {
                  type: config.type,
                },
              ]
            }
            return array
          }, []),
        },
      },
    },
  }
}
