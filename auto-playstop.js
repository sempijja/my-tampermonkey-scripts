// ==UserScript==
// @name         Disable Video Autoplay (Allow GIFs)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Disable autoplay for all videos on a webpage, but allow GIFs to play
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('video').forEach(video => {
        if (!video.src.endsWith('.gif')) {
            video.autoplay = false;
        }
    });
})();
