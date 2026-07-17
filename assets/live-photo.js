/*******************************************************************************
LIVE PHOTO SCRIPT
Apple-style Live Photo interaction: hover to play, leave to pause.
On mobile: long-press or tap to toggle.
*******************************************************************************/

(function () {
  'use strict';

  /**
   * Initialize a single live-photo element.
   * @param {HTMLElement} container - The .live-photo wrapper element.
   */
  function initLivePhoto(container) {
    // Prevent double-init
    if (container.dataset.livePhotoReady === 'true') return;

    const img = container.querySelector('img');
    const badge = container.querySelector('.live-photo-badge');
    const videoSrc = container.dataset.videoSrc;

    if (!img || !videoSrc) {
      console.warn('[live-photo] Missing image or data-video-src on element:', container);
      return;
    }

    // Create video element
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none'; // Lazy load video
    video.setAttribute('disableRemotePlayback', '');
    video.innerHTML = `<source src="${escapeHTML(videoSrc)}" type="video/mp4">`;
    container.appendChild(video);

    // --- Desktop: hover to play ---
    let hoverTimer = null;

    container.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(() => {
        playVideo(container, video);
      }, 150); // small delay to avoid accidental triggers
    });

    container.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      stopVideo(container, video);
    });

    // --- Touch / mobile: tap to toggle ---
    container.addEventListener('click', (e) => {
      // Don't double-fire with hover on touch-enabled devices
      if (container.classList.contains('playing')) {
        stopVideo(container, video);
      } else {
        playVideo(container, video);
      }
    });

    // --- Touch: long-press to play (Apple-style) ---
    let longPressTimer = null;

    container.addEventListener('touchstart', (e) => {
      longPressTimer = setTimeout(() => {
        playVideo(container, video);
      }, 300);
    }, { passive: true });

    container.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
      if (container.classList.contains('playing')) {
        // Keep playing after long-press release, tap again to stop
      }
    });

    container.addEventListener('touchcancel', () => {
      clearTimeout(longPressTimer);
    });

    // --- Load video metadata when first needed ---
    container.addEventListener('mouseenter', function preloadOnce() {
      if (video.preload === 'none') {
        video.preload = 'metadata';
        video.load();
      }
      container.removeEventListener('mouseenter', preloadOnce);
    }, { once: true });

    container.dataset.livePhotoReady = 'true';
  }

  /**
   * Play the live photo video.
   */
  function playVideo(container, video) {
    if (container.classList.contains('playing')) return;
    container.classList.add('playing');

    // Reset and play
    video.currentTime = 0;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // AbortError is normal when quickly hovering in/out
        if (err.name !== 'AbortError') {
          console.warn('[live-photo] Video play failed:', err.message);
        }
        container.classList.remove('playing');
      });
    }
  }

  /**
   * Stop the live photo video and show the still image.
   */
  function stopVideo(container, video) {
    container.classList.remove('playing');
    video.pause();
  }

  /**
   * Escape HTML special characters.
   */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * Scan the page for .live-photo elements and initialize them.
   */
  function scanAndInit() {
    const elements = document.querySelectorAll('.live-photo');
    elements.forEach(initLivePhoto);
  }

  // --- Bootstrap ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAndInit);
  } else {
    scanAndInit();
  }

  // Also observe dynamically added elements (for SPA-like navigation)
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && node.classList.contains('live-photo')) {
              initLivePhoto(node);
            }
            // Check children too
            const children = node.querySelectorAll('.live-photo');
            children.forEach(initLivePhoto);
          }
        }
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();
