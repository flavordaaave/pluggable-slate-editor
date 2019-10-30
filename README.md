## Goals

- [ ] Create schema based on plugins
  - 2 Plugins for marks: `bold` & `italic`
  - 1 Plugin for inline: `link`
  - 1 Plugin for Block that is toggled: `infoBox`
  - 1 Plugin for Block that is added/removed: `image`
  - 1 Plugin that adds keynoard shortcut: `soft-linebreak`
- [x] Dynamically load plugins based on a config
- [x] Allow configuring plugin relations a.k.a plugins within other plugins (e.g. `bold` within `infoBox`)
- [ ] Dynamically build Navigation elements: `Mark` vs. `Inline` vs. `Block`
