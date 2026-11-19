# Caido Themes

Change Caido's colors for the light and dark appearance, from the page background down to the editor's syntax colors.

![The Themes page with a theme open in the editor](assets/screenshot.png)

## Requirements

Caido 0.60 or later. Themes created with an earlier version of the plugin are migrated automatically the first time it starts.

## Theme format

A theme sets Caido's design tokens, separately for the light and dark appearance. The editor groups them into backgrounds, text, borders, accent, buttons and editor syntax. Colors must be hex values.

A color that is left out keeps Caido's own value, or follows a related color from the theme, such as hover following the background.

```json
{
  "version": 2,
  "name": "Ocean Blue",
  "description": "For when you want your screen to look like a fish tank",
  "author": "bebiks",
  "tokens": {
    "--color-surface-page": { "light": "#eef8ff", "dark": "#18293a" },
    "--color-fg-secondary": { "light": "#005d8b", "dark": "#77c2f5" }
  }
}
```

Themes exported by earlier versions of the plugin can still be imported.

## Installation

### From the Community Store

1. Open Caido and go to the **Plugins** page.
2. Find **Caido Themes** and click **Install**.

### Manually

1. Download `plugin_package.zip` from the latest release on the [releases page](https://github.com/caido-community/CaidoThemes/releases).
2. Open Caido and go to the **Plugins** page.
3. Click **Install Package** and select the downloaded file.

## Contributing

If you have any ideas or suggestions, please open an issue or submit a pull request.
