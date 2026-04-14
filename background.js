// TiktokM Floating Panel — background.js v1.0.5
// ─── MV3 compat shims ─────────────────────────────────────────────────────────
function mv3Execute(tabId, frameId, codeStr) {
  return chrome.scripting.executeScript({
    target: { tabId, frameIds: frameId != null ? [frameId] : undefined },
    func: new Function(codeStr),
    world: 'MAIN'
  }).catch(() => {});
}

function mv3ExecuteCode(tabId, frameId, codeStr) {
  // Use scripting.executeScript with a function that evals the code
  return chrome.scripting.executeScript({
    target: { tabId, frameIds: frameId != null ? [frameId] : undefined },
    func: (c) => { return eval(c); },
    args: [codeStr],
    world: 'MAIN'
  }).catch(() => {});
}

function mv3InsertCSS(tabId, frameId, cssCode) {
  return chrome.scripting.insertCSS({
    target: { tabId, frameIds: frameId != null ? [frameId] : undefined },
    css: cssCode
  }).catch(() => {});
}



// X-Frame-Options stripped via declarativeNetRequest rules (dnr_rules.json)

// ─── Helper: send to all TikTok sub-frames ────────────────────────────────────
function sendToTikTokFrames(tabId, msgObj) {
  return chrome.webNavigation.getAllFrames({ tabId }).then(frames => {
    (frames || [])
      .filter(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0)
      .forEach(frame => {
        chrome.tabs.sendMessage(tabId, msgObj, { frameId: frame.frameId }).catch(() => {});
      });
  }).catch(() => {});
}

// ─── CSS to hide right action bar — injected into TikTok frame ───────────────
const HIDE_RIGHT_BAR_CSS = `
  /* === TiktokM: hide right-side action column (visual only, keep clickable) === */

  /* Root cleanup: remove scrollbar gutter, padding, margins */
  html, body {
    overflow-x: hidden !important;
    scrollbar-gutter: auto !important;
    padding-right: 0 !important;
    margin-right: 0 !important;
  }

  /* Right sidebar action buttons — hidden visually and removed from layout */
  [data-e2e="browse-like-container"],
  [data-e2e="browse-comment-container"],
  [data-e2e="browse-collect-container"],
  [data-e2e="browse-share-container"],
  [data-e2e="like-container"],
  [data-e2e="comment-container"],
  [data-e2e="collect-container"],
  [data-e2e="share-container"],
  [data-e2e="video-action-bar"],
  [data-e2e="undefined-icon"],
  [data-e2e="browse-music"],
  [data-e2e="browse-avatar"],
  [class*="DivActionItemContainer"],
  [class*="DivVideoActionBar"],
  [class*="VideoActionBar"],
  [class*="DivRightAction"],
  [class*="right-action"],
  [class*="RightAction"],
  [class*="DivAvatarContainer"],
  [class*="DivAvatarWrapper"],
  [class*="DivMusicContainer"],
  [class*="music-disc"],
  [class*="MusicDisc"],
  [class*="DivActionBar"],
  [class*="ActionBarContainer"],
  [class*="action-bar-container"],
  [data-e2e="browse-ellipsis"],
  [data-e2e="browse-sound"]
  {
    display: none !important;
    width: 0 !important;
    max-width: 0 !important;
    flex: 0 0 0 !important;
    overflow: hidden !important;
  }

  /* ── FULLSCREEN FORCE: expand video to fill 100% on all page types ── */

  /* Remove fixed widths TikTok applies to desktop feed layout */
  [class*="DivMainContainer"],
  [class*="main-container"],
  main, [role="main"] {
    max-width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  /* The flex-row container that holds video + action column */
  [class*="DivBrowserModeContainer"],
  [class*="DivVideoItemWrap"],
  [class*="DivVideoItemContainer"],
  [class*="DivContentContainer"] {
    width: 100% !important;
    max-width: 100% !important;
    justify-content: flex-start !important;
  }

  /* Video side containers — take all available space */
  [class*="DivVideoWrapper"],
  [class*="DivLeftContainer"],
  [class*="video-player-container"],
  [class*="DivVideoPlayerContainer"],
  [class*="DivVideoPlayer"] {
    width: 100% !important;
    max-width: 100vw !important;
    min-width: 0 !important;
    flex: 1 1 100% !important;
    align-self: stretch !important;
  }

  /* Video element fills its container */
  video {
    width: 100% !important;
    object-fit: contain !important;
  }

  .xgplayer-controls,
  .xgplayer-start,
  .xgplayer-enter,
  .xgplayer-enter-spinner,
  .xg-controls,
  .xg-bar,
  .xg-top-bar,
  .xg-bottom-bar,
  .xg-progress,
  .xg-play,
  .xg-time,
  .xg-volume,
  .xg-fullscreen,
  .xg-pip,
  .xg-replay,
  .xg-error,
  .xg-loading,
  .xg-danmu,
  .xg-right-grid,
  .xg-left-grid {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
  .xgplayer::before,
  .xgplayer::after,
  [class*="xgplayer"]::before,
  [class*="xgplayer"]::after {
    display: none !important;
    background: transparent !important;
    background-image: none !important;
    opacity: 0 !important;
  }
  [class*="DivGradient"],
  [class*="GradientMask"],
  [class*="gradient-mask"],
  [class*="VideoGradient"],
  [class*="video-gradient"],
  [class*="DivVideoMask"],
  [class*="VideoMask"] {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
    background: transparent !important;
    background-image: none !important;
  }
  [class*="DivVideoWrapper"] *::before,
  [class*="DivVideoWrapper"] *::after,
  [class*="DivBasicPlayer"] *::before,
  [class*="DivBasicPlayer"] *::after {
    background-image: none !important;
    background: transparent !important;
    opacity: 0 !important;
  }
  [class*="Swipe"] img,
  [class*="Slide"] img,
  [class*="Carousel"] img,
  [class*="ImageSlide"] img,
  [class*="SlidePost"] img,
  [class*="PhotoPost"] img,
  [class*="DivSlide"] img {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
`;

