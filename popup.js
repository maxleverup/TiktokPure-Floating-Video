// TiktokM Floating Panel — popup.js
'use strict';

(function () {
  const el = id => document.getElementById(id);

  // ── Mobile View Help toggle ──────────────────────────────────────────────────
  const btnMvHelp = el('btn-mv-help');
  const mvHelpBox = el('mv-help-box');
  if (btnMvHelp && mvHelpBox) {
    btnMvHelp.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      mvHelpBox.style.display = mvHelpBox.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // ── Theme ────────────────────────────────────────────────────────────────────
  const isDarkOS = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  // MỚI - luôn mặc định light
  let currentTheme = localStorage.getItem('tptm_theme') || 'light';
  if (currentTheme === 'dark') document.documentElement.classList.add('dark-theme');
  else document.documentElement.classList.add('light-theme');

  const thToggle = el('theme-toggle');
  if (thToggle) {
    thToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark-theme', currentTheme === 'dark');
      document.documentElement.classList.toggle('light-theme', currentTheme === 'light');
      localStorage.setItem('tptm_theme', currentTheme);
    });
  }

  // ── Toast ────────────────────────────────────────────────────────────────────
  function showToast(msg) {
    const t = el('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1800);
  }

  // ── Load & apply settings ────────────────────────────────────────────────────
  function loadSettings() {
    chrome.storage.sync.get(['mobileView', 'bgPlay', 'autoMute', 'stealth', 'cleanMode'], data => {
      const cmv = el('c-mobileview');
      if (cmv) cmv.checked = !!data.mobileView;
      updateStatus(!!data.mobileView);

      const cbg = el('c-bgplay');
      if (cbg) cbg.checked = !!data.bgPlay;

      const cam = el('c-automute');
      if (cam) cam.checked = !!data.autoMute;

      const cst = el('c-stealth');
      if (cst) cst.checked = !!data.stealth;

      const ccm = el('c-cleanmode');
      if (ccm) ccm.checked = !!data.cleanMode;
    });
  }

  function updateStatus(enabled) {
    const dot = el('status-dot');
    const txt = el('stext');
    if (dot) dot.classList.toggle('on', enabled);
    if (txt) txt.textContent = enabled ? 'Active' : 'Off';
  }

  // ── Save settings ────────────────────────────────────────────────────────────
  function save() {
    const cmv  = el('c-mobileview');
    const cbg  = el('c-bgplay');
    const cam  = el('c-automute');
    const cst  = el('c-stealth');
    const ccm  = el('c-cleanmode');

    const mobileView = cmv ? cmv.checked : false;
    const bgPlay     = cbg ? cbg.checked : false;
    const autoMute   = cam ? cam.checked : false;
    const stealth    = cst ? cst.checked : false;
    const cleanMode  = ccm ? ccm.checked : false;

    chrome.storage.sync.set({ mobileView, bgPlay, autoMute, stealth, cleanMode }, () => {
      updateStatus(mobileView);

      // Broadcast all settings to all non-TikTok tabs
      chrome.runtime.sendMessage({
        type: 'MOBILE_VIEW_BROADCAST',
        enabled: mobileView,
        bgPlay,
        autoMute,
        stealth,
        cleanMode
      });
    });
  }

  // ── Bind toggles ─────────────────────────────────────────────────────────────
  const cmv = el('c-mobileview');
  if (cmv) cmv.addEventListener('change', save);

  const cbg = el('c-bgplay');
  if (cbg) cbg.addEventListener('change', save);

  const cam = el('c-automute');
  if (cam) cam.addEventListener('change', save);

  const cst = el('c-stealth');
  if (cst) cst.addEventListener('change', save);

  const ccm = el('c-cleanmode');
  if (ccm) ccm.addEventListener('change', save);

  // ── Init ─────────────────────────────────────────────────────────────────────
  loadSettings();
})();
