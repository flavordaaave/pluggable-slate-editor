import React from 'react'

import { getPlaceholderFromSchema } from '../../_utils'

// Taken from https://github.com/ianstormtaylor/slate/tree/master/packages/slate-react-placeholder
// and enhanced to use placeholder string from schema
export function PlaceholderPlugin(options = {}) {
  const { defaultPlaceholder, style = {} } = options

  function decorateNode(node, editor, next) {
    // Only decorade `block` nodes that have an empty text AND a placeholder prop in their schema

    if (node.object !== 'block' || node.text !== '') return next()
    const placeholderValue =
      getPlaceholderFromSchema(editor, node) || defaultPlaceholder
    if (!placeholderValue) return next()

    const others = next()
    const [first] = node.texts()
    const [last] = node.texts({ direction: 'backward' })
    const [firstNode, firstPath] = first
    const [lastNode, lastPath] = last
    const decoration = {
      type: 'placeholder',
      data: { placeholderValue },
      anchor: { key: firstNode.key, offset: 0, path: firstPath },
      focus: {
        key: lastNode.key,
        offset: lastNode.text.length,
        path: lastPath,
      },
    }

    return [...others, decoration]
  }

  function renderDecoration(props, editor, next) {
    const { children, decoration: deco } = props
    if (deco.type === 'placeholder') {
      const placeHolderStyle = {
        pointerEvents: 'none',
        display: 'inline-block',
        width: '0',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: '0.333',
        ...style,
      }

      return (
        <span>
          <span contentEditable={false} style={placeHolderStyle}>
            {deco.data.get('placeholderValue')}
          </span>
          {children}
        </span>
      )
    }

    return next()
  }

  /**
   * Return the plugin.
   *
   * @return {Object}
   */

  return { decorateNode, renderDecoration }
}