const HIDE_RIGHT_BAR_JS = `(function(){
  if(window.__tptHideObserver) return;
  var HIDE_SELS=[
    '[data-e2e="browse-like-container"]',
    '[data-e2e="browse-comment-container"]',
    '[data-e2e="browse-collect-container"]',
    '[data-e2e="browse-share-container"]',
    '[data-e2e="like-container"]',
    '[data-e2e="comment-container"]',
    '[data-e2e="collect-container"]',
    '[data-e2e="share-container"]',
    '[data-e2e="video-action-bar"]',
    '[data-e2e="browse-avatar"]',
    '[data-e2e="browse-music"]',
    '[class*="DivActionItemContainer"]',
    '[class*="DivVideoActionBar"]',
    '[class*="VideoActionBar"]',
    '[class*="DivRightAction"]',
    '[class*="DivAvatarContainer"]',
    '[class*="DivMusicContainer"]',
    '[class*="DivActionBar"]',
    '[class*="ActionBarContainer"]'
  ];
  var EXPAND_SELS=[
    '[class*="DivVideoWrapper"]',
    '[class*="DivLeftContainer"]',
    '[class*="DivVideoPlayerContainer"]',
    '[class*="DivVideoPlayer"]'
  ];
  function applyAll(){
    /* Hide action columns with display:none to remove layout spacing */
    HIDE_SELS.forEach(function(sel){
      try{
        document.querySelectorAll(sel).forEach(function(el){
          el.style.setProperty('display','none','important');
          el.style.setProperty('width','0','important');
          el.style.setProperty('max-width','0','important');
          el.style.setProperty('flex','0 0 0','important');
          el.style.setProperty('overflow','hidden','important');
        });
      }catch(e){}
    });
    /* Force video containers to expand */
    EXPAND_SELS.forEach(function(sel){
      try{
        document.querySelectorAll(sel).forEach(function(el){
          /* Skip elements that contain action buttons (safety check) */
          if(el.querySelector('[data-e2e="browse-like-container"],[data-e2e="like-container"]')) return;
          el.style.setProperty('width','100%','important');
          el.style.setProperty('max-width','100vw','important');
          el.style.setProperty('min-width','0','important');
          el.style.setProperty('flex','1 1 100%','important');
        });
      }catch(e){}
    });
    /* Force video elements */
    try{
      document.querySelectorAll('video').forEach(function(v){
        v.style.setProperty('width','100%','important');
        v.style.setProperty('object-fit','contain','important');
      });
    }catch(e){}

    /* Hide xgplayer gradient overlays */
    try{
      var GRAD_SELS=[
        '.xgplayer-controls','.xgplayer-start','.xgplayer-enter',
        '.xg-controls','.xg-bar','.xg-top-bar','.xg-bottom-bar',
        '.xg-progress','.xg-play','.xg-time','.xg-volume',
        '.xg-fullscreen','.xg-pip','.xg-replay','.xg-loading'
      ];
      GRAD_SELS.forEach(function(sel){
        document.querySelectorAll(sel).forEach(function(el){
          el.style.setProperty('display','none','important');
          el.style.setProperty('opacity','0','important');
          el.style.setProperty('visibility','hidden','important');
          el.style.setProperty('pointer-events','none','important');
        });
      });
      document.querySelectorAll('video').forEach(function(v){
        var vp=v.parentElement;
        if(!vp)return;
        [vp,vp.parentElement].forEach(function(container){
          if(!container)return;
          Array.from(container.children).forEach(function(child){
            if(child===v||child.contains(v)||child.querySelector('video'))return;
            var cs=window.getComputedStyle(child);
            var bg=cs.backgroundImage||'';
            var pos=cs.position;
            if((bg.indexOf('gradient')>-1||bg.indexOf('linear')>-1)
              &&(pos==='absolute'||pos==='fixed')){
              child.style.setProperty('opacity','0','important');
              child.style.setProperty('visibility','hidden','important');
              child.style.setProperty('pointer-events','none','important');
            }
          });
        });
      });
    }catch(e){}
  }
  applyAll();
  window.__tptHideObserver=new MutationObserver(applyAll);
  window.__tptHideObserver.observe(document.documentElement,{childList:true,subtree:true});
})();`;

