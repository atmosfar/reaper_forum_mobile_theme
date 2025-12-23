// ==UserScript==
// @name         Cockos Forums Inject Viewport
// @namespace    https://forum.cockos.com
// @version      1.0
// @description  Ensure proper mobile viewport on forum.cockos.com and forums.cockos.com for responsive scaling and fonts
// @match        https://forum.cockos.com/*
// @match        https://forums.cockos.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  // Desired viewport content. Adjust if you prefer different scaling options.
  const VIEWPORT_CONTENT = 'width=device-width, initial-scale=1.0, maximum-scale=2.0, viewport-fit=cover';

  function setViewport() {
    try {
      const doc = document;
      if (!doc || !doc.head) return;

      // Find existing viewport meta (case-insensitive)
      const existing = Array.from(doc.head.getElementsByTagName('meta'))
        .find(m => (m.getAttribute('name') || '').toLowerCase() === 'viewport');

      if (existing) {
        // Update only if different to avoid unnecessary writes
        if (existing.getAttribute('content') !== VIEWPORT_CONTENT) {
          existing.setAttribute('content', VIEWPORT_CONTENT);
        }
      } else {
        const meta = doc.createElement('meta');
        meta.name = 'viewport';
        meta.content = VIEWPORT_CONTENT;
        // Put near the start of head
        if (doc.head.firstChild) doc.head.insertBefore(meta, doc.head.firstChild);
        else doc.head.appendChild(meta);
      }
    } catch (e) {
      // silent fail
      console.error('Viewport injector error:', e);
    }
  }

  // If document.head exists now, set immediately; otherwise wait briefly.
  if (document.head) {
    setViewport();
  } else {
    const observer = new MutationObserver((mutations, obs) => {
      if (document.head) {
        setViewport();
        obs.disconnect();
      }
    });
    observer.observe(document.documentElement, {childList: true});
    // Fallback timeout
    setTimeout(() => { setViewport(); observer.disconnect(); }, 2000);
  }
})();

