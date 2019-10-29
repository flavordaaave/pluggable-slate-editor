import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { Value } from 'slate'

import { LeanEditor } from './lean-editor'
import { ParagraphNode, CodeNode } from './lean-editor/plugins/nodes'

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'articleBody',
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                text: 'A line of text in a paragraph block.',
              },
            ],
          },
          {
            object: 'block',
            type: 'code',
            nodes: [
              {
                object: 'text',
                text: 'A line of text in a code block.',
              },
            ],
          },
        ],
      },
    ],
  },
})

const schema = [
  {
    type: 'articleBody',
    nodes: [ParagraphNode(), CodeNode()],
  },
]

export const App = () => {
  const [editorValue, setEditorValue] = useState(initialValue)

  const classes = useStyles()
  return (
    <React.Fragment>
      <CssBaseline />
      <Container className={classes.container} maxWidth="md">
        <LeanEditor
          className={classes.editor}
          onChange={setEditorValue}
          schema={schema}
          value={editorValue}
        />
      </Container>
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
  container: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2),
  },
}))
