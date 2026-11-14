[English](README.md) | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

# Extension Panel Manager for SillyTavern

Organize the panels on SillyTavern's Extensions settings page by hiding, reordering, and moving them between columns.

## Features

- Show or hide managed panels without uninstalling their extensions.
- Drag panel headers to reorder panels or move them between the two columns.
- Save visibility, order, and column placement in the browser's `localStorage` when you confirm. The saved layout is applied on page load.
- Cancel editing to restore the previous visibility, order, and column placement.

> [!NOTE]
> Managed panels are direct children of the two settings columns that have an ID and contain an inline drawer header. Nested drawers follow their parent panel's visibility. On page load, saved ordering and visibility are applied as panels appear, for up to 15 seconds.

## Installation

1. Open the Extensions panel in SillyTavern and click **Install extension**.
2. Enter `https://github.com/iiimabbie/ST-ExtPanel` and install it.
3. Ensure **Extension Panel Manager** is enabled.

## Usage

1. In the Extensions panel, click **管理面板** next to the install button.
2. Use the checkboxes to set panel visibility; hidden panels appear translucent while editing. Drag headers to arrange panels.
3. Click **儲存** to save, or **取消** to discard the layout changes.

Entering edit mode collapses open drawers; cancelling restores the layout, but not their expanded state.

This project is licensed under [CC BY-NC-SA 4.0](LICENSE).
