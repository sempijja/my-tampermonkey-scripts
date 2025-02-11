// ==UserScript==
// @name         Twitter DM Search
// @namespace    https://x.com/
// @version      1.0
// @description  Adds a search bar to Twitter DMs to find messages by keyword and highlight them.
// @author       Charz
// @match        https://x.com/messages/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addSearchBar() {
        if (document.querySelector("#dm-search-bar")) return; // Prevent duplicate bars

        // Create search input
        let searchBar = document.createElement("input");
        searchBar.type = "text";
        searchBar.id = "dm-search-bar";
        searchBar.placeholder = "Search messages...";
        searchBar.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 250px;
            padding: 5px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 9999;
            color: white
            background-color: grey;
        `;

        document.body.appendChild(searchBar);

        // Add event listener for searching
        searchBar.addEventListener("input", function() {
            let query = this.value.trim().toLowerCase();
            highlightMessages(query);
        });
    }

    function highlightMessages(query) {
        // Remove previous highlights
        document.querySelectorAll(".highlighted-message").forEach(el => {
            el.innerHTML = el.textContent; // Reset to original text
            el.classList.remove("highlighted-message");
        });

        if (!query) return;

        let messages = document.querySelectorAll("[data-testid='messageEntry']");
        messages.forEach(message => {
            let text = message.textContent.toLowerCase();
            if (text.includes(query)) {
                let regex = new RegExp(`(${query})`, "gi");
                message.innerHTML = message.textContent.replace(regex, `<span style="background-color: #ffff99; padding: 2px;">$1</span>`);
                message.classList.add("highlighted-message");
            }
        });
    }

    // Observe for page changes (for dynamic Twitter interface)
    const observer = new MutationObserver(() => {
        if (window.location.href.includes("/messages/")) {
            addSearchBar();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
