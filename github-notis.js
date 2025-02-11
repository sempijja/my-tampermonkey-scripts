// ==UserScript==
// @name         GitHub Notifications Hover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show GitHub notifications on hover
// @author       Your Name
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    // Replace with your GitHub personal access token
    const GITHUB_TOKEN = '';

    // Select the notifications button
    const notificationsButton = document.querySelector('a[href="/notifications"]');
    if (!notificationsButton) return;

    // Create a dropdown container
    const dropdown = document.createElement('div');
    dropdown.style.position = 'absolute';
    dropdown.style.backgroundColor = 'black';
    dropdown.style.border = '1px solid #e1e4e8';
    dropdown.style.borderRadius = '6px';
    dropdown.style.boxShadow = '0 8px 24px rgba(149, 157, 165, 0.2)';
    dropdown.style.padding = '8px';
    dropdown.style.zIndex = '1000';
    dropdown.style.display = 'none'; // Hide by default
    document.body.appendChild(dropdown);

    // Fetch notifications on hover
    notificationsButton.addEventListener('mouseover', async () => {
        if (dropdown.innerHTML) return; // Skip if already loaded

        // Fetch notifications using GitHub API
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.github.com/notifications',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`
            },
            onload: function (response) {
                const notifications = JSON.parse(response.responseText);
                dropdown.innerHTML = ''; // Clear previous content

                if (notifications.length === 0) {
                    dropdown.innerHTML = '<div>No new notifications</div>';
                } else {
                    notifications.forEach(notification => {
                        const item = document.createElement('div');
                        item.textContent = notification.subject.title;
                        dropdown.appendChild(item);
                    });
                }

                // Position the dropdown near the button
                const rect = notificationsButton.getBoundingClientRect();
                dropdown.style.top = `${rect.bottom + window.scrollY}px`;
                dropdown.style.left = `${rect.left + window.scrollX}px`;
                dropdown.style.display = 'block';
            },
            onerror: function (error) {
                dropdown.innerHTML = '<div>Failed to load notifications</div>';
                console.error('Error fetching notifications:', error);
            }
        });
    });

    // Hide dropdown on mouseout
    notificationsButton.addEventListener('mouseout', () => {
        dropdown.style.display = 'none';
    });
})();
