'use strict';

const iframe  = document.getElementById('tiktok-iframe');
const loading = document.querySelector('.loading');
const refreshBtn = document.getElementById('refresh-btn');
const muteBtn    = document.getElementById('mute-btn');
const closeBtn   = document.getElementById('close-btn');

// Load iframe
iframe.onload = () => {
  loading.style.display = 'none';
  iframe.style.display  = 'block';
};

// Control buttons
refreshBtn.onclick = () => {
  iframe.src = iframe.src;
};

muteBtn.onclick = () => {
  chrome.runtime.sendMessage({ type: 'TOGGLE_MUTE_FLOAT' });
};

closeBtn.onclick = () => {
  window.close();
};

// Handle messages from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'FLOAT_WIN_MUTE') {
    // Update mute button state if needed
  }
});
