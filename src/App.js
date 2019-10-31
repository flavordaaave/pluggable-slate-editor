import React, { useState } from 'react'

import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import { Value } from 'slate'

import { Caption, Code, Headline, InfoBox } from './components'
import { LeanEditor } from './lean-editor'
import { ContainerNode, TextNode } from './lean-editor/schema/nodes'
import { BoldMark, ItalicMark } from './lean-editor/schema/marks'
import { ActionBarPlugin } from './lean-editor/plugins'
import initialValue from './value'

// NOTE: The order matters!
const schema = [
  ContainerNode({
    type: 'header',
    nodes: [
      TextNode({
        Component: Headline,
        type: 'headlineTop',
      }),
    ],
  }),
  ContainerNode({
    nodes: [
      TextNode({
        marks: [BoldMark(), ItalicMark()],
      }),
      TextNode({
        allowSoftBreak: false,
        Component: Code,
        type: 'code',
        insertTypeOnEnter: 'paragraph',
      }),
      ContainerNode({
        type: 'infoBox',
        Component: InfoBox,
        nodes: [
          TextNode({
            type: 'infoBoxParagraph',
            marks: [ItalicMark()],
          }),
        ],
      }),
    ],
  }),
  TextNode({
    Component: Headline,
    type: 'headlineBottom',
    marks: [ItalicMark()],
  }),
  TextNode({
    type: 'outside',
    Component: Caption,
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
        plugins={[ActionBarPlugin()]}
        schema={schema}
        value={editorValue}
      />

      <Divider />
      <Container maxWidth="xl">
        <pre>{JSON.stringify(editorValue && editorValue.toJS(), null, 2)}</pre>
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
}))
