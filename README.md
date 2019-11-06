[Demo](https://slate-poc.flavordaaave.now.sh)

## Setup & run

```
yarn
yarn start
```

## Goals

- [x] 2 Plugins for marks: `bold` & `italic`
- [x] 1 Plugin for inline: `link`
- [x] 1 Plugin for Block that is toggled: `infoBox`
- [x] 1 Plugin for Block that is added/removed: `image`
- [x] Dynamically load plugins based on a config
- [x] Allow configuring plugin relations a.k.a plugins within other plugins (e.g. `bold` within `infoBox`)
- [x] Dynamically build Navigation elements: `Mark` vs. `Inline` vs. `Block` & `toggle` vs `add`
- [x] Render placeholders if required
- [x] Allow `min`/`max` config option for the amount of nodes within a `ContainerNode`
- [x] Allow `min/max` for root(document) nodes
- [x] Use default `normalizer` in all plugins (e.g. add empty block if missing according to schema)
- [ ] Add configProp to `ContainerNode` that ensures a default node type is always inserted between blocks
- [ ] Test for plugins & normalizer

## Known issues

- Toggle commands are shown even though NO text is selected (selection is collapsed)
- If the selection is expanded over multiple blocks (e.g. `paragraph` AND `infoBox`) the toolbar shows valid commands for the FIRST node in the selection instead of only the commands that are valid accross ALL selected nodes
- If selection is expanded over text that (partially) already includes marks AND any mark is toggled, the selection moves to an unexpected position

## Limitations

- SlateJS currently does not allow to specify the amount of appearance of a specific block type within a container node (e.g. max 2 `infoBox` nodes within `body`)