// ─── Message handler ──────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender) => {
  const tabId = sender.tab && sender.tab.id;

  // ── TAB ID HANDLER ──────────────────────────────────────────────────────────
  if (msg.type === 'GET_TAB_ID') {
    if (tabId) return Promise.resolve({ tabId });
    return Promise.resolve({ tabId: null });
  }

  // ── Relay: forward messages to TikTok content script ─────────────────────────
  if (msg.type === 'MOBILE_VIEW_RELAY') {
    if (!tabId || !msg.payload) return Promise.resolve({ ok: false });
    const payload = msg.payload;

    // HIDE_UI → tiktok_frame.js handles this
    if (payload.type === 'MOBILE_VIEW_HIDE_UI') {
      sendToTikTokFrames(tabId, { type: 'MOBILE_VIEW_HIDE_UI', hide: payload.hide });
      return Promise.resolve({ ok: true });
    }

    // OVERLAY_COMMENT → click native TikTok comment btn + inject dark theme
    if (payload.type === 'OVERLAY_COMMENT') {
      chrome.webNavigation.getAllFrames({ tabId }).then(frames => {
        const f = (frames || []).find(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0);
        if (!f) return;
        mv3ExecuteCode(tabId, f.frameId,
          `(function(){
            var id='__tpt_cmt_dark';
            if(!document.getElementById(id)){
              var s=document.createElement('style');s.id=id;
              s.textContent='[class*="DivCommentListContainer"],[class*="CommentList"],[class*="DivCommentPanel"],[data-e2e="comment-list"]{background:#111!important;color:#fff!important;}'
                +'[class*="CommentItem"],[data-e2e="comment-item"]{background:transparent!important;border-color:rgba(255,255,255,0.07)!important;}'
                +'[class*="CommentText"],[data-e2e="comment-text"],[class*="UserName"]{color:rgba(255,255,255,0.9)!important;}'
                +'[class*="DivReplyInput"],[class*="CommentInput"]{background:#222!important;color:#fff!important;}'
                +'[class*="DivCommentHeader"]{background:#111!important;color:#fff!important;}'
                +'[class*="DivSheet"],[class*="BottomSheet"]{background:#111!important;}';
              document.head.appendChild(s);
            }
            var sels=['[data-e2e="comment-icon"]','[class*="CommentButton"]','button[aria-label*="omment"]','[class*="comment-icon"]'];
            for(var i=0;i<sels.length;i++){var el=document.querySelector(sels[i]);if(el){el.click();break;}}
          })();`).catch(() => {});
      }).catch(() => {});
      return Promise.resolve({ ok: true });
    }

    // Other overlay actions (like, save, share)
    const selectorMap = {
      OVERLAY_LIKE:  ['[data-e2e="like-icon"]','[class*="LikeButton"]','button[aria-label*="ike"]'],
      OVERLAY_SAVE:  ['[data-e2e="collect-icon"]','[class*="CollectButton"]','button[aria-label*="ave"]'],
      OVERLAY_SHARE: ['[data-e2e="share-icon"]','[class*="ShareButton"]','button[aria-label*="hare"]']
    };
    if (selectorMap[payload.type]) {
      const selectors = JSON.stringify(selectorMap[payload.type]);
      chrome.webNavigation.getAllFrames({ tabId }).then(frames => {
        const f = (frames || []).find(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0);
        if (!f) return;
        mv3ExecuteCode(tabId, f.frameId,
          `(function(){var s=${selectors};for(var i=0;i<s.length;i++){var el=document.querySelector(s[i]);if(el){el.click();break;}}})();`).catch(() => {});
      }).catch(() => {});
    }
    return Promise.resolve({ ok: true });
  }

  // ── Clean Mode relay to TikTok frames ────────────────────────────────────────
  if (msg.type === 'CLEAN_MODE_RELAY') {
    if (!tabId) return Promise.resolve({ ok: false });
    chrome.webNavigation.getAllFrames({ tabId }).then(frames => {
      (frames || []).filter(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0)
        .forEach(frame => {
          chrome.tabs.sendMessage(tabId, { type: 'CLEAN_MODE_UPDATE', enable: !!msg.enable }, { frameId: frame.frameId }).catch(() => {});
        });
    }).catch(() => {});
    return Promise.resolve({ ok: true });
  }

  // ── Inject CSS + JS observer to hide right action bar ────────────────────────
  if (msg.type === 'INJECT_HIDE_SIDEBAR_CSS') {
    if (!tabId) return Promise.resolve({ ok: false });
    chrome.webNavigation.getAllFrames({ tabId }).then(frames => {
      (frames || []).filter(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0)
        .forEach(frame => {
          mv3InsertCSS(tabId, frame.frameId, HIDE_RIGHT_BAR_CSS);
          mv3ExecuteCode(tabId, frame.frameId, HIDE_RIGHT_BAR_JS);
        });
    }).catch(() => {});
    return Promise.resolve({ ok: true });
  }

  // ── Fetch action counts ───────────────────────────────────────────────────────
  if (msg.type === 'FETCH_ACTION_COUNTS') {
    if (!tabId) return Promise.resolve({ ok: false });
    const srcTabId = tabId;
    chrome.webNavigation.getAllFrames({ tabId }).then(frames => {
      const f = (frames || []).find(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0);
      if (!f) return;
      mv3ExecuteCode(tabId, f.frameId,
          `(function(){
          function g(ss){for(var s of ss){var e=document.querySelector(s);if(e&&e.textContent.trim())return e.textContent.trim();}return null;}
          return {
            likes:    g(['[data-e2e="like-count"]','[class*="LikeCount"]','[class*="like-count"]']),
            comments: g(['[data-e2e="comment-count"]','[class*="CommentCount"]','[class*="comment-count"]']),
            saves:    g(['[data-e2e="undefined-count"]','[class*="SaveCount"]','[class*="collect-count"]'])
          };
        })();`).then(res => {
        if (res && res[0]) {
          chrome.tabs.sendMessage(srcTabId, {
            type: 'ACTION_COUNTS_UPDATE',
            likes: res[0].likes, comments: res[0].comments, saves: res[0].saves
          }).catch(() => {});
        }
      }).catch(() => {});
    }).catch(() => {});
    return Promise.resolve({ ok: true });
  }

  // ── Broadcast settings ────────────────────────────────────────────────────────
  if (msg.type === 'MOBILE_VIEW_BROADCAST') {
    chrome.tabs.query({}).then(tabs => {
      tabs.forEach(tab => {
        if (tab.url && !tab.url.includes('tiktok.com')) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'MOBILE_VIEW_UPDATE',
            enabled: msg.enabled, bgPlay: msg.bgPlay, autoMute: msg.autoMute, stealth: msg.stealth,
            cleanMode: msg.cleanMode
          }).catch(() => {});
        }
      });
    }).catch(() => {});
    // Also broadcast clean mode to tiktok frames
    chrome.tabs.query({}).then(tabs => {
      tabs.forEach(tab => {
        if (!tab.url) return;
        chrome.webNavigation.getAllFrames({ tabId: tab.id }).then(frames => {
          (frames || []).filter(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0)
            .forEach(frame => {
              chrome.tabs.sendMessage(tab.id, { type: 'CLEAN_MODE_UPDATE', enable: !!msg.cleanMode }, { frameId: frame.frameId }).catch(() => {});
            });
        }).catch(() => {});
      });
    }).catch(() => {});
    return Promise.resolve({ ok: true });
  }

  // ── BG Play ───────────────────────────────────────────────────────────────────
  if (msg.type === 'INJECT_BG_PLAY') {
    if (!tabId) return Promise.resolve({ ok: false });
    sendToTikTokFrames(tabId, { type: 'BGP_ENABLE' });
    return Promise.resolve({ ok: true });
  }

  // ── Mute videos in iframe ─────────────────────────────────────────────────────
  if (msg.type === 'MUTE_IFRAME_FRAME') {
    if (!tabId) return Promise.resolve({ ok: false });
    const mute = (msg.volume === 0);
    chrome.webNavigation.getAllFrames({ tabId }).then(frames => {
      (frames || []).filter(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0)
        .forEach(frame => {
          mv3ExecuteCode(tabId, frame.frameId,
          `(function(){
              window.__tptMuted=${mute};
              document.querySelectorAll('video').forEach(function(v){v.volume=window.__tptMuted?0:1;v.muted=window.__tptMuted;});
              if(!window.__tptMuteObserver){
                window.__tptMuteObserver=new MutationObserver(function(ms){
                  ms.forEach(function(m){
                    m.addedNodes.forEach(function(n){
                      if(n.nodeType!==1)return;
                      var vs=n.tagName==='VIDEO'?[n]:Array.from(n.querySelectorAll('video'));
                      vs.forEach(function(v){v.volume=window.__tptMuted?0:1;v.muted=window.__tptMuted;});
                    });
                  });
                });
                window.__tptMuteObserver.observe(document.body,{childList:true,subtree:true});
              }
            })();`).catch(() => {});
        });
    }).catch(() => {});
    return Promise.resolve({ ok: true });
  }
});

