<div align="center">
  <a href="https://addons.mozilla.org/en-US/firefox/addon/tiktokpure-floating-video/">
    <img src="https://img.shields.io/badge/Firefox%20Add--ons-Get%20Extension-FF6611?style=for-the-badge&logo=firefox&logoColor=white" alt="Firefox Add-ons"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/maxleverup/TiktokPure-Floating-Video/releases/tag/Download">
    <img src="https://img.shields.io/badge/Chrome%20Web%20Store-Get%20Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Web Store"/>
  </a>
</div>
<br/>
# TiktokPure-Floating-Video
TiktokPure Floating Video is a Firefox extension that lets users watch TikTok through a floating panel overlaid on any website currently open in the browser — without switching tabs.
<div align="center">

<img src="https://github.com/user-attachments/assets/b99bba86-d6e2-4f7e-b2c1-663b5251f36d" alt="TiktokPure Logo" width="200" height="200">

<br/>
<br/>

<b>Pure TikTok video · Float anywhere</b>

<br/>

<i>A Firefox extension that floats TikTok as a clean, resizable , draggable panel on any webpage</i>

<br/>
<br/>

[📦 Install Instrucsion](#installation) · [✨ Features](#features) · [🖼️ Screenshots](#screenshots) · [⚙️ Settings](#settings) 

</div>

---

## 📖 Overview

**TiktokPure Floating Video** embeds TikTok inside a floating, resizable panel injected into any browser tab. It strips away all distracting UI — sidebars, action bars, captions, ads, CapCut banners — leaving only the pure video content in a clean mobile-style view.

> 💡 **Use case:** Watch TikTok alongside your work, study, or any other webpage — without switching tabs.

---

## ✨ Features

### 🎯 Floating Panel
- **Drag** from top/sides, **resize** from all 8 edges & corners
- **F8 shortcut** to instantly show/hide the panel
- Panel position & size **auto-saved** per-tab via `browser.storage.sync`
- Smooth **slide-in animation** with backdrop blur & rounded corners

### 🧹 Clean UI (Mobile View)
- Removes sidebar, header, navigation bar, action bar (like/comment/share/save)
- Hides music disc, avatar, scrollbars, volume controls, swipe arrows
- Strips all **video player controls**: progress bar, seek bar, xgplayer UI, gradients, overlay masks
- Expands video to **100% width** for a pure fullscreen feel

### ✨ Clean Mode
Aggressively removes non-video content:

| Removed Element | Examples |
|---|---|
| User info | Username, avatar, nick name |
| Video metadata | Captions, hashtags, descriptions |
| Promotional | CapCut banners, paid partnership, ad labels |
| Interactive overlays | Location tags, sticker tags, effect tags, watermarks |
| Player UI | Control bars, top/bottom bars, progress containers |
| Third-party | Creator cards, template entries, app entries |



### 🔇 Audio Controls
- **Mute / Unmute** toggle — yellow indicator when muted
- **Auto Mute** — mutes when panel is hidden, unmutes on reveal
- **Background Play** — overrides `document.hidden` & `visibilityState` so TikTok audio continues in background tabs
- **Auto-pause TikTok** when another tab produces audio (polls every 2s)
- **Auto-unmute watcher** — detects & clicks TikTok's native mute button if video is silenced

### 🔍 In-Panel Navigation
- **Home** → For You feed (`/foryou`)
- **Profile** → Your TikTok profile
- **Search** — inline input box, press `Enter` to search, `Escape` to cancel
- Loading **spinner overlay** on page transitions

### ⚙️ Settings Panel
- Background Play toggle
- Auto Mute toggle  
- Stealth Mode — hides the toggle button (F8 only access)
- Clean Mode toggle
- 🌙 / ☀️ Dark / Light theme for popup

---

## 🖼️ Screenshots

<table>
  <tr>
    <td width="50%" align="center">
      <b>🏬 Extension on Store</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/c65b6dfb-dbd8-48f8-a8e8-813835b15c7c" width="100%" alt="On Store"/>
    </td>
    <td width="50%" align="center">
      <b>✨ Floating Window & Toggle Button</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/42dcace9-570b-4dcf-965f-5b2b480aa3f2" width="100%" alt="Floating Window"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <b>⚙️ Control Bar Settings Panel</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/a2c3302b-e4e1-40bb-b869-5d4e880e3268" width="100%" alt="Control Bar Settings"/>
    </td>
    <td width="50%" align="center">
      <b>⚙️ Popup Settings Panel</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/802b15cd-a13a-41b9-a0df-be069fef0bee" width="100%" alt="Popup Settings"/>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <b>🧹 Clean Mode</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/4d71af36-18b3-4433-b976-6cfdd6f15ed6" width="100%" alt="Clean Mode"/>
    </td>
    <td width="50%" align="center">
      <b>🕵️ Stealth Mode</b><br/><br/>
      <img src="https://github.com/user-attachments/assets/d894530c-5dab-4c0f-8f93-06c52aefba69" width="100%" alt="Stealth Mode"/>
    </td>
  </tr>
</table>





## 📦 Installation

### Firefox (Recommended)

> Install directly from the official Firefox Add-ons store:

[![Firefox Add-ons](https://img.shields.io/badge/Firefox%20Add--ons-Install%20Now-FF6611?style=for-the-badge&logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/tiktokpure-floating-video/)

---

### Chrome / Chromium-based Browsers (Manual)

> Chrome Web Store not available — install manually via Developer Mode.

```bash
# Step 1: Go to the Releases page and download the latest .zip
# Step 2: Unzip the downloaded file to a folder
# Step 3: Open Chrome and navigate to
chrome://extensions/

# Step 4: Enable "Developer Mode" (toggle — top right corner)
# Step 5: Click "Load unpacked"
# Step 6: Select the unzipped folder → Done ✅
```

> ✅ Works on: Chrome · Edge · Brave · Opera · Vivaldi · Arc

---


### Requirements

| Browser | Minimum Version |
|---|---|
| Firefox | `140.0+` |
| Firefox Android | `142.0+` |
| Chrome / Chromium | `Latest stable` |
