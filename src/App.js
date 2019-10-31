import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { Value } from 'slate'

import { Caption, Code, Headline, InfoBox } from './components'
import { LeanEditor } from './lean-editor'
import { ContainerNode, TextNode } from './lean-editor/schema/nodes'
import { BoldMark, ItalicMark } from './lean-editor/schema/marks'
import { ActionBarPlugin } from './lean-editor/plugins'
import initialValue from './value'

// NOTE: The order matters!
const schema = [
  TextNode({
    Component: Headline,
    type: 'headline',
  }),
  ContainerNode({
    nodes: [
      TextNode({
        marks: [BoldMark(), ItalicMark()],
      }),
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
            marks: [ItalicMark()],
          }),
        ],
      }),
    ],
  }),
  TextNode({
    Component: Headline,
    type: 'headline',
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