// ─── bgPlay storage change ────────────────────────────────────────────────────
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync' || !changes.bgPlay) return;
  chrome.tabs.query({}).then(tabs => {
    tabs.forEach(tab => {
      if (!tab.url || !tab.url.includes('tiktok.com')) return;
      chrome.webNavigation.getAllFrames({ tabId: tab.id }).then(frames => {
        (frames || []).filter(f => f.url && f.url.includes('tiktok.com') && f.frameId !== 0)
          .forEach(frame => {
            chrome.tabs.sendMessage(tab.id, { type: 'BGP_ENABLE' }, { frameId: frame.frameId }).catch(() => {});
          });
      }).catch(() => {});
    });
  }).catch(() => {});
});

// ============================================================
// AUTO-PAUSE ENGINE
// ============================================================

// ---- State ----
const apState = {
  enabled: true,          // enabled by default
  tiktokTabId: null,      // tab containing TikTok iframe (mobile_view)
  tiktokFrameId: null,    // frameId of tiktok.com inside iframe
  tiktokPausedByAP: false,// we have paused TikTok
  otherAudioTabIds: new Set(), // tabs currently playing audio
};

// ---- Helpers ----

/** Find tab + frame TikTok currently active in panel */
function apFindTikTokFrame() {
  return chrome.tabs.query({}).then(tabs => {
    // Check all tabs, find tab with TikTok iframe
    const checks = tabs.map(tab =>
      chrome.webNavigation.getAllFrames({ tabId: tab.id })
        .then(frames => {
          if (!frames) return null;
          const f = frames.find(fr =>
            fr.url && fr.url.includes('tiktok.com') && fr.frameId !== 0
          );
          if (f) return { tabId: tab.id, frameId: f.frameId };
          return null;
        })
        .catch(() => null)
    );
    return Promise.all(checks).then(results => {
      return results.find(r => r !== null) || null;
    });
  });
}

