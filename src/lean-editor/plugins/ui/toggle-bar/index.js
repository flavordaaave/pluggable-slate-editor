import React from 'react'

import { InlineBarComponent } from './component'

const defaultConfig = {
  commandTypes: ['toggleCommand'],
}

export const TogglebarPlugin = (configOverrides = {}) => {
  const config = {
    ...defaultConfig,
    ...configOverrides,
  }
  const { commandTypes } = config

  return {
    config,
    renderEditor(props, editor, next) {
      const children = next()
      return (
        <React.Fragment>
          <InlineBarComponent editor={editor} commandTypes={commandTypes} />
          {children}
        </React.Fragment>
      )
    },
  }
}
