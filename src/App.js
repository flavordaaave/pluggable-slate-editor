import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { Value } from 'slate'

import { LeanEditor } from './lean-editor'
import { ContainerNode, TextNode } from './lean-editor/plugins/nodes'
import initialValue from './value'
import { Code, Headline, InfoBox } from './components'

// NOTE: The order matters!
const schema = [
  TextNode({
    Component: Headline,
    type: 'headline',
  }),
  ContainerNode({
    nodes: [
      TextNode(),
      TextNode({
        Component: Code,
        type: 'code',
      }),
      ContainerNode({
        type: 'infoBox',
        Component: InfoBox,
        nodes: [
          TextNode({
            type: 'infoBoxParagraph',
          }),
        ],
      }),
    ],
  }),
  TextNode({
    Component: Headline,
    type: 'headline',
  }),
]

export const App = () => {
  const [editorValue, setEditorValue] = useState(Value.fromJSON(initialValue))

  const classes = useStyles()
  return (
    <React.Fragment>
      <CssBaseline />
      <LeanEditor
        className={classes.editor}
        onChange={setEditorValue}
        schema={schema}
        value={editorValue}
      />
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: '#efefef',
    },
  },
  editor: {
    padding: theme.spacing(2),
  },
}))
