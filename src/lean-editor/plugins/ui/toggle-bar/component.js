import React from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'

export const InlineBarComponent = ({ editor, commandTypes }) => {
  const plugins = (editor && editor.props && editor.props.plugins) || []

  return (
    <React.Fragment>
      <ButtonGroup>
        {plugins
          .filter(plugin => plugin.config.toggleCommand)
          .map(plugin => renderButton(editor, plugin))}
      </ButtonGroup>
      <Divider />
    </React.Fragment>
  )

  function renderButton(editor, plugin) {
    const isActive = plugin.config.renderMarks
      ? isActiveMark(editor, plugin.config.schemaType)
      : plugin.renderBlock
      ? isActivBlock(editor, plugin.config.schemaType)
      : false

    return (
      <IconButton
        disabled={!editor}
        color={isActive ? 'primary' : 'default'}
        onClick={e => {
          e.preventDefault()
          editor[plugin.config.toggleCommand]()
        }}
      >
        <plugin.config.icon />
      </IconButton>
    )
  }
}

function isActiveMark(editor, type) {
  return editor && editor.value.activeMarks.some(mark => mark.type === type)
}

function isActivBlock(editor, type) {
  return editor && editor.value.blocks.some(block => block.type === type)
}
