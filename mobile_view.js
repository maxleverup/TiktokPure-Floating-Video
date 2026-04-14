// TikTok Mobile View v1.1.0 — 9:16 fixed ratio, all-edge resize
(function () {
  'use strict';
  if (window.__tptMobileViewLoaded) return;
  window.__tptMobileViewLoaded = true;
  if (location.hostname.includes('tiktok.com')) return;

  // ── Constants ─────────────────────────────────────────────────────────────────
  const IFRAME_W = 410;
  const IFRAME_H = 715;
  const TIKTOK_SIDEBAR_W = 0;   // sidebar overlays on top of video — show full 420px width
  const VIDEO_CONTENT_W  = IFRAME_W;  // full iframe width visible
  const TOP_CROP    = 54;  // px to hide TikTok top tab-bar chrome (space left after display:none)
  const BOTTOM_CROP = 50;   // px to hide TikTok bottom padding
  const VISIBLE_H   = IFRAME_H - TOP_CROP - BOTTOM_CROP;  // 730px of actual video content
  const RATIO    = VIDEO_CONTENT_W / VISIBLE_H;  // 420/730 ≈ 0.575 (close to 9:16)
  const BAR_H    = 0;        // action bar height px
  const MIN_VW   = 160;       // minimum video-area width px
  const MAX_VW_FRAC = 0.92;   // max fraction of viewport width
  const X_ZOOM = 1.25;        // horizontal zoom to crop right gutter (increase if gutter remains; decrease if crop too much)
  const X_BIAS = 0.0;         // crop bias: 0.0 = crop right side more; 0.5 = crop both sides equally
  const LEFT_CROP = 22;        // px (in iframe native coords) to shift iframe left so video content touches left edge

  const TIKTOK_URL = 'https://www.tiktok.com/foryou?is_from_webapp=1&sender_device=mobile';

  // ── State ─────────────────────────────────────────────────────────────────────
  let panelEnabled     = false;
  let panelVisible     = false;
  let iframeReady      = false;
  let bgPlayEnabled    = false;
  let autoMuteEnabled  = false;
  let stealthEnabled   = false;
  let cleanModeEnabled = false;
  let cleanModeBeforeSearch = false;
  let searchModeActive = false;
  let isMuted          = false;
  let videoW           = IFRAME_W; // current video-area width (only variable we track)
  let _tabId           = null; // Tab ID riêng cho tùng tab

  // ---- Tab-specific storage helpers ----
  function _getPanelOpenKey() {
    return _tabId ? ('mobileViewOpen_' + _tabId) : null;
  }

  function _savePanelOpen(val) {
    const key = _getPanelOpenKey();
    if (!key) return;
    try { chrome.storage.sync.set({ [key]: val }); } catch(e) {}
  }

  function relayToTikTok(payload) {
    try { chrome.runtime.sendMessage({ type: 'MOBILE_VIEW_RELAY', payload }); } catch(e) {}
  }
  function applyCleanModeOverlay(enable) {
      cleanModeEnabled = enable;
      try { chrome.runtime.sendMessage({ type: 'CLEAN_MODE_RELAY', enable }); } catch(e) {}
  }

  function _getCleanModeItem() {
      return document.getElementById('tpt-dots-cleanmode');
  }

  function _disableCleanModeBtn() {
      const item = _getCleanModeItem();
      if (item) item.classList.add('disabled', 'search-suppressed');
      _lockCleanModeRow(); // Thêm dòng này
  }

  function _enableCleanModeBtn() {
      const item = _getCleanModeItem();
      if (item) item.classList.remove('disabled', 'search-suppressed');
      _unlockCleanModeRow(); // Thêm dòng này
  }

  function enterSearchMode() {
      if (searchModeActive) return;
      searchModeActive = true;
      cleanModeBeforeSearch = cleanModeEnabled;
      if (cleanModeEnabled) {
          cleanModeEnabled = false;
          try { chrome.storage.sync.set({ cleanMode: false, cleanModeSuppressed: true }); } catch(e) {}
          try { chrome.runtime.sendMessage({ type: 'CLEAN_MODE_RELAY', enable: false }); } catch(e) {}
          try { chrome.runtime.sendMessage({
              type: 'MOBILE_VIEW_BROADCAST',
              enabled: panelEnabled, bgPlay: bgPlayEnabled,
              autoMute: autoMuteEnabled, stealth: stealthEnabled,
              cleanMode: false
          }); } catch(e) {}
      } else {
          try { chrome.storage.sync.set({ cleanModeSuppressed: true }); } catch(e) {}
      }
      _disableCleanModeBtn();
      _syncDotsCleanMode();
  }

  // Thoát search mode khi hủy tìm kiếm (Esc, ấn kính lúp lần 2, hoặc bất kỳ cách nào khác)
  function exitSearchModeCancel() {
      if (!searchModeActive) return;
      searchModeActive = false;
      _restoreCleanModeFromTemp();
  }

  function exitSearchModeByHome() {
      if (!searchModeActive) return;
      searchModeActive = false;
      _restoreCleanModeFromTemp();
  }

  function _restoreCleanModeFromTemp() {
      try { chrome.storage.sync.remove('cleanModeSuppressed'); } catch(e) {}
      _enableCleanModeBtn();
      if (cleanModeBeforeSearch) {
          cleanModeEnabled = true;
          try { chrome.storage.sync.set({ cleanMode: true }); } catch(e) {}
          try { chrome.runtime.sendMessage({ type: 'CLEAN_MODE_RELAY', enable: true }); } catch(e) {}
          try { chrome.runtime.sendMessage({
              type: 'MOBILE_VIEW_BROADCAST',
              enabled: panelEnabled, bgPlay: bgPlayEnabled,
              autoMute: autoMuteEnabled, stealth: stealthEnabled,
              cleanMode: true
          }); } catch(e) {}
      }
      cleanModeBeforeSearch = false;
      _syncDotsCleanMode();
  }

  function _syncDotsCleanMode() {
    const item = document.getElementById('tpt-dots-cleanmode');
    if (item) item.classList.toggle('active', cleanModeEnabled);
  }

  function suppressCleanModeForSearch() {
      if (!cleanModeEnabled) return;
      cleanModeSuppressedBySearch = true;
      try { chrome.runtime.sendMessage({ type: 'CLEAN_MODE_RELAY', enable: false }); } catch(e) {}
  }

  function restoreCleanModeAfterSearch() {
      if (!cleanModeSuppressedBySearch) return;
      cleanModeSuppressedBySearch = false;
      if (cleanModeEnabled) {
          try { chrome.runtime.sendMessage({ type: 'CLEAN_MODE_RELAY', enable: true }); } catch(e) {}
      }
  }

  // ── Styles ────────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #tpt-mv-toggle {
      position: fixed; right: 0; top: 50%;
      transform: translateY(-50%);
      width: 30px; height: 64px;
      background: linear-gradient(160deg, #f5f0e8, #ede8df); /* kem */
      border-radius: 10px 0 0 10px;
      cursor: pointer; z-index: 2147483646;
      display: none; flex-direction: column;
      align-items: center; justify-content: center; gap: 3px;
      box-shadow: -3px 2px 16px rgba(122,158,126,0.35); /* shadow matcha */
      user-select: none; transition: width 0.18s;
      border: 1px solid rgba(122,158,126,0.25); /* viền matcha nhạt */
      border-right: none;
    }
    #tpt-mv-toggle:hover { 
      background: linear-gradient(160deg, #ede8df, #ddd8cf); /* kem đậm hơn khi hover */
    }
    #tpt-mv-toggle .tpt-mv-arrow {
      width: 0; height: 0;
      border-top: 4px solid transparent; 
      border-bottom: 4px solid transparent;
      border-right: 6px solid #7a9e7e; /* mũi tên matcha */
      transition: transform 0.2s;
    }
    #tpt-mv-toggle.open .tpt-mv-arrow { transform: rotate(180deg); }

    /* Panel — size set entirely by JS */
    #tpt-mv-panel {
      position: fixed; right: 0; top: 50%;
      transform: translateY(-50%);
      z-index: 2147483645;
      border-radius: 16px;
      box-shadow: -6px 0 40px rgba(0,0,0,0.55), -2px 0 8px rgba(254,44,85,0.15);
      display: none; flex-direction: column;
      border: 1px solid rgba(255,255,255,0.08);
      background: #000;
      overflow: visible;
      user-select: none;
    }
    #tpt-mv-panel.tpt-mv-visible {
      display: flex !important;
      animation: tpt-mv-in 0.25s ease;
    }
    @keyframes tpt-mv-in {
      from { opacity: 0; transform: translateY(-50%) translateX(30px); }
      to   { opacity: 1; transform: translateY(-50%) translateX(0); }
    }

    /* Video area — strict 9:16, size set by JS */
    #tpt-mv-iframe-wrap {
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
      border-radius: 14px;
      background: #000;
      isolation: isolate;
      overscroll-behavior: contain;
      touch-action: pan-y;
    }

    /* Drag handle — top */
    #tpt-mv-drag {
      position: absolute; top: 0; left: 0; right: 0;
      height: 18px; cursor: move; z-index: 15; user-select: none;
    }
    /* Drag strips — left, right, bottom inner zones */
    #tpt-mv-drag-left {
      position: absolute; top: 18px; left: 0; bottom: 18px;
      width: 10px; cursor: move; z-index: 15; user-select: none;
    }
    #tpt-mv-drag-right {
      position: absolute; top: 18px; right: 0; bottom: 14px;
      width: 10px; cursor: move; z-index: 15; user-select: none;
    }
    #tpt-mv-drag-bottom {
      position: absolute; bottom: 0; left: 18px; right: 18px;
      height: 18px; cursor: move; z-index: 15; user-select: none;
    }

    /* iframe — always 420x792, scaled by JS */
    #tpt-mv-iframe {
      border: none; display: block;
      width: ${IFRAME_W}px; height: ${IFRAME_H}px;
      transform-origin: top left;
      position: absolute; top: 0; left: 0;
      pointer-events: all;
    }
    #tpt-mv-panel.tpt-dragging  #tpt-mv-iframe,
    #tpt-mv-panel.tpt-resizing  #tpt-mv-iframe { pointer-events: none; }

    /* Action bar */
    #tpt-mv-bar {
      display: none;
      height: 0;
      overflow: hidden;
    }
    .tpt-mv-btn {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 3px;
      background: none; border: none;
      color: rgba(255,255,255,0.75); cursor: pointer;
      padding: 8px 12px; border-radius: 9px;
      transition: background 0.13s, color 0.13s, transform 0.08s;
      font-family: -apple-system, system-ui, sans-serif;
      min-width: 60px;
    }
    .tpt-mv-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .tpt-mv-btn:active { transform: scale(0.85); background: rgba(255,255,255,0.15); }
    .tpt-mv-btn span { font-size: 10px; font-weight: 600; margin-top: 2px; }
    .tpt-mv-sep { width: 1px; height: 28px; background: rgba(255,255,255,0.1); flex-shrink: 0; }
    .tpt-mv-btn.active  { color: #fe2c55; background: rgba(254,44,85,0.12); }
    .tpt-mv-btn.muted-on { color: #ffd60a; }

    /* Overlay buttons */
    #tpt-mv-overlay-actions {
      position: absolute; right: 8px; bottom: 8px;
      z-index: 20; display: none; flex-direction: column;
      align-items: center; gap: 12px; pointer-events: none;
    }
    #tpt-mv-panel.tpt-mv-visible #tpt-mv-overlay-actions { display: flex; }
    .tpt-ov-btn {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      background: rgba(0,0,0,0.55); backdrop-filter: blur(8px);
      border: none; border-radius: 50px; width: 42px;
      color: #fff; cursor: pointer; pointer-events: all;
      transition: transform 0.12s, background 0.12s;
      justify-content: center; padding: 7px 0 5px;
    }
    .tpt-ov-btn:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); }
    .tpt-ov-btn:active { transform: scale(0.88); }
    .tpt-ov-btn span { font-size: 9px; font-weight: 700; line-height: 1; }
    .tpt-ov-btn.ov-liked svg { stroke: #fe2c55; fill: #fe2c55; }
    .tpt-ov-btn.ov-liked span { color: #fe2c55; }
    .tpt-ov-btn.ov-active { background: rgba(254,44,85,0.4); }

    /* 3-dot dropdown */
    #tpt-mv-dots-menu {
      position: absolute; top: 58px; right: 10px;
      background: rgba(20,20,20,0.97); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
      z-index: 100; min-width: 160px; display: none; flex-direction: column;
      overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }
    #tpt-mv-dots-menu.open { display: flex; }
    .tpt-dots-item {
      padding: 10px 14px; font-size: 12px; color: rgba(255,255,255,0.88);
      cursor: pointer; display: flex; align-items: center; gap: 8px;
      border: none; background: none; text-align: left;
      font-family: -apple-system, system-ui, sans-serif;
      transition: background 0.12s;
    }
    .tpt-dots-item:hover { background: rgba(255,255,255,0.08); }
    .tpt-dots-item.active { color: #fe2c55; }
  .tpt-dots-item.disabled {
    opacity: 0.35;
    pointer-events: none;
    cursor: not-allowed;
  }
  .tpt-dots-item.search-suppressed::after {
    content: ' (search mode)';
    font-size: 9px;
    color: rgba(255,255,255,0.35);
  }
    .tpt-dots-sep { height: 1px; background: rgba(255,255,255,0.08); margin: 2px 0; }

    /* ── Resize hot-zones (invisible edges + corners) ── */
    .tpt-edge { position: absolute; z-index: 40; }
    /* Left edge */
    .tpt-edge-l  { left:-6px; top:14px; bottom:57px; width:12px; cursor:ew-resize; }
    /* Right edge */
    .tpt-edge-r  { right:-6px; top:14px; bottom:14px; width:12px; cursor:ew-resize; }
    /* Top edge */
    .tpt-edge-t  { top:-6px; left:14px; right:14px; height:12px; cursor:ns-resize; }
    /* Bottom edge (sits above bar) */
    .tpt-edge-b  { bottom:0; left:14px; right:0; height:12px; cursor:ns-resize; }
    /* Corners */
    .tpt-edge-tl { top:-6px; left:-6px; width:20px; height:20px; cursor:nwse-resize; }
    .tpt-edge-tr { top:-6px; right:-6px; width:20px; height:20px; cursor:nesw-resize; }
    .tpt-edge-bl { bottom:0; left:-6px; width:20px; height:20px; cursor:nesw-resize; }
    .tpt-edge-br { bottom:0; right:-6px; width:20px; height:20px; cursor:nwse-resize; }
    /* Visual hint on bottom-left corner — removed */
    .tpt-edge-bl::after { display: none !important; }
    .tpt-edge-bl:hover::after { display: none !important; }
    #tpt-mv-mini-actions {
      position: absolute;
      bottom: 10px;
      right: -44px;
      z-index: 60;
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      pointer-events: none;
    }
    #tpt-mv-panel.tpt-mv-visible #tpt-mv-mini-actions { display: flex; }
    .tpt-mini-btn {
      display: flex; align-items: center; justify-content: center;
      width: 30px; height: 30px;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(8px);
      border: none; border-radius: 50%;
      color: rgba(255,255,255,0.85);
      cursor: pointer; pointer-events: all;
      transition: background 0.15s, transform 0.1s;
      flex-shrink: 0;
    }
    .tpt-mini-btn:hover { background: rgba(0,0,0,0.82); transform: scale(1.12); }
    .tpt-mini-btn:active { transform: scale(0.88); }
    .tpt-mini-btn svg { display: block; }
    .tpt-mini-btn.muted-on { color: #ffd60a; background: rgba(0,0,0,0.7); }
    #tpt-mv-ctrl-bar {
      position: absolute;
      z-index: 50;
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 6px;
      background: rgba(18,18,18,0.92);
      backdrop-filter: blur(12px);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.10);
      box-shadow: 0 4px 24px rgba(0,0,0,0.45);
      pointer-events: all;
      transition: opacity 0.2s;
      bottom: 10px;
      left: calc(100% + 8px);
      top: auto;
      right: auto;
    }
    .tpt-ctrl-btn {
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px;
      background: rgba(255,255,255,0.08);
      border: none; border-radius: 50%;
      color: rgba(255,255,255,0.85);
      cursor: pointer;
      transition: background 0.15s, transform 0.1s, color 0.15s;
      flex-shrink: 0;
    }
    .tpt-ctrl-btn:hover { background: rgba(255,255,255,0.18); transform: scale(1.1); }
    .tpt-ctrl-btn:active { transform: scale(0.88); }
    .tpt-ctrl-btn svg { display: block; pointer-events: none; }
    .tpt-ctrl-btn.muted-on { color: #ffd60a; }
    #tpt-ctrl-sep {
      width: 20px; height: 1px;
      background: rgba(255,255,255,0.12);
      flex-shrink: 0;
    }
    #tpt-ctrl-search-wrap {
      display: none;
      flex-direction: column;
      align-items: stretch;
      width: 180px;
      padding: 6px 8px;
      background: rgba(18,18,18,0.97);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.13);
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      position: absolute;
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
    }
    #tpt-ctrl-search-wrap.open {
      display: flex;
    }
    #tpt-ctrl-search-input {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      color: #fff;
      font-size: 12px;
      font-family: -apple-system, system-ui, sans-serif;
      padding: 7px 10px;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.15s;
    }
    #tpt-ctrl-search-input::placeholder {
      color: rgba(255,255,255,0.35);
      font-style: italic;
    }
    #tpt-ctrl-search-input:focus {
      border-color: rgba(254,44,85,0.6);
    }
    #tpt-ctrl-search-hint {
      font-size: 10px;
      color: rgba(255,255,255,0.3);
      text-align: center;
      margin-top: 5px;
      font-family: -apple-system, system-ui, sans-serif;
    }

    #tpt-mv-iframe {
      border-radius: 0;
    }
    #tpt-mv-panel.tpt-mv-visible #tpt-mv-iframe-wrap {
      -webkit-mask-image: -webkit-radial-gradient(white, black);
      mask-image: radial-gradient(white, black);
    }

    /* ── Settings Window ── */
    #tpt-settings-win {
      position: fixed;
      z-index: 2147483647;
      background: rgba(14,14,20,0.97);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(254,44,85,0.08);
      width: 260px;
      padding: 0;
      display: none;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
      top: 0;
      left: 0;
    }
    .tpt-sw-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px 10px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      background: linear-gradient(160deg,rgba(254,44,85,0.10),transparent 70%);
    }
    .tpt-sw-title {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tpt-sw-title svg { flex-shrink: 0; }
    .tpt-sw-close {
      width: 22px; height: 22px;
      background: rgba(255,255,255,0.08);
      border: none; border-radius: 50%;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, color 0.15s;
      flex-shrink: 0;
    }
    .tpt-sw-close:hover { background: rgba(254,44,85,0.3); color: #fff; }
    .tpt-sw-body { padding: 8px 0; }
    .tpt-sw-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      gap: 10px;
    }
    .tpt-sw-row:last-child { border-bottom: none; }
    .tpt-sw-info { flex: 1; min-width: 0; }
    .tpt-sw-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tpt-sw-desc {
      display: block;
      font-size: 10px;
      color: rgba(255,255,255,0.38);
      line-height: 1.4;
    }
    .tpt-sw-toggle { flex-shrink: 0; cursor: pointer; }
    .tpt-sw-toggle input { display: none; }
    .tpt-sw-track {
      display: block;
      width: 36px; height: 20px;
      background: rgba(255,255,255,0.15);
      border-radius: 20px;
      position: relative;
      transition: background 0.2s;
    }
    .tpt-sw-thumb {
      position: absolute;
      top: 3px; left: 3px;
      width: 14px; height: 14px;
      background: rgba(245,240,232,0.7);  /* kem nhạt khi OFF */
      border-radius: 50%;
      transition: transform 0.2s, background 0.2s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }
    .tpt-sw-toggle input:checked + .tpt-sw-track { background: #7a9e7e !important; }
    .tpt-sw-toggle input:checked + .tpt-sw-track .tpt-sw-thumb {
      transform: translateX(16px);
      background: #f5f0e8;
    }
    .tpt-ctrl-btn.settings-open {
      background: rgba(122,158,126,0.25);
      color: #7a9e7e;
    }
    #tpt-settings-win.open {
      display: flex;
    }

    /* ── Transition Overlay ── */
    #tpt-mv-transition-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #000;
      z-index: 9999;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      gap: 12px;
    }
    #tpt-mv-transition-overlay.active {
      display: flex;
    }
    #tpt-mv-transition-overlay .tpt-ov-spinner {
      width: 28px; height: 28px;
      border: 3px solid rgba(255,255,255,0.15);
      border-top-color: #fe2c55;
      border-radius: 50%;
      animation: tpt-spin 0.7s linear infinite;
    }
    #tpt-mv-transition-overlay .tpt-ov-text {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      font-family: -apple-system, system-ui, sans-serif;
    }
    @keyframes tpt-spin {
      to { transform: rotate(360deg); }
    }

    /* Clean Mode lock overlay trong settings */
    .tpt-sw-row.cleanmode-locked {
      position: relative;
    }
    .tpt-sw-row.cleanmode-locked::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.45);
      border-radius: 8px;
      z-index: 10;
      pointer-events: all;
      cursor: not-allowed;
    }
    .tpt-cleanmode-lock-icon {
      display: none;
      color: #fe2c55;
      flex-shrink: 0;
    }
    .tpt-sw-row.cleanmode-locked .tpt-cleanmode-lock-icon {
      display: inline-flex;
      align-items: center;
    }
  `;
  document.head.appendChild(style);

  // ── Toggle button ─────────────────────────────────────────────────────────────
  const toggleBtn = document.createElement('div');
  toggleBtn.id = 'tpt-mv-toggle';
  toggleBtn.title = 'TikTok Mobile View (F8)';
  toggleBtn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#7a9e7e">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5
               2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01
               a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34
               6.34 6.34 0 0 0 6.33-6.34V9.15a8.16 8.16 0 0 0 4.77 1.52V7.22a4.85 4.85 0 0 1-1-.53z"/>
    </svg>
    <div class="tpt-mv-arrow"></div>
  `;

  // ── Build panel DOM ───────────────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = 'tpt-mv-panel';

  const iframeWrap = document.createElement('div');
  iframeWrap.id = 'tpt-mv-iframe-wrap';

  const drag = document.createElement('div');
  drag.id = 'tpt-mv-drag';

  const dragLeft = document.createElement('div');
  dragLeft.id = 'tpt-mv-drag-left';

  const dragRight = document.createElement('div');
  dragRight.id = 'tpt-mv-drag-right';

  const dragBottom = document.createElement('div');
  dragBottom.id = 'tpt-mv-drag-bottom';

  const iframe = document.createElement('iframe');
  iframe.id = 'tpt-mv-iframe';
  iframe.src = 'about:blank';
  iframe.allow = 'autoplay; fullscreen; clipboard-write; picture-in-picture';

  iframeWrap.appendChild(drag);
  iframeWrap.appendChild(dragLeft);
  iframeWrap.appendChild(dragRight);
  iframeWrap.appendChild(dragBottom);
  iframeWrap.appendChild(iframe);

  const overlayActions = document.createElement('div');
  overlayActions.id = 'tpt-mv-overlay-actions';
  overlayActions.innerHTML = ``;

  iframeWrap.appendChild(overlayActions);

  const transitionOverlay = document.createElement('div');
  transitionOverlay.id = 'tpt-mv-transition-overlay';
  transitionOverlay.innerHTML = `
    <div class="tpt-ov-spinner"></div>
    <div class="tpt-ov-text">Redirecting...</div>
  `;
  iframeWrap.appendChild(transitionOverlay);

  const dotsMenu = document.createElement('div');
  dotsMenu.id = 'tpt-mv-dots-menu';
  dotsMenu.innerHTML = `
    <button class="tpt-dots-item" id="tpt-dots-reload">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      Reload TikTok
    </button>
    <div class="tpt-dots-sep"></div>
    <button class="tpt-dots-item" id="tpt-dots-cleanmode">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      Clean Mode
    </button>
    <div class="tpt-dots-sep"></div>
    <button class="tpt-dots-item" id="tpt-dots-close">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      Close Panel
    </button>
  `;
  iframeWrap.appendChild(dotsMenu);

  const bar = document.createElement('div');
  bar.id = 'tpt-mv-bar';

  const ctrlBar = document.createElement('div');
  ctrlBar.id = 'tpt-mv-ctrl-bar';
  ctrlBar.innerHTML = `
    <button class="tpt-ctrl-btn" id="tpt-ctrl-settings" title="Settings">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
          a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
          A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
          l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
          A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
          l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
          a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
          l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
          a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    </button>
    <div style="width:20px;height:1px;background:rgba(255,255,255,0.12);flex-shrink:0;"></div>
    <button class="tpt-ctrl-btn" id="tpt-ctrl-home" title="Home / For You">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </button>
    <div style="width:20px;height:1px;background:rgba(255,255,255,0.12);flex-shrink:0;"></div>
    <button class="tpt-ctrl-btn" id="tpt-ctrl-profile" title="Profile">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </button>
    <div style="width:20px;height:1px;background:rgba(255,255,255,0.12);flex-shrink:0;"></div>
    <div style="position:relative; display:flex; align-items:center; justify-content:center;">
      <div id="tpt-ctrl-search-wrap">
        <input id="tpt-ctrl-search-input" type="text"
          placeholder="Type and press Enter to search" autocomplete="off" spellcheck="false"/>
        <div id="tpt-ctrl-search-hint">Press Enter to search · Esc to close</div>
      </div>
      <button class="tpt-ctrl-btn" id="tpt-ctrl-search" title="Search TikTok">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
    </div>
    <div style="width:20px;height:1px;background:rgba(255,255,255,0.12);flex-shrink:0;"></div>
    <button class="tpt-ctrl-btn" id="tpt-ctrl-mute" title="Mute/Unmute">
      <svg id="tpt-ctrl-mute-icon" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>
    </button>
    <div style="width:20px;height:1px;background:rgba(255,255,255,0.12);flex-shrink:0;"></div>
    <button class="tpt-ctrl-btn" id="tpt-ctrl-close" title="Close panel">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  // ── Settings Window ───────────────────────────────────────────────────────
  const settingsWin = document.createElement('div');
  settingsWin.id = 'tpt-settings-win';
  // Use DOM API instead of innerHTML for CSP compliance
function _buildSettingsWin() {
  // Clear existing content
  settingsWin.innerHTML = '';
  
  // Header
  const header = document.createElement('div');
  header.className = 'tpt-sw-header';

  const title = document.createElement('div');
  title.className = 'tpt-sw-title';
  title.textContent = 'Panel Settings';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'tpt-sw-close';
  closeBtn.id = 'tpt-sw-close-btn';
  closeBtn.setAttribute('aria-label', 'Close settings');

  // Close icon SVG - safe DOM creation
  const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeSvg.setAttribute('width', '10');
  closeSvg.setAttribute('height', '10');
  closeSvg.setAttribute('viewBox', '0 0 24 24');
  closeSvg.setAttribute('fill', 'none');
  closeSvg.setAttribute('stroke', 'currentColor');
  closeSvg.setAttribute('stroke-width', '2.8');
  closeSvg.setAttribute('stroke-linecap', 'round');
  closeSvg.setAttribute('stroke-linejoin', 'round');
  
  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', '18');
  line1.setAttribute('y1', '6');
  line1.setAttribute('x2', '6');
  line1.setAttribute('y2', '18');
  
  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line2.setAttribute('x1', '6');
  line2.setAttribute('y1', '6');
  line2.setAttribute('x2', '18');
  line2.setAttribute('y2', '18');
  
  closeSvg.appendChild(line1);
  closeSvg.appendChild(line2);
  closeBtn.appendChild(closeSvg);

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Body
  const body = document.createElement('div');
  body.className = 'tpt-sw-body';

  // Helper function to create rows
  function makeRow(id, label, desc, rowId) {
    const row = document.createElement('div');
    row.className = 'tpt-sw-row';
    if (rowId) row.id = rowId;

    const info = document.createElement('div');
    info.className = 'tpt-sw-info';

    const labelEl = document.createElement('span');
    labelEl.className = 'tpt-sw-label';
    labelEl.textContent = label;

    const descEl = document.createElement('span');
    descEl.className = 'tpt-sw-desc';
    descEl.textContent = desc;

    info.appendChild(labelEl);
    info.appendChild(descEl);

    const toggle = document.createElement('label');
    toggle.className = 'tpt-sw-toggle';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;

    const track = document.createElement('span');
    track.className = 'tpt-sw-track';

    const thumb = document.createElement('span');
    thumb.className = 'tpt-sw-thumb';

    track.appendChild(thumb);
    toggle.appendChild(input);
    toggle.appendChild(track);

    row.appendChild(info);
    row.appendChild(toggle);

    return row;
  }

  // Create rows
  const rowBgPlay = makeRow(
    'tsw-bgplay',
    'Background Play',
    'Keep audio playing when switching tabs'
  );
  const rowAutoMute = makeRow(
    'tsw-automute',
    'Auto Mute',
    'Mute panel audio when hidden'
  );
  const rowStealth = makeRow(
    'tsw-stealth',
    'Stealth Mode',
    'Hide toggle button · use F8 instead'
  );
  const rowCleanMode = makeRow(
    'tsw-cleanmode',
    'Clean Mode',
    'Hide captions, usernames and overlays',
    'tpt-sw-cleanmode-row'
  );

  // Add lock icon to cleanmode label
  const cleanLabel = rowCleanMode.querySelector('.tpt-sw-label');
  const lockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lockSvg.setAttribute('class', 'tpt-cleanmode-lock-icon');
  lockSvg.setAttribute('width', '12');
  lockSvg.setAttribute('height', '12');
  lockSvg.setAttribute('viewBox', '0 0 24 24');
  lockSvg.setAttribute('fill', 'none');
  lockSvg.setAttribute('stroke', 'currentColor');
  lockSvg.setAttribute('stroke-width', '2.5');
  lockSvg.setAttribute('stroke-linecap', 'round');
  lockSvg.setAttribute('stroke-linejoin', 'round');
  lockSvg.style.marginRight = '5px';
  
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '3');
  rect.setAttribute('y', '11');
  rect.setAttribute('width', '18');
  rect.setAttribute('height', '11');
  rect.setAttribute('rx', '2');
  rect.setAttribute('ry', '2');
  
  const pathLock = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathLock.setAttribute('d', 'M7 11V7a5 5 0 0 1 10 0v4');
  
  lockSvg.appendChild(rect);
  lockSvg.appendChild(pathLock);
  cleanLabel.insertBefore(lockSvg, cleanLabel.firstChild);

  // Append all elements
  body.appendChild(rowBgPlay);
  body.appendChild(rowAutoMute);
  body.appendChild(rowStealth);
  body.appendChild(rowCleanMode);

  // Append to settings window
  settingsWin.appendChild(header);
  settingsWin.appendChild(body);
}

// Call the build function instead of innerHTML
_buildSettingsWin();
  // === FIX 1: Append settingsWin vào body (không quá panel) quá tránh transform stacking context ===
  document.body.appendChild(settingsWin);

  const edgeNames = ['l','r','t','b','tl','tr','bl','br'];
  const edgeEls = edgeNames.map(n => {
    const el = document.createElement('div');
    el.className = 'tpt-edge tpt-edge-' + n;
    el.dataset.edge = n;
    return el;
  });

  panel.appendChild(iframeWrap);
  panel.appendChild(bar);
  panel.appendChild(ctrlBar);
  edgeEls.forEach(el => panel.appendChild(el));
  document.body.appendChild(toggleBtn);
  document.body.appendChild(panel);

  // Ngãn scroll leak ra Facebook/trang ngoài
  panel.addEventListener('wheel', e => {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, { passive: true, capture: true });

  panel.addEventListener('touchmove', e => {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, { passive: true, capture: true });

  panel.addEventListener('touchstart', e => {
    e.stopPropagation();
  }, { passive: true, capture: true });

  // ── Search layout mode ────────────────────────────────────────────────────────
  let isSearchLayoutMode = false;

  function applyCropSettings() {
      const scaleY = videoW / VIDEO_CONTENT_W;
      const scaleX = scaleY * X_ZOOM;
      const scaledVisibleH = Math.round(VISIBLE_H * scaleY);
      const totalH = scaledVisibleH;
      panel.style.width = videoW + 'px';
      panel.style.height = totalH + 'px';
      iframeWrap.style.width = videoW + 'px';
      iframeWrap.style.height = scaledVisibleH + 'px';
      const scaledW = VIDEO_CONTENT_W * scaleX;
      const extraW = Math.max(0, scaledW - videoW);
      iframe.style.left = (-extraW * X_BIAS - LEFT_CROP * scaleX) + 'px';
      iframe.style.top = (-TOP_CROP * scaleY) + 'px';
      iframe.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
  }

  function applySearchLayoutSettings() {
      // Giữ nguyên chiều cao panel như mode thường, tránh giật UI
      // Chỉ reset transform: bỏ X_ZOOM và bỏ LEFT_CROP/TOP_CROP offset
      const scaleY = videoW / VIDEO_CONTENT_W;
      const scaledVisibleH = Math.round(VISIBLE_H * scaleY);

      panel.style.width  = videoW + 'px';
      panel.style.height = scaledVisibleH + 'px';
      iframeWrap.style.width  = videoW + 'px';
      iframeWrap.style.height = scaledVisibleH + 'px';

      // Scale đồng đều không zoom ngang, không dịch chuyển
      iframe.style.left            = '0px';
      iframe.style.top             = (-TOP_CROP * scaleY) + 'px';
      iframe.style.transformOrigin = 'top left';
      iframe.style.transform       = 'scale(' + scaleY + ')';
  }

  // ── applySize: ONLY place that sets panel/iframe dimensions ───────────────
  // videoW = desired visible width (full iframe width; sidebar overlays on video).
  // iframe is always 420x792 px intrinsically, scaled by JS.
  // TOP_CROP / BOTTOM_CROP remove TikTok navigation chrome that leaves dead space.
  function applySize(newVW) {
    newVW = Math.max(MIN_VW, Math.min(window.innerWidth * MAX_VW_FRAC, newVW));
    videoW = newVW;
    if (isSearchLayoutMode) {
        applySearchLayoutSettings();
    } else {
        applyCropSettings();
    }
  }

  // ── Mute helpers ──────────────────────────────────────────────────────────────
  function _applyMuteViaFrame(vol) {
    try { chrome.runtime.sendMessage({ type: 'MUTE_IFRAME_FRAME', volume: vol }); } catch(e) {}
  }
  function _updateMuteUI(muted) {
    const btn  = document.getElementById('tpt-ctrl-mute');
    const icon = document.getElementById('tpt-ctrl-mute-icon');
    if (btn)  btn.classList.toggle('muted-on', muted);
    if (icon) icon.innerHTML = muted
      ? `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
         <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`
      : `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
         <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
         <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
  }

  // ── Bar clicks ────────────────────────────────────────────────────────────────
  bar.addEventListener('click', e => {});

  // ── Settings Window Logic ─────────────────────────────────────────────────
  let settingsOpen = false;

  function _loadSettingsWin() {
    try {
      chrome.storage.sync.get(
        ['bgPlay','autoMute','stealth','cleanMode'],
        data => {
          const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.checked = !!val;
          };
          set('tsw-bgplay',    data.bgPlay);
          set('tsw-automute',  data.autoMute);
          set('tsw-stealth',   data.stealth);
          set('tsw-cleanmode', data.cleanMode);
        }
      );
    } catch(e) {}
  }

  function _saveSettingsWin() {
    const g = id => { const el = document.getElementById(id); return el ? el.checked : false; };
    const bgPlay    = g('tsw-bgplay');
    const autoMute  = g('tsw-automute');
    const stealth   = g('tsw-stealth');
    const cleanMode = g('tsw-cleanmode');
    try {
      chrome.storage.sync.set({ bgPlay, autoMute, stealth, cleanMode });
      chrome.runtime.sendMessage({
        type: 'MOBILE_VIEW_BROADCAST',
        enabled: panelEnabled, bgPlay, autoMute, stealth, cleanMode
      });
    } catch(e) {}
    bgPlayEnabled    = bgPlay;
    autoMuteEnabled  = autoMute;
    stealthEnabled   = stealth;
    cleanModeEnabled = cleanMode;
    applyCleanModeOverlay(cleanMode);
    _syncDotsCleanMode();
  }

  function _positionSettingsWin() {
    const ctrlRect = ctrlBar.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const swW  = 260;
    const swH  = settingsWin.offsetHeight || 220;

    let leftPos = ctrlRect.right + 12;
    let topPos  = ctrlRect.bottom - swH;

    if (leftPos + swW > winW - 8) {
      leftPos = ctrlRect.left - swW - 12;
    }
    if (leftPos < 8) leftPos = 8;
    if (topPos < 8) topPos = 8;
    if (topPos + swH > winH - 8) topPos = winH - swH - 8;

    settingsWin.style.left   = leftPos + 'px';
    settingsWin.style.top    = topPos  + 'px';
    settingsWin.style.right  = 'auto';
    settingsWin.style.bottom = 'auto';
  }

  function _openSettingsWin() {
    settingsOpen = true;
    settingsWin.classList.add('open');
    const btn = document.getElementById('tpt-ctrl-settings');
    if (btn) btn.classList.add('settings-open');
    _loadSettingsWin();
    requestAnimationFrame(_positionSettingsWin);
  }

  function _closeSettingsWin() {
    settingsOpen = false;
    settingsWin.classList.remove('open');
    const btn = document.getElementById('tpt-ctrl-settings');
    if (btn) btn.classList.remove('settings-open');
  }

  function _toggleSettingsWin() {
    if (settingsOpen) {
      _closeSettingsWin();
    } else {
      _openSettingsWin();
    }
  }

  ['tsw-bgplay','tsw-automute','tsw-stealth','tsw-cleanmode'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', _saveSettingsWin);
  });

  const swCloseBtn = document.getElementById('tpt-sw-close-btn');
  if (swCloseBtn) swCloseBtn.addEventListener('click', e => {
    e.stopPropagation();
    _closeSettingsWin();
  });

  // Dùng mousedown thay vì click để detect click-outside
  // mousedown occurs BEFORE click, so no race condition
  document.addEventListener('mousedown', e => {
    if (!settingsOpen) return;
    if (settingsWin.contains(e.target)) return;
    if (ctrlBar.contains(e.target)) return;
    _closeSettingsWin();
  });

  ctrlBar.addEventListener('click', e => {
    const btn = e.target.closest('.tpt-ctrl-btn');
    if (!btn) return;
    if (btn.id === 'tpt-ctrl-settings') {
      _toggleSettingsWin();
      return;
    }
    if (btn.id === 'tpt-ctrl-home') {
      _closeSettingsWin();
      _showTransitionOverlay(); // Hiện overlay ngay
      exitSearchModeByHome();
      isSearchLayoutMode = false;
      applyCropSettings();
      iframe.src = TIKTOK_URL;
      iframeReady = true;
      return;
    }

    // === FIX 2: Profile - goi enterSearchMode() de tat clean mode ===
    if (btn.id === 'tpt-ctrl-profile') {
      _closeSettingsWin();
      _showTransitionOverlay(); // Hiện overlay ngay
      enterSearchMode();
      isSearchLayoutMode = true;
      applySearchLayoutSettings();
      iframe.src = 'https://www.tiktok.com/profile';
      iframeReady = true;
      return;
    }

    if (btn.id === 'tpt-ctrl-search') {
      _closeSettingsWin();
      const searchWrap = document.getElementById('tpt-ctrl-search-wrap');
      const searchInput = document.getElementById('tpt-ctrl-search-input');
      if (!searchWrap || !searchInput) return;
      const isOpen = searchWrap.classList.contains('open');
      if (isOpen) {
        searchWrap.classList.remove('open');
        searchInput.value = '';
        exitSearchModeCancel();
      } else {
        enterSearchMode();
        searchWrap.classList.add('open');
        setTimeout(() => searchInput.focus(), 50);
      }
      return;
    }

    if (btn.id === 'tpt-ctrl-mute') {
      _closeSettingsWin();
      isMuted = !isMuted;
      _updateMuteUI(isMuted);
      _applyMuteViaFrame(isMuted ? 0 : 1);
      try { chrome.storage.sync.set({ mvMuted: isMuted }); } catch(e) {}
      return;
    }
    if (btn.id === 'tpt-ctrl-close') {
      _closeSettingsWin();
      hidePanel();
      return;
    }
  });

  // ── Search input handler ──────────────────────────────────────────────────────
  function _initSearchInput() {
    const searchWrap = document.getElementById('tpt-ctrl-search-wrap');
    const searchInput = document.getElementById('tpt-ctrl-search-input');
    if (!searchWrap || !searchInput) return;

    searchInput.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (!query) return;
        _showTransitionOverlay(); // Hiện overlay ngay
        const searchUrl = 'https://www.tiktok.com/search?q=' + encodeURIComponent(query) + '&is_from_webapp=1&sender_device=mobile';
        isSearchLayoutMode = true;
        iframe.src = searchUrl;
        iframeReady = true;
        searchWrap.classList.remove('open');
        searchInput.value = '';
        // Đợi iframe thoát khỏi home và render search results
        // rồi mới đổi layout, tránh thu nhỏ đột ngột
        setTimeout(() => {
            if (isSearchLayoutMode) {
                applySearchLayoutSettings();
            }
        }, 1500);
      }
      if (e.key === 'Escape') {
        searchWrap.classList.remove('open');
        searchInput.value = '';
        exitSearchModeCancel();
      }
    });

    document.addEventListener('click', e => {
      if (!searchWrap.contains(e.target) &&
          e.target.id !== 'tpt-ctrl-search') {
        searchWrap.classList.remove('open');
      }
    });
  }
  _initSearchInput();

  // ── 3-dot menu ────────────────────────────────────────────────────────────────
  let dotsOpen = false;
  document.addEventListener('click', () => { if (dotsOpen) { dotsOpen = false; dotsMenu.classList.remove('open'); } });
  dotsMenu.addEventListener('click', e => {
    const item = e.target.closest('.tpt-dots-item');
    if (!item) return;
    dotsOpen = false; dotsMenu.classList.remove('open');
    if (item.id === 'tpt-dots-reload')    { iframe.src = iframe.src; return; }
    if (item.id === 'tpt-dots-cleanmode') {
      cleanModeEnabled = !cleanModeEnabled;
      item.classList.toggle('active', cleanModeEnabled);
      applyCleanModeOverlay(cleanModeEnabled);
      try { chrome.storage.sync.set({ cleanMode: cleanModeEnabled }); } catch(e) {}
      return;
    }
    if (item.id === 'tpt-dots-close') { hidePanel(); return; }
  });

  function _syncDotsCleanMode() {
    const item = document.getElementById('tpt-dots-cleanmode');
    if (item) item.classList.toggle('active', cleanModeEnabled);
  }

  // ── Sidebar / counts ──────────────────────────────────────────────────────────
  function injectTikTokOverlayCSS() {
    try { chrome.runtime.sendMessage({ type: 'INJECT_HIDE_SIDEBAR_CSS' }); } catch(e) {}
  }

  // ── Show / hide ───────────────────────────────────────────────────────────────
  function showPanel() {
    panelVisible = true;
    panel.classList.add('tpt-mv-visible');
    toggleBtn.classList.add('open');
    if (!iframeReady) { iframeReady = true; iframe.src = TIKTOK_URL; }
    injectTikTokOverlayCSS();
    setTimeout(() => relayToTikTok({ type: 'MOBILE_VIEW_HIDE_UI', hide: true }), 2000);
    ctrlBar.style.display = 'flex';
    setTimeout(() => { applySize(videoW); }, 30);
    if (autoMuteEnabled && isMuted) {
      isMuted = false; _updateMuteUI(false); _applyMuteViaFrame(1);
      try { chrome.storage.sync.set({ mvMuted: false }); } catch(e) {}
    }
    if (cleanModeEnabled) applyCleanModeOverlay(true);
    _syncDotsCleanMode();
    // Save panel open state using tab-specific key
    _savePanelOpen(true);
  }

  iframe.addEventListener('load', () => {
    if (!panelVisible || iframe.src === 'about:blank') return;

    // Tắt overlay sau khi CSS đã apply xong
    applySize(videoW);
    injectTikTokOverlayCSS();
    setTimeout(() => injectTikTokOverlayCSS(), 300);
    setTimeout(() => injectTikTokOverlayCSS(), 800);
    setTimeout(() => relayToTikTok({ type: 'MOBILE_VIEW_HIDE_UI', hide: true }), 500);
    if (bgPlayEnabled) setTimeout(() => {
      try { chrome.runtime.sendMessage({ type: 'INJECT_BG_PLAY' }); } catch(e) {}
    }, 1000);
    setTimeout(() => _applyMuteViaFrame(isMuted ? 0 : 1), 2000);
    if (cleanModeEnabled) setTimeout(() => applyCleanModeOverlay(true), 1000);
    setInterval(() => { injectTikTokOverlayCSS(); }, 5000);

    // Ẩn overlay sau khi mọi thứ đã sẵn sàng
    setTimeout(() => _hideTransitionOverlay(), 1000); // Chờ 1s sau load
  });

  function hidePanel() {
    panelVisible = false;
    panel.classList.remove('tpt-mv-visible');
    toggleBtn.classList.remove('open');
    ctrlBar.style.display = 'none';
    relayToTikTok({ type: 'MOBILE_VIEW_HIDE_UI', hide: false });
    if (autoMuteEnabled && !isMuted) {
      isMuted = true; _updateMuteUI(true); _applyMuteViaFrame(0);
      try { chrome.storage.sync.set({ mvMuted: true }); } catch(e) {}
    }
    // Save panel close state using tab-specific key
    _savePanelOpen(false);
  }

  function _showTransitionOverlay() {
    transitionOverlay.classList.add('active');
  }

  function _hideTransitionOverlay() {
    transitionOverlay.classList.remove('active');
  }

  function _lockCleanModeRow() {
    const row = document.getElementById('tpt-sw-cleanmode-row');
    if (row) row.classList.add('cleanmode-locked');
  }

  function _unlockCleanModeRow() {
    const row = document.getElementById('tpt-sw-cleanmode-row');
    if (row) row.classList.remove('cleanmode-locked');
  }

  function setEnabled(enabled) {
    panelEnabled = enabled;
    toggleBtn.style.display = (panelEnabled && !stealthEnabled) ? 'flex' : 'none';
    if (!enabled && panelVisible) hidePanel();
  }

  toggleBtn.addEventListener('click', () => { if (panelVisible) hidePanel(); else showPanel(); });

  // ── Drag (move panel) ─────────────────────────────────────────────────────────
  let isDragging = false, dragSX, dragSY, panelSX, panelSY;

  function startDrag(e) {
    if (e.target.closest('.tpt-mv-btn') || e.target.closest('.tpt-mv-sep')) return;
    isDragging = true; dragSX = e.clientX; dragSY = e.clientY;
    const r = panel.getBoundingClientRect(); panelSX = r.left; panelSY = r.top;
    panel.classList.add('tpt-dragging');
    panel.style.transform = 'none';
    panel.style.top  = panelSY + 'px'; panel.style.left = panelSX + 'px';
    panel.style.right = 'auto'; panel.style.bottom = 'auto';
    e.preventDefault();
  }

  drag.addEventListener('mousedown', startDrag);
  bar.addEventListener('mousedown', startDrag);
  dragLeft.addEventListener('mousedown', startDrag);
  dragRight.addEventListener('mousedown', startDrag);
  dragBottom.addEventListener('mousedown', startDrag);

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panel.style.left = Math.max(0, Math.min(window.innerWidth  - panel.offsetWidth,  panelSX + e.clientX - dragSX)) + 'px';
    panel.style.top  = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, panelSY + e.clientY - dragSY)) + 'px';
  });
  document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; panel.classList.remove('tpt-dragging'); } });

  // ── Resize — any edge or corner ───────────────────────────────────────────────
  // Only videoW is tracked. Height is ALWAYS = videoW / RATIO (9:16).
  // Each edge maps its drag direction to a delta-width:
  //   left edge / TL / BL corner → -Δx makes it wider
  //   top  edge / TL / TR corner → -Δy × RATIO makes it wider
  //   bottom edge / BL           → +Δy × RATIO makes it wider
  // The "fixed" opposite edge stays anchored by adjusting panel position.

  let isResizing = false, rEdge = '';
  let rStartX, rStartY, rStartVW;
  let rFixedRight, rFixedBottom;   // absolute screen coords of the anchored edges

  edgeEls.forEach(el => {
    if (el.dataset.edge === 'b') return; // handled separately below
    el.addEventListener('mousedown', e => {
      isResizing = true;
      rEdge = el.dataset.edge;
      rStartX = e.clientX; rStartY = e.clientY;
      rStartVW = videoW;
      const r = panel.getBoundingClientRect();
      panel.style.transform = 'none';
      panel.style.left   = r.left + 'px';
      panel.style.top    = r.top  + 'px';
      panel.style.right  = 'auto';
      panel.style.bottom = 'auto';
      rFixedRight  = r.right;
      rFixedBottom = r.top + r.height;
      panel.classList.add('tpt-resizing');
      e.preventDefault(); e.stopPropagation();
    });
  });

  // Edge bottom: corners only = resize, center handled by dragBottom strip
  const edgeB = edgeEls.find(el => el.dataset.edge === 'b');
  if (edgeB) {
    edgeB.addEventListener('mousedown', e => {
      const r = panel.getBoundingClientRect();
      const fromLeft  = e.clientX - r.left;
      const fromRight = r.right - e.clientX;
      if (fromLeft <= 24 || fromRight <= 24) {
        isResizing = true;
        rEdge = 'b';
        rStartX = e.clientX; rStartY = e.clientY;
        rStartVW = videoW;
        panel.style.transform = 'none';
        panel.style.left   = r.left + 'px';
        panel.style.top    = r.top  + 'px';
        panel.style.right  = 'auto';
        panel.style.bottom = 'auto';
        rFixedRight  = r.right;
        rFixedBottom = r.top + r.height;
        panel.classList.add('tpt-resizing');
        e.preventDefault(); e.stopPropagation();
      }
    });
  }

  document.addEventListener('mousemove', e => {
    if (!isResizing) return;

    const dx = e.clientX - rStartX;  // +right
    const dy = e.clientY - rStartY;  // +down

    // Compute delta-width from this edge's drag axis
    let dw = 0;
    if (rEdge === 'l')  dw = -dx;
    if (rEdge === 'r')  dw =  dx;
    if (rEdge === 't')  dw = -dy * RATIO;
    if (rEdge === 'b')  dw =  dy * RATIO;
    if (rEdge === 'tl') dw = (Math.abs(dx) >= Math.abs(dy)) ? -dx : -dy * RATIO;
    if (rEdge === 'tr') dw = (Math.abs(dx) >= Math.abs(dy)) ?  dx : -dy * RATIO;
    if (rEdge === 'bl') dw = (Math.abs(dx) >= Math.abs(dy)) ? -dx :  dy * RATIO;
    if (rEdge === 'br') dw = (Math.abs(dx) >= Math.abs(dy)) ?  dx :  dy * RATIO;

    const newVW    = Math.max(MIN_VW, Math.min(window.innerWidth * MAX_VW_FRAC, rStartVW + dw));
    const newVH    = newVW / RATIO;
    const newTotalH = newVH;

    // Anchor right edge for left-side handles
    if (rEdge === 'l' || rEdge === 'tl' || rEdge === 'bl') {
      panel.style.left = (rFixedRight - newVW) + 'px';
    }
    // Anchor bottom edge for top-side handles
    if (rEdge === 't' || rEdge === 'tl' || rEdge === 'tr') {
      panel.style.top = (rFixedBottom - newTotalH) + 'px';
    }
    // Right edge & br corner: left stays fixed, panel grows right (no position change needed)
    // br corner: anchor top stays
    if (rEdge === 'br') {
      panel.style.top = (rFixedBottom - newTotalH) + 'px';
    }

    applySize(newVW);
    try { chrome.storage.sync.set({ mvVideoW: newVW }); } catch(e) {}
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      panel.classList.remove('tpt-resizing');
      _clampPosition();
    }
  });

  // Re-clamp if browser window changes size
  window.addEventListener('resize', () => { if (panelVisible) { applySize(videoW); _clampPosition(); } });

  // ── Init ──────────────────────────────────────────────────────────────────────
  try {
    // Step 1: Get tabId of current tab first
    chrome.runtime.sendMessage({ type: 'GET_TAB_ID' }).then(resp => {
      if (resp && resp.tabId) {
        _tabId = resp.tabId;
      }
      // Step 2: After getting tabId, load settings
      _initFromStorage();
    }).catch(() => {
      _initFromStorage();
    });
  } catch(e) {
    _initFromStorage();
  }

  function _initFromStorage() {
    try {
      const panelOpenKey = _getPanelOpenKey();
      const keysToGet = ['mobileView','mvVideoW','mvMuted','bgPlay',
                         'autoMute','stealth','cleanMode'];
      if (panelOpenKey) keysToGet.push(panelOpenKey);

      chrome.storage.sync.get(keysToGet, data => {
        bgPlayEnabled    = !!data.bgPlay;
        autoMuteEnabled  = !!data.autoMute;
        stealthEnabled   = !!data.stealth;
        cleanModeEnabled = !!data.cleanMode;
        if (data.mvVideoW) videoW = data.mvVideoW;
        applySize(videoW);
        setEnabled(!!data.mobileView);
        if (data.mvMuted) { isMuted = true; _updateMuteUI(true); setTimeout(() => _applyMuteViaFrame(0), 2500); }
        _syncDotsCleanMode();

        // Only open panel if THIS TAB's key is true
        const thisTabOpen = panelOpenKey ? !!data[panelOpenKey] : false;
        if (!!data.mobileView && thisTabOpen) showPanel();
      });
    } catch(e) {}
  }

  // ── Messages from background ──────────────────────────────────────────────────
  try {
    chrome.runtime.onMessage.addListener(msg => {
      if (msg.type === 'MOBILE_VIEW_UPDATE') {
        bgPlayEnabled    = !!msg.bgPlay;
        autoMuteEnabled  = !!msg.autoMute;
        stealthEnabled   = !!msg.stealth;
        cleanModeEnabled = !!msg.cleanMode;
        setEnabled(!!msg.enabled);
        applyCleanModeOverlay(cleanModeEnabled);
      }
    });
  } catch(e) {}

  // ── F8 shortcut ───────────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'F8') {
      e.preventDefault(); e.stopPropagation();
      if (!panelEnabled) return;
      if (panelVisible) hidePanel(); else showPanel();
    }
  }, true);

})();