/** Send pause command to TikTok video in iframe */
function apPauseTikTok() {
  if (apState.tiktokPausedByAP) return; // already paused
  apFindTikTokFrame().then(target => {
    if (!target) return;
    apState.tiktokTabId   = target.tabId;
    apState.tiktokFrameId = target.frameId;
    mv3ExecuteCode(target.tabId, target.frameId,
          `(function(){
        document.querySelectorAll('video').forEach(function(v){
          if(!v.paused){
            v._tptAPPaused = true;
            v.pause();
          }
        });
      })();`).catch(() => {});
    apState.tiktokPausedByAP = true;
    // Notify mobile_view to update UI
    chrome.tabs.sendMessage(target.tabId, {
      type: 'AP_STATE_CHANGED',
      paused: true
    }).catch(() => {});
  });
}

/** Send resume command to TikTok video in iframe */
function apResumeTikTok() {
  if (!apState.tiktokPausedByAP) return; // not paused yet
  apFindTikTokFrame().then(target => {
    if (!target) return;
    mv3ExecuteCode(target.tabId, target.frameId,
          `(function(){
        document.querySelectorAll('video').forEach(function(v){
          if(v._tptAPPaused && v.paused){
            v._tptAPPaused = false;
            v.play().catch(function(){});
          }
        });
      })();`).catch(() => {});
    apState.tiktokPausedByAP = false;
    chrome.tabs.sendMessage(target.tabId, {
      type: 'AP_STATE_CHANGED',
      paused: false
    }).catch(() => {});
  });
}

