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
- [ ] Add default `normalizer` methods to all plugins (e.g. add empty block if missing according to schema)
