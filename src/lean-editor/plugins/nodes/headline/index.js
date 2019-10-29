import React from 'react'

import { HeadlineComponent } from './component'

const defaultConfig = {
  type: 'headline',
}

export const HeadlineNode = (configOverrides = {}) => {
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
          return <HeadlineComponent {...props} />
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
