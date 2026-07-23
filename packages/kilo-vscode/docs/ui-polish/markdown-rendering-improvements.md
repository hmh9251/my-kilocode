# Markdown Rendering Improvements

**Status:** Resolved

Headings `h1`–`h6` now render with a stepped scale of font sizes, weights, and margins scoped to the markdown content area. Lists, blockquotes, horizontal rules, and inline emphasis also receive distinct styling that follows the active VS Code theme.

## What Changed

- Added scoped heading rules in `packages/kilo-ui/src/components/markdown.css`.
- Verified across light, dark, and high-contrast VS Code themes via the existing `--vscode-*` CSS variable bridge.
- Improved visual rhythm for bullet lists, numbered lists, blockquotes, horizontal rules, bold, italic, and inline code.
