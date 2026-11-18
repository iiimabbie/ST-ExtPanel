<div align="center">

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

# SillyTavern 擴充功能面板管理器

**整理 SillyTavern 的擴充功能頁面**

隱藏、排序及跨欄移動面板，整理 SillyTavern 的擴充功能設定頁面。介面語言會跟隨 SillyTavern 的語言設定。

![Version](https://img.shields.io/github/manifest-json/v/iiimabbie/ST-ExtPanel?label=version&color=8a5cf6)
![SillyTavern](https://img.shields.io/badge/SillyTavern-extension-e8a87c)
![i18n](https://img.shields.io/badge/i18n-繁中%20·%20简中%20·%20EN-2ea44f)
![License](https://img.shields.io/badge/license-CC%20BY--NC--ND%204.0-lightgrey)

[功能](#功能) · [安裝方式](#安裝方式) · [使用方式](#使用方式)

</div>

## 功能

- 顯示或隱藏受管理的面板，不會解除安裝對應的擴充功能。
- 拖曳面板標題，在同一欄調整順序或移動至另一欄。
- 確認後將顯示狀態、順序及欄位位置儲存在瀏覽器中，並於頁面載入時套用。
- 取消編輯可還原先前的顯示狀態、順序及欄位位置。

> [!NOTE]
> 受管理的面板是兩個設定欄位中具有識別碼且包含內嵌抽屜標題的直接子元素。巢狀抽屜的顯示狀態隨父面板變動。頁面載入後最多 15 秒內，面板出現時會套用儲存的順序及顯示狀態。

## 安裝方式

1. 在 SillyTavern 開啟**擴充功能**，點選**安裝擴充功能**。
2. 輸入 `https://github.com/iiimabbie/ST-ExtPanel` 並安裝。
3. 確認已啟用 **Extension Panel Manager**。

## 使用方式

1. 在擴充功能面板中，點選安裝按鈕旁的**管理面板**。
2. 使用核取方塊設定面板顯示狀態；編輯時隱藏的面板會以半透明顯示。拖曳標題調整面板位置。
3. 點選勾號以儲存設定，或點選叉號捨棄版面變更。編輯時會隱藏原生的更新通知、管理與安裝按鈕。

進入編輯模式時會收合已展開的抽屜；取消會還原版面，但不會還原抽屜的展開狀態。
