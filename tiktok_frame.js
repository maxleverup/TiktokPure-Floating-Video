// TiktokM — injected into TikTok frames at document_start
(function () {
  'use strict';

  // ── Immediately hide sidebar at document_start to prevent flash ──────────────
  // This runs before any React render, so sidebar never appears at all
  (function immediateHide() {
    const id = '__tpt_hide_immediate';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      /* Root cleanup: remove scrollbar reservation and margins */
      html, body {
        overflow-x: hidden !important;
        scrollbar-gutter: auto !important;
        padding-right: 0 !important;
        margin-right: 0 !important;
        width: 100% !important;
        max-width: 100vw !important;
      }

      [class*="DivSideNavContainer"],[class*="side-nav"],[class*="SideNav"],
      [class*="LeftSidebar"],[class*="left-sidebar"],[class*="DivLeftNav"],
      [data-e2e="nav-logo"],header[class*="Header"],[class*="DivHeaderContainer"],
      [class*="HeaderContainer"],nav[class*="Nav"],[class*="DivNavBar"],
      [class*="NavBar"][class*="Side"],[class*="DivSearchBar"],
      [data-e2e="video-more"],[data-e2e="more-icon"],
      [class*="DivMore"],[class*="DivThreeDot"],[class*="ThreeDot"],
      /* Nút close góc trên trái */
      [class*="DivCloseButton"],
      [class*="close-button"],
      [class*="CloseButton"],
      [data-e2e="browse-close"],
      [data-e2e="close-button"],
      button[aria-label*="Close"],
      button[aria-label*="close"],
      /* Nút 3 chám góc trên trái */
      [class*="DivMore"],
      [class*="ThreeDot"],
      [class*="DivThreeDot"],
      [data-e2e="video-more"],
      [data-e2e="more-icon"],
      /* Nút âm thanh góc duói trái */
      [class*="DivVolume"],
      [class*="VolumeButton"],
      [class*="volume-button"],
      [data-e2e="video-volume"],
      /* 2 nút lên xuóng gióa video */
      [class*="DivSwipeUp"],
      [class*="DivSwipeDown"],
      [class*="SwipeButton"],
      [class*="swipe-button"],
      [class*="DivNavigation"],
      [class*="NavigationButton"],
      [class*="PreviousButton"],
      [class*="NextButton"],
      [class*="DivArrow"],
      [class*="ArrowButton"],
      [class*="arrow-button"],
      [data-e2e="arrow-up"],
      [data-e2e="arrow-down"],
      [data-e2e="browse-up"],
      [data-e2e="browse-down"],
      button[aria-label*="previous" i],
      button[aria-label*="next" i],
      button[aria-label*="Previous"],
      button[aria-label*="Next"],
      [data-e2e="browse-ellipsis"],
      [data-e2e="browse-sound"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /*  Hide scrollbar */
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      html, body {
        /* BỎ overflow: hidden - chỉ ẩn scrollbar */
        scrollbar-width: none !important;
        overflow-x: hidden !important;
        /* KHÔNG đặt overflow-y: hidden */
      }

      [role="tablist"] {
        zoom: 0.6 !important;
        transform-origin: left top !important;
        white-space: nowrap !important;
        overflow: visible !important;
        margin-bottom: -16px !important; /* bù lÿi khoÿng tróng */
      }

      /* Co thanh tab profile lÿi */
      .ej9r3wt0 {
        zoom: 0.65 !important;
        transform-origin: left top !important;
        margin-bottom: -14px !important;
      }

      

      [class*="DivMainContainer"],[class*="main-container"],main,[role="main"] {
        margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100vw !important;
      }

      [class*="DivActionItemContainer"],
      [class*="DivVideoActionBar"],
      [class*="VideoActionBar"],
      [class*="DivRightAction"],
      [class*="right-action"],
      [class*="RightAction"] {
        display: none !important;
        width: 0 !important;
        max-width: 0 !important;
        flex: 0 0 0 !important;
        overflow: hidden !important;
      }
      /* Force video-side containers to fill full width */
      [class*="DivVideoWrapper"],
      [class*="DivLeftContainer"],
      [class*="DivVideoPlayerContainer"],
      [class*="DivVideoPlayer"] {
        width: 100% !important;
        max-width: 100vw !important;
        min-width: 0 !important;
        flex: 1 1 100% !important;
      }
      /* Fix flex-row parents so they don't reserve space for hidden action column */
      [class*="DivBrowserModeContainer"],
      [class*="DivVideoItemWrap"],
      [class*="DivVideoItemContainer"] {
        max-width: 100% !important;
        width: 100% !important;
        gap: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      /* Video element fills its wrapper */
      video {
        width: 100% !important;
        object-fit: contain !important;
      }
      [class*="Swipe"] img,
      [class*="Slide"] img,
      [class*="Carousel"] img,
      [class*="ImageSlide"] img,
      [class*="SlidePost"] img,
      [class*="PhotoPost"] img,
      [class*="DivSlide"] img,
      [class*="ImageCarousel"] img {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        object-fit: contain !important;
      }
      [class*="Swipe"],
      [class*="Carousel"],
      [class*="ImageCarousel"] {
        overflow: hidden !important;
        width: 100% !important;
      }

      [class*="TagChipContainer"] {
        display: none !important;
      }
      [class*="StyledDescriptionTranslationToggleText"] {
        display: none !important;
      }

      /* Ẩn see translation */
      [class*="StyledDescriptionTranslationToggleText"] {
        display: none !important;
      }
      [class*="DivMediaCardOverlayTop"] {
        zoom: 0.001 !important;
        transform-origin: top left !important;
      }

      
      [class*="DivMediaCardOverlayBottom"] {
      zoom: 0.8 !important;
        max-height: 50% !important;
   overflow: hidden !important;
   
      }
   [class*="DivOverlayBottomContent"] {
   zoom:0.8 !important;
   margin-left: 4% !important;
   margin-right:4% !important;
      
      }
   
   [class*="DivProgressBarScrubHead"] {
   max-height: 30% !important;
   overflow: hidden !important;
   }
   [class*="DivProgressBarBounds"] {
   max-height: 30% !important;
   overflow: hidden !important;
   }

   [class*="DivMediaCardOverlayBottom"] {
     background: transparent !important;
     background-color: transparent !important;
   }

   [class*="DivProgressBarContainer"],
   [class*="DivVideoProgressContainer"],
   [class*="DivProgressBar"] {
     display: none !important;
   }
   
    
    `;
    // Inject into <head> if available, otherwise <html>
    (document.head || document.documentElement).appendChild(s);
  })();

  // ── Background Play overrides ────────────────────────────────────────────────
  function applyBgPlayOverrides() {
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch (e) {}
    document.addEventListener('visibilitychange', e => { e.stopImmediatePropagation(); }, true);
    window.addEventListener('blur', e => { e.stopImmediatePropagation(); }, true);
    window.addEventListener('pagehide', e => { e.stopImmediatePropagation(); }, true);
    const obs = new MutationObserver(() => {
      document.querySelectorAll('video').forEach(v => {
        if (!v._tptBgBound) {
          v._tptBgBound = true;
          v.addEventListener('pause', () => {
            setTimeout(() => { if (!v._tpt_user_paused && v.paused) v.play().catch(() => {}); }, 80);
          });
        }
      });
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    function resumeAll() { document.querySelectorAll('video').forEach(v => { if (v.paused && !v._tpt_user_paused) v.play().catch(() => {}); }); }
    document.addEventListener('pause', e => { if (e.target?.tagName === 'VIDEO') e.target._tpt_user_paused = true; }, true);
    document.addEventListener('play',  e => { if (e.target?.tagName === 'VIDEO') e.target._tpt_user_paused = false; }, true);
    document.addEventListener('visibilitychange', resumeAll, true);
    setTimeout(resumeAll, 300); setTimeout(resumeAll, 1000);
  }

  // ── Clean Mode: hide user info, caption, progress bar, native controls ───────
  function applyCleanMode(enable) {
    const cssId = '__tpt_clean_style';
    const obsKey = '__tptCleanObserver';
    const isProfile = location.href.includes('/@') || 
                      location.href.includes('/profile');

    if (enable) {
      // CSS layer: target known selectors
      let el = document.getElementById(cssId);
      if (!el) {
        el = document.createElement('style');
        el.id = cssId;
        document.head.appendChild(el);
      }
      el.textContent = `
        /* TiktokM Clean Mode */

        /* Ch  n  avatar khi không  profile */
        ${!isProfile ? `
          [data-e2e="browse-avatar-container"],
          [data-e2e="video-author-avatar"],
          [class*="DivAvatarContainer"],
          [class*="DivAvatarWrapper"] {
            display: none !important;
          }
        ` : ''}

        /* Username / author */
        [data-e2e="browse-username"],
        [data-e2e="video-author-uniqueid"],
        [class*="DivAuthorContainer"],
        [class*="AuthorTitle"],
        [class*="author-title"],
        [class*="NickName"],
        [class*="nick-name"],
        [class*="UserName"],
        [class*="StyledLink"][href*="/@"],
        a[href*="/@"],

        /* Caption / description / hashtags */
        [data-e2e="browse-video-desc"],
        [data-e2e="video-desc"],
        [class*="DivInfoContainer"],
        [class*="DivTextContainer"],
        [class*="DivVideoInfoContainer"],
        [class*="DivVideoDesc"],
        [class*="video-desc"],
        [class*="VideoDesc"],
        [class*="DivVideoMeta"],
        [class*="video-caption"],
        [class*="VideoCaption"],
        [class*="DivCaption"],
        [class*="caption-container"],
        [class*="DivCaptionText"],
        [class*="DivHashtag"],
        [class*="HashtagLink"],

        /* "See translation" */
        [data-e2e="video-translation"],
        [class*="SeeTranslation"],
        [class*="see-translation"],
        [class*="TranslationButton"],
        [class*="Translation"],

        /* "Promotional content" label */
        [data-e2e="promotional-content"],
        [class*="PromotionalContent"],
        [class*="promotional-content"],
        [class*="DivAdLabel"],
        [class*="AdLabel"],
        [class*="ad-label"],
        [class*="SpanAdLabel"],
        [class*="DivDisclosure"],
        [class*="Disclosure"],

        /* CapCut / app promotion banners */
        [class*="tiktok-embed"],
        [class*="EmbedLink"],
        [class*="share-link"],
        [class*="DivShareLink"],
        [class*="DivPromotionCard"],
        [class*="PromotionCard"],
        [class*="promotion-card"],
        [class*="DivCreatorCard"],
        [class*="CreatorCard"],
        [class*="DivCapCut"],
        [class*="CapCutBanner"],
        [class*="capcut"],
        [data-e2e="capcut-banner"],
        [data-e2e="capcut-entry"],
        /* CapCut overlay banner dạng pill/button ở góc dưới video */
        [class*="CapCut"],
        [class*="capcut"],
        a[href*="capcut"],
        a[href*="CapCut"],
        [class*="DivTemplateEntry"],
        [class*="TemplateEntry"],
        [class*="template-entry"],
        [class*="DivTemplate"],
        [class*="TemplateButton"],
        [class*="template-button"],
        [class*="DivCreationEntry"],
        [class*="CreationEntry"],
        [class*="creation-entry"],
        [class*="DivToolEntry"],
        [class*="ToolEntry"],
        [class*="DivExternalEntry"],
        [class*="ExternalEntry"],
        [class*="external-entry"],
        [class*="DivAppEntry"],
        [class*="AppEntry"],
        [class*="app-entry"],
        [class*="DivVideoTag"],
        [class*="VideoTag"],
        [class*="video-tag"],
        [class*="DivBadge"],
        [class*="VideoBadge"],
        [class*="video-badge"],
        [class*="DivWatermark"],
        [class*="Watermark"],
        [class*="watermark"],
        [data-e2e="video-tag"],
        [data-e2e="template-entry"],
        [data-e2e="creation-entry"],
        [data-e2e="capcut-template"],
        [data-e2e="tool-entry"],

        /* Paid partnership / disclosure labels */
        [class*="PaidPartnership"],
        [class*="paid-partnership"],
        [class*="DivPaidLabel"],
        [class*="PaidLabel"],
        [data-e2e="paid-partnership"],
        [data-e2e="paid-label"],

        /* Music info */
        [class*="SpanMusicName"],
        [data-e2e="browse-music"],
        [class*="DivMusicContainer"],
        [class*="music-disc"],
        [class*="MusicDisc"],
        [class*="DivMusicInfo"],
        [class*="music-info"],

        /* Native TikTok volume button */
        [data-e2e="video-volume"],
        [class*="DivVolume"],
        [class*="VolumeButton"],
        [class*="volume-button"],
        [class*="DivVolumeControl"],

        /* Native TikTok 3-dot / more options - cùng hàng dengan loa */
        [data-e2e="video-more"],
        [data-e2e="more-icon"],
        [class*="DivMoreButton"],
        [class*="MoreButton"],
        [class*="more-button"],
        [class*="DivThreeDot"],
        [class*="ThreeDot"],
        /* Hover overlay bar contains loa + 3 chams (dai den appears khi hover) */
        [class*="DivControlBar"],
        [class*="ControlBar"],
        [class*="control-bar"],
        [class*="DivPlayerControl"],
        [class*="PlayerControl"],
        [class*="player-control"],
        [class*="DivVideoControl"],
        [class*="VideoControl"],
        [class*="video-control"],
        [class*="DivTopBar"],
        [class*="TopBar"],
        [class*="top-bar"],
        [class*="DivOverlayBar"],
        [class*="OverlayBar"],
        [class*="overlay-bar"],
        [class*="DivHoverBar"],
        [class*="HoverBar"],
        [class*="hover-bar"],
        [class*="DivActionOverlay"],
        [class*="ActionOverlay"],
        [class*="action-overlay"],
        [class*="DivVideoOverlay"][class*="Top"],
        [class*="DivVideoOverlay"][class*="Bar"],
        [class*="DivTopControl"],
        [class*="TopControl"],
        [class*="top-control"],

        /* Progress / seek bar */
        [class*="DivSeekBar"],
        [class*="SeekBar"],
        [class*="seek-bar"],
        [class*="DivProgressBar"],
        [class*="progress-bar"],
        [class*="ProgressBar"],
        [class*="DivVideoProgressBar"],
        [data-e2e="video-progress"],
        /* Nút 3 châm góc trên trái (xgplayer + TikTok native) */
        [data-e2e="video-more"],
        [data-e2e="more-icon"],
        [class*="DivMore"]:not([class*="DivMoreVideo"]):not([class*="Comment"]),
        [class*="MoreButton"],
        [class*="DivThreeDot"],
        [class*="ThreeDot"],
        .xgplayer-start,
        .xgplayer-enter,
        .xgplayer-enter-spinner,
        [class*="xgplayer-start"],
        /* Top overlay bar contains nút ... */
        [class*="DivVideoTopBar"],
        [class*="VideoTopBar"],
        [class*="video-top-bar"],
        [class*="DivPlayerTopBar"],
        [class*="PlayerTopBar"],
        [class*="DivTopAction"],
        [class*="TopAction"],
        [class*="top-action"],
        [class*="DivVideoHeader"],
        [class*="VideoHeader"],
        [class*="DivVideoTopArea"],
        [class*="VideoTopArea"],
        [class*="DivControlsTop"],
        [class*="ControlsTop"],
        [class*="controls-top"] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Bottom bar / progress bar xgplayer và TikTok native */
        .xgplayer-controls,
        .xgplayer-start,
        .xgplayer-enter,
        .xg-controls,
        .xg-bar,
        .xg-bottom-bar,
        .xg-top-bar,
        .xg-progress,
        .xg-play,
        .xg-time,
        .xg-volume,
        .xg-fullscreen,
        .xg-pip,
        .xg-replay,
        .xg-loading,
        [class*="xgplayer-controls"],
        [class*="xg-controls"],
        [class*="xg-bottom"],
        [class*="xg-progress"],
        [class*="DivVideoBottomBar"],
        [class*="VideoBottomBar"],
        [class*="video-bottom-bar"],
        [class*="DivBottomBar"],
        [class*="BottomBar"],
        [class*="bottom-bar"],
        [class*="DivBottomControl"],
        [class*="BottomControl"],
        [class*="bottom-control"],
        [class*="DivProgressContainer"],
        [class*="ProgressContainer"],
        [class*="progress-container"],
        [class*="DivTimeBar"],
        [class*="TimeBar"],
        [class*="time-bar"],
        [class*="DivSlider"][class*="Video"],
        [class*="DivVideoSlider"],
        [class*="VideoSlider"],
        [class*="DivFooterBar"],
        [class*="FooterBar"],
        [class*="footer-bar"],
        [class*="DivVideoFooter"],
        [class*="VideoFooter"],
        [class*="video-footer"],
        [class*="DivControlBottom"],
        [class*="ControlBottom"],
        [class*="control-bottom"] {
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
          opacity: 0 !important;
        }

        /* The bottom overlay info block (contains username + caption) */
        [class*="DivVideoInfo"],
        [class*="video-info-container"],
        [class*="DivBrowserModeContainer"] > div:last-child,
        [class*="DivVideoWrapper"] > div:not([class*="Video"]):not([class*="Player"]) {
          display: none !important;
        }

        /* Force hide CapCut banner bằng mọi cách có thể */
        a[href*="capcut"],
        a[href*="CapCut"],
        a[href*="capcutapp"],
        *[data-testid*="capcut"],
        *[data-testid*="template"],
        *[class*="CapCut"],
        *[class*="capcut"],
        *[id*="capcut"],
        *[id*="CapCut"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Location tags */
        [data-e2e="video-location"],
        [data-e2e="location-tag"],
        [data-e2e="poi-tag"],
        [data-e2e="place-tag"],
        a[href*="/place/"],
        a[href*="/poi/"],
        a[href*="place_id"],
        [class*="LocationTag"],
        [class*="location-tag"],
        [class*="DivLocation"],
        [class*="PoiTag"],
        [class*="poi-tag"],
        [class*="PlaceTag"],
        [class*="place-tag"],
        /* Effect/Filter tags */  
        a[href*="/sticker/"],
        a[href*="/effect/"],
        [class*="StickerTag"],
        [class*="sticker-tag"],
        [class*="EffectTag"],
        [class*="effect-tag"],
        [class*="FilterTag"],
        [class*="filter-tag"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /*  Hide toàn bô overlay bottom content thay vì tùng mûc */
        [class*="DivOverlayBottomContent"],
       {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;

      // ── JS layer: MutationObserver to catch dynamically rendered elements ──
      if (window[obsKey]) return; // already running

      function forceHideCleanElements(root) {
        function hide(el) {
          if (!el) return;
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('opacity', '0', 'important');
        }

        // 1. Hide by exact text content — only hide the element itself, NO walk-up
        const HIDE_TEXTS = [
          'see translation',
          'promotional content',
          'promoted',
          'paid partnership',
          'paid promotion',
          'capcut · editing made easy',
          'capcut',
          'try this template',
          'capcut · try this template',
          'use this template',
          'edit with capcut',
          'try this effect',
          'try this filter',
        ];
        root.querySelectorAll('span, p, button, a, div[class]').forEach(node => {
          // Skip if node contains interactive children (video, input, buttons with children)
          if (node.querySelector('video,input,textarea')) return;
          const txt = (node.textContent || '').trim().toLowerCase();
          if (HIDE_TEXTS.some(t => txt === t)) {
            hide(node);
            // Also hide its immediate parent if parent has <=2 children and no video
            const p = node.parentElement;
            if (p && p.children.length <= 2 && !p.querySelector('video,input,textarea')) {
              hide(p);
            }
          }
        });

        // 2. Hide username anchor links — only the <a> tag itself
        root.querySelectorAll('a[href*="/@"]').forEach(node => {
          hide(node);
          const p = node.parentElement;
          if (p && p.children.length <= 2 && !p.querySelector('video,input,textarea')) {
            hide(p);
          }
        });

        // 2b. Hide CapCut / template overlay buttons - đây là pill button ở góc dưới video
        // Tìm theo text content chứa "capcut" hoặc "template"
        root.querySelectorAll('a, button, div[role="button"], span').forEach(node => {
          if (node.querySelector('video,input,textarea')) return;
          const txt = (node.textContent || '').trim().toLowerCase();
          if (
            txt.includes('capcut') ||
            txt.includes('try this template') ||
            txt.includes('try this effect') ||
            txt.includes('use this template') ||
            txt.includes('edit with capcut')
          ) {
            // Ẩn chính node và leo lên tối đa 3 cấp cha để ẩn container
            let target = node;
            for (let i = 0; i < 3; i++) {
              if (!target || target === document.body) break;
              target.style.setProperty('display', 'none', 'important');
              target.style.setProperty('opacity', '0', 'important');
              target.style.setProperty('pointer-events', 'none', 'important');
              // Dừng leo nếu parent chứa video hoặc quá nhiều con
              const parent = target.parentElement;
              if (!parent || parent.querySelector('video,input,textarea') || parent.children.length > 5) break;
              target = parent;
            }
          }
        });

        // 2c. Ẩn bất kỳ <a> tag nào có href đến capcut.com
        root.querySelectorAll('a[href*="capcut"], a[href*="CapCut"]').forEach(node => {
          let target = node;
          for (let i = 0; i < 3; i++) {
            if (!target || target === document.body) break;
            target.style.setProperty('display', 'none', 'important');
            target.style.setProperty('opacity', '0', 'important');
            const parent = target.parentElement;
            if (!parent || parent.querySelector('video,input,textarea') || parent.children.length > 5) break;
            target = parent;
          }
        });

        // 3. Hide by data-e2e — safe, precise targeting
        const E2E_HIDE = [
          'browse-username', 'video-author-uniqueid', 'browse-avatar-container',
          'video-author-avatar', 'browse-video-desc', 'video-desc',
          'video-translation', 'promotional-content', 'video-more', 'more-icon',
          'video-volume', 'video-progress', 'browse-music',
          'video-tag', 'template-entry', 'creation-entry', 'capcut-template', 'tool-entry',
          'video-control', 'control-bar', 'player-control', 'top-bar', 'hover-bar'
        ];
        E2E_HIDE.forEach(attr => {
          root.querySelectorAll(`[data-e2e="${attr}"]`).forEach(el => hide(el));
        });

        // 4. Hide class-pattern containers - only if they don't contain video/input
        root.querySelectorAll('[class]').forEach(node => {
          if (node.querySelector('video,input,textarea')) return;
          const cls = node.className;
          if (typeof cls !== 'string') return;
          if (/VideoInfo|video-info|BrowserMode|videoInfo|DivVideoMeta|VideoMeta/i.test(cls)) {
            hide(node);
          }
        });

        // 5. Bát nút 3 châm ô góc trên trái video theo vi trí thêc tê
        document.querySelectorAll('video').forEach(video => {
          const vr = video.getBoundingClientRect();
          if (!vr.width) return;
          const zoneRight = vr.left + vr.width * 0.25;
          const zoneBottom = vr.top + vr.height * 0.25;
          root.querySelectorAll('button, div[role="button"], [class*="More"], [class*="Dot"]').forEach(el => {
            if (el.querySelector('video,input,textarea,img')) return;
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return;
            if (r.left >= vr.left - 5 &&
                r.right <= zoneRight &&
                r.top >= vr.top - 5 &&
                r.bottom <= zoneBottom) {
              hide(el);
            }
          });
        });

        // 6.  An hover overlay bar (dai den chua loa + 3 châm khi hover)
        root.querySelectorAll('[class]').forEach(node => {
          if (node.querySelector('video,input,textarea,img')) return;
          const cls = node.className;
          if (typeof cls !== 'string') return;
          if (/ControlBar|controlbar|PlayerControl|player.control|VideoControl|VideoTopBar|TopBar|HoverBar|OverlayBar|ActionOverlay|TopControl|DivControllerBar|DivTopController|TopAction|VideoHeader|ControlsTop/i.test(cls)) {
            hide(node);
            return;
          }
          try {
            const cs = window.getComputedStyle(node);
            if (cs.position !== 'absolute' && cs.position !== 'fixed') return;
            const rect = node.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            if (rect.height > 80) return;
            if (rect.width < 80) return;
            if (!node.querySelector('button, svg, [role="button"]')) return;
            const bg = cs.backgroundColor || '';
            const bgImg = cs.backgroundImage || '';
            const hasDarkBg = bg.includes('rgb(0') || bg.includes('rgba(0') || bgImg.includes('gradient');
            if (hasDarkBg || node.querySelector('[data-e2e="video-volume"],[data-e2e="video-more"]')) {
              hide(node);
            }
          } catch(e) {}
        });

        // 7. Bât bottom bar theo vi trí thêc tê (nam ô dáy video, mông)
        document.querySelectorAll('video').forEach(video => {
          const vr = video.getBoundingClientRect();
          if (!vr.width) return;
          const zoneTop = vr.top + vr.height * 0.85;
          root.querySelectorAll('[class]').forEach(el => {
            if (el === video) return;
            if (el.contains(video) || el.querySelector('video')) return;
            if (el.querySelector('img')) return;
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return;
            if (r.height > 60) return;
            if (r.top >= zoneTop &&
                r.bottom <= vr.bottom + 10 &&
                r.left >= vr.left - 10 &&
                r.right <= vr.right + 10 &&
                r.width > vr.width * 0.3) {
              hide(el);
            }
          });
          root.querySelectorAll('[class]').forEach(el => {
            if (el.contains(video) || el.querySelector('video,img')) return;
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return;
            if (r.height > 60) return;
            if (r.top >= vr.bottom - 5 &&
                r.bottom <= vr.bottom + 55 &&
                r.left >= vr.left - 10 &&
                r.right <= vr.right + 10 &&
                r.width > vr.width * 0.3) {
              hide(el);
            }
          });
        });
      }

      // Run immediately on current DOM
      forceHideCleanElements(document.documentElement);

      // Observe future changes
      const obs = new MutationObserver(mutations => {
        mutations.forEach(m => {
          if (m.addedNodes.length) forceHideCleanElements(document.documentElement);
        });
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      window[obsKey] = obs;
      hideCapcutBanner();
      hideVideoOverlayBadges();

    } else {
      // Disable: remove style and stop observer
      const el = document.getElementById(cssId);
      if (el) el.remove();
      if (window[obsKey]) {
        window[obsKey].disconnect();
        delete window[obsKey];
      }
      delete window.__tptCleanObserver;
    }
  }

  // ── Hide CapCut banner overlay ──────────────────────────────────────────────
  function hideCapcutBanner() {
    if (window.__tptCapcutHideActive) return;
    window.__tptCapcutHideActive = true;

    const CAPCUT_KEYWORDS = [
      'capcut',
      'try this template',
      'try this effect', 
      'use this template',
      'edit with capcut',
      'try this filter',
      'make this video',
    ];

    function isCapcutElement(el) {
      if (!el || el === document.body || el === document.documentElement) return false;
      const text = (el.textContent || '').trim().toLowerCase();
      const hasKeyword = CAPCUT_KEYWORDS.some(kw => text.includes(kw));
      if (!hasKeyword) return false;
      // Tránh ẩn container lớn chứa video
      if (el.querySelector('video')) return false;
      // Chỉ ẩn nếu text content ngắn (không phải caption dài)
      if (text.length > 200) return false;
      return true;
    }

    function nukeCapcut() {
      // === APPROACH 1: Tìm theo text content ===
      const allEls = document.querySelectorAll('a, button, div, span, p');
      allEls.forEach(el => {
        if (!isCapcutElement(el)) return;
        // Ẩn element này và leo lên tìm container thực sự
        let target = el;
        let climbs = 0;
        while (target && target !== document.body && climbs < 5) {
          if (target.querySelector('video')) break;
          const text = (target.textContent || '').trim().toLowerCase();
          if (text.length > 300) break; // Container quá lớn, dừng lại
          target.style.setProperty('display', 'none', 'important');
          target.style.setProperty('opacity', '0', 'important');
          target.style.setProperty('pointer-events', 'none', 'important');
          target.style.setProperty('visibility', 'hidden', 'important');
          const parent = target.parentElement;
          if (!parent) break;
          const siblingText = (parent.textContent || '').trim().toLowerCase();
          // Nếu parent chứa nhiều nội dung khác ngoài capcut, dừng leo
          const nonCapcutText = siblingText.replace(/capcut|try this template|try this effect/gi, '').trim();
          if (nonCapcutText.length > 50) break;
          target = parent;
          climbs++;
        }
      });

      // === APPROACH 2: Tìm theo href chứa capcut ===
      document.querySelectorAll('a').forEach(a => {
        const href = (a.href || a.getAttribute('href') || '').toLowerCase();
        if (href.includes('capcut') || href.includes('capcutapp')) {
          let target = a;
          for (let i = 0; i < 4; i++) {
            if (!target || target === document.body) break;
            if (target.querySelector('video')) break;
            target.style.setProperty('display', 'none', 'important');
            target.style.setProperty('visibility', 'hidden', 'important');
            target.style.setProperty('opacity', '0', 'important');
            target = target.parentElement;
          }
        }
      });

      // === APPROACH 3: Tìm theo SVG icon của CapCut ===
      document.querySelectorAll('svg').forEach(svg => {
        const parent = svg.closest('a, button, div[role="button"]');
        if (!parent) return;
        if (parent.querySelector('video')) return;
        const text = (parent.textContent || '').trim().toLowerCase();
        if (CAPCUT_KEYWORDS.some(kw => text.includes(kw))) {
          let target = parent;
          for (let i = 0; i < 4; i++) {
            if (!target || target === document.body) break;
            if (target.querySelector('video')) break;
            if ((target.textContent || '').trim().length > 200) break;
            target.style.setProperty('display', 'none', 'important');
            target.style.setProperty('visibility', 'hidden', 'important');
            target = target.parentElement;
          }
        }
      });

      // === APPROACH 4: Nuclear - tìm element nằm ở vị trí góc dưới video ===
      const videoEls = document.querySelectorAll('video');
      videoEls.forEach(video => {
        const videoRect = video.getBoundingClientRect();
        if (!videoRect.width) return;
        const bottomZone = videoRect.bottom - (videoRect.height * 0.2);
        document.querySelectorAll('a, button, div[role="button"]').forEach(el => {
          if (el.querySelector('video')) return;
          const rect = el.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          if (
            rect.top >= bottomZone &&
            rect.bottom <= videoRect.bottom + 20 &&
            rect.left >= videoRect.left - 20 &&
            rect.right <= videoRect.right + 20 &&
            rect.height < 60 &&
            rect.width < 300
          ) {
            const text = (el.textContent || '').trim().toLowerCase();
            if (CAPCUT_KEYWORDS.some(kw => text.includes(kw))) {
              el.style.setProperty('display', 'none', 'important');
              el.style.setProperty('visibility', 'hidden', 'important');
              el.style.setProperty('opacity', '0', 'important');
              let p = el.parentElement;
              for (let i = 0; i < 3; i++) {
                if (!p || p.querySelector('video') || p === document.body) break;
                if ((p.textContent || '').trim().length > 200) break;
                p.style.setProperty('display', 'none', 'important');
                p = p.parentElement;
              }
            }
          }
        });
      });
    }

    const safeNukeCapcut = () => {
    if (isSlideContext()) return;
    nukeCapcut();
  };
  safeNukeCapcut();
  setTimeout(safeNukeCapcut, 300);
  setTimeout(safeNukeCapcut, 800);
  setTimeout(safeNukeCapcut, 1500);
  setTimeout(safeNukeCapcut, 3000);
  const obs = new MutationObserver(() => {
    if (isSlideContext()) return;
    setTimeout(safeNukeCapcut, 200);
  });
  obs.observe(document.documentElement, { childList: true, subtree: true, attributes: false });
  setInterval(safeNukeCapcut, 3000);
    
    window.__tptCapcutNuke = nukeCapcut;
  }

function hideVideoOverlayBadges() {
  if (window.__tptBadgeHiderActive) return;
  window.__tptBadgeHiderActive = true;

  function nukeBadges() {
    // ── STRATEGY A: Nhắm vào cấu trúc DOM thực của TikTok ──
    // TikTok render các badge này trong một container đặc biệt
    // nằm TRONG video wrapper, là sibling của thẻ <video>
    
    document.querySelectorAll('video').forEach(video => {
      // Lấy parent của video (thường là div bọc trực tiếp)
      let videoParent = video.parentElement;
      if (!videoParent) return;
      
      // Tìm container lớn hơn chứa cả video lẫn overlay
      let container = videoParent;
      for (let i = 0; i < 5; i++) {
        if (!container || container === document.body) break;
        const rect = container.getBoundingClientRect();
        // Container hợp lệ phải có kích thước tương đương video
        if (rect.height > 200 && rect.width > 100) break;
        container = container.parentElement;
      }
      if (!container || container === document.body) return;

      // Tìm tất cả children của container KHÔNG phải video và KHÔNG phải player controls
      // mà có kích thước nhỏ (là badge pill)
      const allChildren = container.querySelectorAll('*');
      allChildren.forEach(child => {
        if (child === video) return;
        if (child.contains(video)) return;
        if (child.querySelector('video')) return;
        
        const rect = child.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        
        // Badge đặc trưng: nhỏ, nằm ở bottom 30% của video
        const videoRect = video.getBoundingClientRect();
        if (videoRect.height === 0) return;
        
        const isInBottomZone = rect.top > (videoRect.top + videoRect.height * 0.6);
        const isSmall = rect.height < 70 && rect.width < 400;
        const isInsideVideo = 
          rect.left >= videoRect.left - 10 &&
          rect.right <= videoRect.right + 10 &&
          rect.top >= videoRect.top &&
          rect.bottom <= videoRect.bottom + 10;
        
        if (isInBottomZone && isSmall && isInsideVideo) {
          // Kiểm tra thêm: có chứa SVG icon không (badge thường có icon)
          const hasSvg = child.querySelector('svg') !== null;
          const hasImg = child.querySelector('img') !== null;
          const text = (child.textContent || '').trim();
          const hasShortText = text.length > 0 && text.length < 80;
          
          if ((hasSvg || hasImg) && hasShortText) {
            // Chỉ ẩn chính element đó, KHÔNG leo lên parent
            // để tránh ảnh hưởng đến video container
            child.style.setProperty('display', 'none', 'important');
            child.style.setProperty('visibility', 'hidden', 'important');
            child.style.setProperty('opacity', '0', 'important');
            child.style.setProperty('pointer-events', 'none', 'important');
          }
        }
      });
    });

    // ── STRATEGY B: Tìm theo data attributes đặc trưng của TikTok ──
    // TikTok dùng data-e2e hoặc aria attributes cho các interactive elements
    const BADGE_SELECTORS = [
      // Location
      '[data-e2e="video-location"]',
      '[data-e2e="location-tag"]', 
      '[data-e2e="poi-tag"]',
      '[data-e2e="place-tag"]',
      '[aria-label*="location"]',
      '[aria-label*="Location"]',
      '[aria-label*="place"]',
      // Effect/Filter  
      '[data-e2e="video-effect"]',
      '[data-e2e="effect-tag"]',
      '[data-e2e="sticker-tag"]',
      '[data-e2e="filter-tag"]',
      '[aria-label*="effect"]',
      '[aria-label*="Effect"]',
      '[aria-label*="filter"]',
      '[aria-label*="Filter"]',
      '[aria-label*="sticker"]',
      // Generic anchor badges
      'a[href*="/tag/"]',
      'a[href*="/sticker/"]', 
      'a[href*="/effect/"]',
      'a[href*="/place/"]',
      'a[href*="/poi/"]',
      'a[href*="place_id"]',
    ];
    
    BADGE_SELECTORS.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => {
          if (el.querySelector('video')) return;
          let target = el;
          for (let i = 0; i < 3; i++) {
            if (!target || target === document.body) break;
            if (target.querySelector('video')) break;
            const rect = target.getBoundingClientRect();
            if (rect.width > 500 || rect.height > 100) break;
            target.style.setProperty('display', 'none', 'important');
            target.style.setProperty('visibility', 'hidden', 'important');
            target.style.setProperty('opacity', '0', 'important');
            target = target.parentElement;
          }
        });
      } catch(e) {}
    });
  }

  const safeNukeBadges = () => {
    if (isSlideContext()) return;
    nukeBadges();
  };
  safeNukeBadges();
  setTimeout(safeNukeBadges, 500);
  setTimeout(safeNukeBadges, 1200);
  setTimeout(safeNukeBadges, 2500);
  
  // Observer liên tục
  const obs = new MutationObserver(() => {
    if (isSlideContext()) return;
    clearTimeout(window.__tptBadgeTimer);
    window.__tptBadgeTimer = setTimeout(safeNukeBadges, 300);
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  
  setInterval(safeNukeBadges, 3000);
}

  // ── Auto-unmute: force volume on if TikTok mutes the video ─────────────────
  // TikTok sometimes starts videos muted; this detects & fixes it automatically
  function startAutoUnmuteWatcher() {
    if (window.__tptAutoUnmuteActive) return;
    window.__tptAutoUnmuteActive = true;

    // Selectors cho nút mute native của TikTok (cả video thường lẫn slide)
    const MUTE_BTN_SELS = [
      '[data-e2e="video-volume"]',
      '[class*="DivVolume"]',
      '[class*="VolumeButton"]',
      '[class*="volume-button"]',
      '[class*="DivVolumeControl"]',
      'button[aria-label*="nmute"]',
      'button[aria-label*="Unmute"]',
      'button[aria-label*="sound"]',
      'button[aria-label*="Sound"]',
      '[class*="DivMute"]',
      '[class*="MuteButton"]',
      '[class*="mute-button"]',
    ];

    function clickNativeUnmute() {
      for (const sel of MUTE_BTN_SELS) {
        try {
          const btns = document.querySelectorAll(sel);
          btns.forEach(btn => {
            const label = (btn.getAttribute('aria-label') || btn.getAttribute('aria-pressed') || '').toLowerCase();
            const isMutedBtn = label.includes('unmute') || label.includes('sound off') || btn.getAttribute('aria-pressed') === 'true';
            // Thử click nếu button tồn tại và có vẻ đang muted
            if (btn && !window.__tptMuted) {
              try { btn.click(); } catch(e) {}
            }
          });
        } catch(e) {}
      }
    }

    function tryUnmute() {
      if (window.__tptMuted) return;

      // Xử lý thẻ <video>
      document.querySelectorAll('video').forEach(v => {
        if (window.__tptMuted) return;
        if (v.muted || v.volume === 0) {
          try {
            v.muted = false;
            v.volume = 1;
          } catch(e) {}
        }
      });

      // Xử lý thẻ <audio> (dùng trong slide posts)
      document.querySelectorAll('audio').forEach(a => {
        if (window.__tptMuted) return;
        if (a.muted || a.volume === 0) {
          try {
            a.muted = false;
            a.volume = 1;
          } catch(e) {}
        }
      });

      // Thử click nút unmute native của TikTok
      // Dành cho cả slide lẫn video thông thường
      try {
        const volumeEls = document.querySelectorAll(
          '[data-e2e="video-volume"], [class*="DivVolume"], [class*="VolumeButton"], [class*="volume-button"]'
        );
        volumeEls.forEach(el => {
          if (window.__tptMuted) return;
          // Kiểm tra nếu đang ở trạng thái muted (có SVG path của muted icon)
          const svg = el.querySelector('svg');
          const use = el.querySelector('use');
          const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
          const ariaPressed = el.getAttribute('aria-pressed');
          
          // TikTok thường dùng aria-pressed="true" khi muted hoặc aria-label chứa "unmute"
          if (ariaPressed === 'true' || ariaLabel.includes('unmute') || ariaLabel.includes('turn on sound')) {
            try { el.click(); } catch(e) {}
          }
        });
      } catch(e) {}

      // Fallback: tìm bất kỳ element nào trông giống nút mute đang active
      try {
        document.querySelectorAll('button, div[role="button"]').forEach(el => {
          if (window.__tptMuted) return;
          const label = (el.getAttribute('aria-label') || '').toLowerCase();
          if (label === 'unmute' || label === 'turn on sound' || label === 'sound off') {
            try { el.click(); } catch(e) {}
          }
        });
      } catch(e) {}
    }

    // Observer theo dõi DOM thay đổi (quan trọng cho slide posts khi lướt)
    const obs = new MutationObserver(() => {
      setTimeout(tryUnmute, 100);
      setTimeout(tryUnmute, 400);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Polling intervals - dày hơn ở đầu để bắt kịp slide posts
    setTimeout(tryUnmute, 200);
    setTimeout(tryUnmute, 500);
    setTimeout(tryUnmute, 1000);
    setTimeout(tryUnmute, 2000);
    setTimeout(tryUnmute, 3500);
    
    // Polling định kỳ mỗi 1.5s (thay vì 2s) để bắt kịp khi lướt sang video/slide mới
    setInterval(tryUnmute, 1500);
  }

  // ── Hide hover gradient black bars (top & bottom overlay) ────────────────────
  function hideHoverGradients() {
    if (window.__tptGradientHiderActive) return;
    window.__tptGradientHiderActive = true;

    const styleId = '__tpt_gradient_hide';
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style');
      s.id = styleId;
      s.textContent = `
        .xgplayer-controls,
        .xgplayer-start,
        .xg-controls,
        .xg-bar,
        .xg-top-bar,
        .xg-bottom-bar,
        .xg-progress,
        .xg-play,
        .xg-time,
        .xg-volume,
        .xg-fullscreen,
        .xg-pip {
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
          opacity: 0 !important;
        }
        [class*="DivVideoWrapper"]::before,
        [class*="DivVideoWrapper"]::after,
        [class*="DivVideoPlayer"]::before,
        [class*="DivVideoPlayer"]::after,
        [class*="DivBasicPlayer"]::before,
        [class*="DivBasicPlayer"]::after {
          opacity: 0 !important;
          background: transparent !important;
          background-image: none !important;
          display: none !important;
        }
        [class*="DivGradient"],
        [class*="gradient-mask"],
        [class*="GradientMask"],
        [class*="video-gradient"],
        [class*="VideoGradient"],
        [class*="DivVideoMask"],
        [class*="VideoMask"],
        [class*="video-mask"] {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          background: transparent !important;
          background-image: none !important;
        }
      `;
      (document.head || document.documentElement).appendChild(s);
    }

    function nukeGradients() {
  document.querySelectorAll(
    '.xgplayer-controls, .xg-controls, .xg-bar, .xgplayer-start, ' +
    '[class*="xg-controls"], [class*="xg-bar"]'
  ).forEach(el => {
    el.style.setProperty('opacity', '0', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');
  });

  document.querySelectorAll('video').forEach(video => {
    const videoParent = video.parentElement;
    if (!videoParent) return;
    let ancestor = videoParent;
    let isSlidePost = false;
    for (let i = 0; i < 4; i++) {
      if (!ancestor) break;
      const cls = ancestor.className || '';
      if (/swipe|slide|carousel|Swipe|Slide|Carousel|ImageSlide|SlideImage|DivSlide|ImagePost/i.test(cls)) {
        isSlidePost = true; break;
      }
      const imgs = ancestor.querySelectorAll('img');
      if (imgs.length > 0) {
        for (const img of imgs) {
          const r = img.getBoundingClientRect();
          if (r.width > 100 && r.height > 100) { isSlidePost = true; break; }
        }
      }
      if (isSlidePost) break;
      ancestor = ancestor.parentElement;
    }
    if (isSlidePost) return;

    Array.from(videoParent.children).forEach(child => {
      if (child === video) return;
      if (child.querySelector('video,img')) return;
      const cs = window.getComputedStyle(child);
      const bg = cs.backgroundImage || '';
      const pos = cs.position;
      if ((bg.includes('gradient') || bg.includes('linear')) &&
          (pos === 'absolute' || pos === 'fixed')) {
        child.style.setProperty('opacity', '0', 'important');
        child.style.setProperty('visibility', 'hidden', 'important');
        child.style.setProperty('pointer-events', 'none', 'important');
      }
    });

    const grandParent = videoParent.parentElement;
    if (!grandParent) return;
    Array.from(grandParent.children).forEach(child => {
      if (child.contains(video)) return;
      if (child.querySelector('video,img')) return;
      const cs = window.getComputedStyle(child);
      const bg = cs.backgroundImage || '';
      const pos = cs.position;
      if ((bg.includes('gradient') || bg.includes('linear')) &&
          (pos === 'absolute' || pos === 'fixed')) {
        child.style.setProperty('opacity', '0', 'important');
        child.style.setProperty('visibility', 'hidden', 'important');
        child.style.setProperty('pointer-events', 'none', 'important');
      }
    });
  });
}

    const safeNukeGradients = () => {
    if (isSlideContext()) return;
    nukeGradients();
  };
  safeNukeGradients();
  setTimeout(safeNukeGradients, 500);
  setTimeout(safeNukeGradients, 1500);
  setTimeout(safeNukeGradients, 3000);

  document.addEventListener('mouseover', () => {
    setTimeout(safeNukeGradients, 50);
  }, true);

  const obs = new MutationObserver(() => {
    if (isSlideContext()) return;
    clearTimeout(window.__tptGradientTimer);
    window.__tptGradientTimer = setTimeout(safeNukeGradients, 300);
  });
  obs.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  setInterval(safeNukeGradients, 3000);
    window.__tptGradientNuke = nukeGradients;
  }

  // ── Hide TikTok left sidebar nav ─────────────────────────────────────────────
  function applyHideUI(hide) {
    const id = '__tpt_hide_style';
    let el = document.getElementById(id);
    if (hide) {
      if (!el) {
        el = document.createElement('style');
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = `
        /* TiktokM: hide TikTok native left sidebar navigation */
        [class*="DivSideNavContainer"],
        [class*="side-nav"],
        [class*="SideNav"],
        [class*="LeftSidebar"],
        [class*="left-sidebar"],
        [class*="DivLeftNav"],
        [data-e2e="nav-logo"],
        header[class*="Header"],
        [class*="DivHeaderContainer"],
        [class*="HeaderContainer"],
        nav[class*="Nav"],
        [class*="DivNavBar"],
        [class*="NavBar"][class*="Side"],
        [class*="DivSearchBar"],
        [class*="tns-"][class*="nav"],
        /* TikTok native 3-dot "more" button floating at top */
        [data-e2e="video-more"],
        [data-e2e="more-icon"],
        [class*="DivMore"],
        [class*="MoreButton"],
        [class*="DivThreeDot"],
        [class*="ThreeDot"],
        [class*="DivCloseButton"],
        [class*="CloseButton"],
        [data-e2e="browse-close"],
        button[aria-label*="Close"],
        [class*="DivVolume"],
        [class*="VolumeButton"],
        [data-e2e="video-volume"],
        [class*="DivSwipeUp"],
        [class*="DivSwipeDown"],
        [class*="NavigationButton"],
        [class*="DivArrow"],
        [class*="ArrowButton"],
        [data-e2e="arrow-up"],
        [data-e2e="arrow-down"],
        [data-e2e="browse-up"],
        [data-e2e="browse-down"],
        button[aria-label*="previous" i],
        button[aria-label*="next" i],
        [data-e2e="browse-ellipsis"],
        [data-e2e="browse-sound"] { display: none !important; }

        /* Hide scrollbar */
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        html, body {
          /* BỎ overflow: hidden - chỉ ẩn scrollbar */
          scrollbar-width: none !important;
          overflow-x: hidden !important;
          /* KHÔNG đặt overflow-y: hidden */
        }

        /* Expand main content area */
        [class*="DivMainContainer"],
        [class*="main-container"],
        main, [role="main"] { margin: 0 !important; padding: 0 !important; width: 100% !important; }

        /* ── FULLSCREEN FORCE: video fills 100% on all TikTok page types ── */
        /* Hide action-button column (allowed to break relay click) */
        [class*="DivActionItemContainer"],
        [class*="DivVideoActionBar"],
        [class*="VideoActionBar"],
        [class*="DivRightAction"],
        [class*="right-action"],
        [class*="RightAction"] {
          display: none !important;
          width: 0 !important;
          max-width: 0 !important;
          flex: 0 0 0 !important;
          overflow: hidden !important;
        }
        /* Force video containers to expand into freed space */
        [class*="DivVideoWrapper"],
        [class*="DivLeftContainer"],
        [class*="DivVideoPlayerContainer"],
        [class*="DivVideoPlayer"] {
          width: 100% !important; max-width: 100vw !important;
          min-width: 0 !important; flex: 1 1 100% !important;
        }
        [class*="DivBrowserModeContainer"],
        [class*="DivVideoItemWrap"],
        [class*="DivVideoItemContainer"] {
          max-width: 100% !important; width: 100% !important;
        }
        video { width: 100% !important; object-fit: contain !important; }
        [class*="Swipe"] img,
        [class*="Slide"] img,
        [class*="Carousel"] img,
        [class*="ImageSlide"] img,
        [class*="SlidePost"] img,
        [class*="PhotoPost"] img {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          max-width: 100% !important;
          object-fit: contain !important;
        }
        [class*="Swipe"],
        [class*="Slide"],
        [class*="Carousel"] {
          overflow: visible !important;
          width: 100% !important;
        }
      `;
    } else {
      if (el) el.remove();
    }
  }

  // ── Inject dark theme CSS for TikTok's native comment panel ──────────────────
  function injectCommentDarkTheme() {
    const id = '__tpt_comment_dark';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      /* TiktokM: Dark theme for TikTok native comment panel */
      [class*="DivCommentListContainer"],
      [class*="comment-list"],
      [class*="CommentList"],
      [class*="DivCommentContainer"],
      [data-e2e="comment-list"],
      [class*="DivCommentPanel"],
      [class*="comment-panel"] {
        background: #111 !important;
        color: #fff !important;
      }
      [class*="CommentItem"],
      [class*="comment-item"],
      [data-e2e="comment-item"] {
        background: transparent !important;
        border-color: rgba(255,255,255,0.07) !important;
      }
      [class*="CommentText"],
      [class*="comment-text"],
      [data-e2e="comment-text"],
      [class*="UserName"],
      [class*="user-name"] {
        color: rgba(255,255,255,0.92) !important;
      }
      [class*="CommentCount"],
      [class*="comment-count"],
      [class*="TimeStamp"],
      [class*="timestamp"] {
        color: rgba(255,255,255,0.45) !important;
      }
      /* Comment input area */
      [class*="DivReplyInput"],
      [class*="reply-input"],
      [class*="CommentInput"] {
        background: #222 !important;
        color: #fff !important;
      }
      /* Header of comment sheet */
      [class*="DivCommentHeader"],
      [class*="comment-header"] {
        background: #111 !important;
        border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        color: #fff !important;
      }
      /* Close/back button area */
      [class*="DivActionBar"][class*="Comment"],
      [class*="comment-action"] {
        background: #111 !important;
      }
    `;
    document.head.appendChild(el);
  }

  // ── Open TikTok's native comment section ─────────────────────────────────────
  function openNativeComments() {
    injectCommentDarkTheme();
    // Try clicking the native comment button
    const sels = [
      '[data-e2e="comment-icon"]',
      '[data-e2e="browse-comment-container"] button',
      '[class*="CommentButton"]',
      'button[aria-label*="omment"]',
      '[class*="comment-icon"]'
    ];
    for (const sel of sels) {
      const el = document.querySelector(sel);
      if (el) { el.click(); return true; }
    }
    return false;
  }

  // ── Message listener ─────────────────────────────────────────────────────────
  try {
    chrome.runtime.onMessage.addListener(msg => {
      if (msg.type === 'MOBILE_VIEW_HIDE_UI') applyHideUI(msg.hide);
      if (msg.type === 'CLEAN_MODE_UPDATE') applyCleanMode(msg.enable);
      // Sync mute state so auto-unmute doesn't fight user's mute setting
      if (msg.type === 'MUTE_STATE_SYNC') { window.__tptMuted = !!msg.muted; }
      if (msg.type === 'BGP_ENABLE' && !window.__tptBgOverrideApplied) {
        window.__tptBgOverrideApplied = true;
        applyBgPlayOverrides();
      }
      if (msg.type === 'OPEN_NATIVE_COMMENTS') {
        injectCommentDarkTheme();
        openNativeComments();
      }
      if (msg.type === 'INJECT_COMMENT_DARK') {
        injectCommentDarkTheme();
      }
    });
  } catch (e) {}

  // ── Init bgPlay from storage + apply sidebar hide immediately ────────────────
  try {
    chrome.storage.sync.get(['bgPlay', 'cleanMode', 'mobileView', 'cleanModeSuppressed'], data => {
      if (data && data.bgPlay) applyBgPlayOverrides();
      // Always hide sidebar if mobileView is enabled — prevents the 1-2s flash
      if (data && data.mobileView) applyHideUI(true);
      // Always start auto-unmute watcher BEFORE applying clean mode,
      // so the native volume button is still visible when unmute runs.
      startAutoUnmuteWatcher();
      hideHoverGradients();
      // Apply clean mode AFTER unmute watcher has had time to click the volume button.
      // Skip if cleanModeSuppressed flag is set (user is on search page)
      if (data && data.cleanMode && !data.cleanModeSuppressed) {
          setTimeout(() => applyCleanMode(true), 2000);
      }
    });
  } catch (e) {}

  // ── Safe collapse of right columns: only modifies style, no DOM removal ───────
  // This safely hides the right action column without breaking scroll/virtualization
  function collapseRightColumnSafely() {
    try {
      const largeImgs = Array.from(document.querySelectorAll('img')).filter(img => {
        const r = img.getBoundingClientRect();
        return r.width > 100 && r.height > 100;
      });
      if (largeImgs.length >= 2) return;

      const slideSelectors = [
        '[class*="Swipe"]', '[class*="Slide"]', '[class*="Carousel"]',
        '[class*="ImageSlide"]', '[class*="SlidePost"]', '[class*="DivSlide"]',
        '[class*="ImagePost"]', '[class*="PhotoPost"]',
      ];
      for (const sel of slideSelectors) {
        if (document.querySelector(sel)) return;
      }

      const medias = Array.from(document.querySelectorAll('video, img'))
        .filter(el => {
          const r = el.getBoundingClientRect();
          return r.width >= 160 && r.height >= 160;
        });
      medias.forEach(media => {
        if (media.tagName === 'IMG') return;
        let row = media.parentElement;
        for (let i = 0; i < 5 && row; i++) {
          if (!row || row === document.body || row === document.documentElement) break;
          
          const cs = window.getComputedStyle(row);
          const isFlexRow = cs && cs.display && cs.display.includes('flex') && 
                           (cs.flexDirection === 'row' || cs.flexDirection === 'row-reverse' || !cs.flexDirection);
          const isGrid = cs && cs.display && cs.display.includes('grid');

          if (isFlexRow || isGrid) {
            // Critical: skip if this is the scroll container
            const overflowY = cs.overflowY;
            if (overflowY === 'scroll' || overflowY === 'auto') break;

            const children = Array.from(row.children);
            // Only modify if there are multiple children (video + something else)
            if (children.length >= 2) {
              children.forEach(ch => {
                if (ch.contains(media)) {
                  // Expand media container
                  ch.style.setProperty('flex', '1 1 auto', 'important');
                  ch.style.setProperty('min-width', '0', 'important');
                  ch.style.setProperty('width', '100%', 'important');
                  ch.style.setProperty('max-width', '100%', 'important');
                  ch.style.setProperty('padding-right', '0', 'important');
                  ch.style.setProperty('margin-right', '0', 'important');
                } else {
                  // Check if on right side and hide it
                  const cr = ch.getBoundingClientRect();
                  const rr = row.getBoundingClientRect();
                  const isRightSide = cr.left > rr.left + rr.width * 0.6;
                  if (isRightSide) {
                    ch.style.setProperty('display', 'none', 'important');
                    ch.style.setProperty('width', '0', 'important');
                    ch.style.setProperty('max-width', '0', 'important');
                    ch.style.setProperty('flex', '0 0 0', 'important');
                    ch.style.setProperty('overflow', 'hidden', 'important');
                  }
                }
              });

              // Tighten row without touching overflow-y
              row.style.setProperty('gap', '0', 'important');
              row.style.setProperty('padding-right', '0', 'important');
              row.style.setProperty('margin-right', '0', 'important');

              if (isGrid) {
                row.style.setProperty('grid-template-columns', '1fr', 'important');
              }
              // Found matching row, stop searching ancestors
              break;
            }
          }

          row = row.parentElement;
        }
      });
    } catch (e) {}
  }

  // ── Forces video to fill 100% regardless of which TikTok page type is loaded ──
  // This patches the desktop flex-row layout (video beside action buttons)
  // so it looks identical to the mobile browse fullscreen layout.
  (function persistentFullscreenEnforcer() {
    if (window.__tptFullscreenEnforcer) return;
    window.__tptFullscreenEnforcer = true;

    const ACTION_SELS = [
      '[class*="DivActionItemContainer"]',
      '[class*="DivVideoActionBar"]',
      '[class*="VideoActionBar"]',
      '[class*="DivRightAction"]',
      '[class*="right-action"]',
    ];
    const VIDEO_WRAP_SELS = [
      '[class*="DivVideoWrapper"]',
      '[class*="DivLeftContainer"]',
      '[class*="DivVideoPlayerContainer"]',
      '[class*="DivVideoPlayer"]',
    ];

    function enforceFullscreen() {
      if (isSlideContext()) return;
      // 1. Hide action columns with display:none to remove layout spacing completely
      ACTION_SELS.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('width', '0', 'important');
          el.style.setProperty('max-width', '0', 'important');
          el.style.setProperty('flex', '0 0 0', 'important');
          el.style.setProperty('overflow', 'hidden', 'important');
        });
      });

      // 2. Expand video containers into freed space and remove gaps/padding
      VIDEO_WRAP_SELS.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          // Safety: skip containers that hold action items (not video)
          if (el.querySelector('[data-e2e="browse-like-container"],[data-e2e="like-container"]')) return;
          el.style.setProperty('width', '100%', 'important');
          el.style.setProperty('max-width', '100vw', 'important');
          el.style.setProperty('min-width', '0', 'important');
          el.style.setProperty('flex', '1 1 100%', 'important');
          el.style.setProperty('gap', '0', 'important');
          el.style.setProperty('padding', '0', 'important');
          el.style.setProperty('margin', '0', 'important');
        });
      });

      // 2.5 Clean up parent flex containers to prevent gap/padding issues
      document.querySelectorAll('[class*="DivBrowserModeContainer"], [class*="DivVideoItemWrap"], [class*="DivVideoItemContainer"]').forEach(el => {
        el.style.setProperty('width', '100%', 'important');
        el.style.setProperty('max-width', '100vw', 'important');
        el.style.setProperty('gap', '0', 'important');
        el.style.setProperty('padding', '0', 'important');
        el.style.setProperty('margin', '0', 'important');
      });

      // 3. Force video element to fill
      document.querySelectorAll('video').forEach(v => {
        v.style.setProperty('width', '100%', 'important');
        v.style.setProperty('object-fit', 'cover', 'important');
      });

      // 4. Safely collapse right columns (safe version, no DOM removal)
      collapseRightColumnSafely();
    }

    // Run immediately
    enforceFullscreen();
    
    function isSlideContext() {
      if (location.href.includes('/photo/') || location.href.includes('slideshow')) return true;
      const slideSelectors = [
        '[class*="Swipe"]', '[class*="Carousel"]',
        '[class*="ImageSlide"]', '[class*="SlidePost"]',
        '[class*="PhotoPost"]', '[class*="DivSlide"]',
        '[class*="ImageCarousel"]', '[class*="SlideShow"]',
      ];
      for (const sel of slideSelectors) {
        if (document.querySelector(sel)) return true;
      }
      const largeImgs = Array.from(document.querySelectorAll('img')).filter(img => {
        const r = img.getBoundingClientRect();
        return r.width > 150 && r.height > 150;
      });
      return largeImgs.length >= 2;
    }

    let collapseTimer = null;
    const obs = new MutationObserver(() => {
      if (isSlideContext()) return;
      if (collapseTimer) clearTimeout(collapseTimer);
      collapseTimer = setTimeout(() => {
        collapseRightColumnSafely();
        collapseTimer = null;
      }, 500); // Only run every 500ms
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  })();

  // Apply zoom only on home page based on URL
  function applyHomeZoom() {
    const isHome = location.href.includes('/foryou') || 
                   location.href === 'https://www.tiktok.com/' ||
                   location.pathname === '/';
    
    const styleId = '__tpt_home_zoom';
    let el = document.getElementById(styleId);
    
    if (isHome) {
      if (!el) {
        el = document.createElement('style');
        el.id = styleId;
        document.head.appendChild(el);
      }
      el.textContent = `
        [class*="DivMediaCardOverlayTop"] {
          display: none !important;
        }
        [class*="StyledTimeDisplayText"] {
          display: none !important;
        }
        [class*="DivOverlayBottomContent"] {
          zoom: 0.5 !important;
          transform-origin: bottom left !important;
        }
        [class*="DivMediaCardOverlay"] {
          position: absolute !important;
          top: 0 !important; left: 0 !important;
          right: 0 !important; bottom: 0 !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-end !important;
          pointer-events: none !important;
        }
        [class*="DivMediaCardOverlayBottom"] {
          pointer-events: all !important;
          width: 100% !important;
        }
        [class*="DivVideoProgressContainer"] {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /* Parent cân relative */
        [class*="SectionMediaCardContainer"],
        [class*="BasePlayerContainer"],
        [class*="DivVideoPlayerContainer"] {
          position: relative !important;
        }
      `;

      // JS: move bottom overlay into video container
      function moveBottomOverlay() {
        document.querySelectorAll('[class*="DivMediaCardOverlayBottom"]').forEach(bottom => {
          // Tìm video container gân nhát
          const section = bottom.closest('[class*="SectionMediaCardContainer"]') ||
                          bottom.closest('[data-e2e="feed-video"]');
          if (!section) return;

          const videoContainer = section.querySelector('[class*="DivContainer"][class*="e1sq7r4z0"]') ||
                                 section.querySelector('[class*="DivBasicPlayerWrapper"]') ||
                                 section.querySelector('video')?.closest('[class*="DivContainer"]');
          if (!videoContainer) return;

          // Néu chua move ròi thì bõ qua
          if (bottom.dataset.tptMoved === '1') return;
          bottom.dataset.tptMoved = '1';

          // Set style cho container video
          videoContainer.style.setProperty('position', 'relative', 'important');

          // Move bottom vào trong video
          videoContainer.appendChild(bottom);

          // Style cho bottom sau khi move
          bottom.style.setProperty('position', 'absolute', 'important');
          bottom.style.setProperty('bottom', '0', 'important');
          bottom.style.setProperty('left', '0', 'important');
          bottom.style.setProperty('right', '0', 'important');
          bottom.style.setProperty('top', 'auto', 'important');
          bottom.style.setProperty('zoom', '0.6', 'important');
        });
      }

      moveBottomOverlay();
      setTimeout(moveBottomOverlay, 500);
      setTimeout(moveBottomOverlay, 1500);
      setTimeout(moveBottomOverlay, 3000);

      const __tptMoveObs = new MutationObserver(() => {
        clearTimeout(window.__tptMoveTimer);
        window.__tptMoveTimer = setTimeout(moveBottomOverlay, 300);
      });
      __tptMoveObs.observe(document.documentElement, { childList: true, subtree: true });
      
    } else {
      if (el) el.remove();
      if (window.__tptOverlayObs) {
        window.__tptOverlayObs.disconnect();
        window.__tptOverlayObs = null;
      }
    }
  }

  // Cháy ngay và theo dõi khi URL thay doi
  applyHomeZoom();
  const __tptHomeZoomObs = new MutationObserver(() => applyHomeZoom());
  __tptHomeZoomObs.observe(document.documentElement, { childList: true, subtree: true });

})();
