import React from 'react'

import { ContainerComponent } from './component'

const defaultConfig = {
  Component: ContainerComponent,
  nodes: [],
  type: 'body',
}

export const ContainerNode = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { Component, nodes, type } = config
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
          nodes:
            (nodes &&
              nodes.length > 0 && [
                {
                  match: nodes.map(node => ({
                    type: node.config.type,
                  })),
                },
              ]) ||
            [],
          marks: [],
          inlines: [],
          rules: [],
          normalize(editor, error) {
            const { code, index, node, child, rule } = error
            console.log('ContainerNode: child', child)
            console.log('ContainerNode: code', code)
            console.log('ContainerNode: rule', rule)
          },
        },
      },
    },
  }
}
