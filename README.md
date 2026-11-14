<div align="center">

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

# Extension Panel Manager for SillyTavern

**Tidy up SillyTavern's Extensions page**

Organize panels on SillyTavern's Extensions settings page by hiding, reordering, and moving them between columns. The interface follows SillyTavern's language setting.

![Version](https://img.shields.io/github/manifest-json/v/iiimabbie/ST-ExtPanel?label=version&color=8a5cf6)
![SillyTavern](https://img.shields.io/badge/SillyTavern-extension-e8a87c)
![i18n](https://img.shields.io/badge/i18n-繁中%20·%20简中%20·%20EN-2ea44f)
![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey)

[Features](#features) · [Installation](#installation) · [Usage](#usage)

</div>

## Features

- Show or hide managed panels without uninstalling their extensions.
- Drag panel headers to reorder panels or move them between the two columns.
- Save visibility, order, and column placement in the browser when you confirm. The saved layout is applied on page load.
- Cancel editing to restore the previous visibility, order, and column placement.

> [!NOTE]
> Managed panels are direct children of the two settings columns that have an ID and contain an inline drawer header. Nested drawers follow their parent panel's visibility. On page load, saved ordering and visibility are applied as panels appear, for up to 15 seconds.

## Installation

1. Open **Extensions** in SillyTavern and click **Install extension**.
2. Enter `https://github.com/iiimabbie/ST-ExtPanel` and install it.
3. Ensure **Extension Panel Manager** is enabled.

## Usage

1. In Extensions, click **Manage Panels** next to the install button.
2. Use the checkboxes to set panel visibility; hidden panels appear translucent while editing. Drag headers to arrange panels.
3. Click **Save** to save, or **Cancel** to discard the layout changes.

Entering edit mode collapses open drawers; cancelling restores the layout, but not their expanded state.
