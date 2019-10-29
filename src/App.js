import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { Value } from 'slate'

import { LeanEditor } from './lean-editor'
import {
  CodeNode,
  ContainerNode,
  HeadlineNode,
  ParagraphNode,
} from './lean-editor/plugins/nodes'
import initialValue from './value'
import { InfoBox } from './components/InfoBox'

// NOTE: The order matters!
const schema = [
  HeadlineNode(),
  ContainerNode({
    nodes: [
      ParagraphNode(),
      CodeNode(),
      ContainerNode({
        type: 'infoBox',
        Component: InfoBox,
        nodes: [
          ParagraphNode({
            type: 'infoBoxParagraph',
          }),
        ],
      }),
    ],
  }),
  HeadlineNode(),
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