/** Re-evaluate: should we pause or resume? */
function apEvaluate() {
  if (!apState.enabled) {
    // AutoPause disabled -> resume if paused by AP
    if (apState.tiktokPausedByAP) apResumeTikTok();
    return;
  }
  const hasOtherAudio = apState.otherAudioTabIds.size > 0;
  if (hasOtherAudio && !apState.tiktokPausedByAP) {
    apPauseTikTok();
  } else if (!hasOtherAudio && apState.tiktokPausedByAP) {
    apResumeTikTok();
  }
}

// ---- Track tabs audible ----

/** Check if tab is playing "real" audio (exclude TikTok iframe audio) */
function apCheckTab(tab) {
  if (!tab || !tab.id) return;
  // Real TikTok tab (not host) -> ignore
  if (tab.url && tab.url.includes('tiktok.com')) {
    apState.otherAudioTabIds.delete(tab.id);
    apEvaluate();
    return;
  }
  if (tab.audible) {
    // This tab is playing audio - could be TikTok host tab
    // Need to check if audio comes from TikTok iframe or other source
    chrome.webNavigation.getAllFrames({ tabId: tab.id })
      .then(frames => {
        const hasTikTokFrame = (frames || []).some(f =>
          f.url && f.url.includes('tiktok.com') && f.frameId !== 0
        );
        if (hasTikTokFrame) {
          // Audio from this tab could be from TikTok iframe
          // This is TikTok host panel tab, DO NOT count as "other audio"
          apState.otherAudioTabIds.delete(tab.id);
        } else {
          // Audio is really from other source
          apState.otherAudioTabIds.add(tab.id);
        }
        apEvaluate();
      })
      .catch(() => {
        // Can't get frames -> treat as other audio
        apState.otherAudioTabIds.add(tab.id);
        apEvaluate();
      });
  } else {
    apState.otherAudioTabIds.delete(tab.id);
    apEvaluate();
  }
}

// Listen for tab state changes (audible, url, ...)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only care when audible changes
  if ('audible' in changeInfo) {
    apCheckTab(tab);
  }
});

// When tab is closed -> remove from set
chrome.tabs.onRemoved.addListener(tabId => {
  apState.otherAudioTabIds.delete(tabId);
  apEvaluate();
});

// ---- Polling fallback (since onUpdated sometimes misses) ----
// Poll every 2s to ensure we don't miss anything
setInterval(() => {
  if (!apState.enabled) return;
  chrome.tabs.query({ audible: true }).then(audibleTabs => {
    // Reset set
    apState.otherAudioTabIds.clear();
    const checks = audibleTabs.map(tab => {
      if (!tab.url) return Promise.resolve();
      if (tab.url.includes('tiktok.com')) return Promise.resolve();
      return chrome.webNavigation.getAllFrames({ tabId: tab.id })
        .then(frames => {
          const hasTikTokFrame = (frames || []).some(f =>
            f.url && f.url.includes('tiktok.com') && f.frameId !== 0
          );
          if (!hasTikTokFrame) {
            apState.otherAudioTabIds.add(tab.id);
          }
        })
        .catch(() => {
          apState.otherAudioTabIds.add(tab.id);
        });
    });
    Promise.all(checks).then(() => apEvaluate());
  }).catch(() => {});
}, 2000);

// ---- Load settings from storage on startup ----
chrome.storage.sync.get(['autoPause'], data => {
  // Default true if not set
  apState.enabled = (data.autoPause !== false);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  if ('autoPause' in changes) {
    apState.enabled = changes.autoPause.newValue !== false;
    apEvaluate();
  }
});

// ---- Cleanup tab-specific storage keys when tabs are closed ----
chrome.tabs.onRemoved.addListener((removedTabId) => {
  const key = 'mobileViewOpen_' + removedTabId;
  chrome.storage.sync.remove(key).catch(() => {});
});
