export function getPluginForNode(editor, node) {
  const allPlugins = editor.props.plugins

  return allPlugins.find(
    plugin =>
      plugin.config && plugin.config.type && plugin.config.type === node.type
  )
}
