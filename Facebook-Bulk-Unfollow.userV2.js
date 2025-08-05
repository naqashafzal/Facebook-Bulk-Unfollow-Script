// ==UserScript==
// @name         Facebook Bulk Unfollow Tool + Auto Scroll
// @namespace    https://nullpk.com
// @version      4.0
// @description  Auto scroll & unfollow up to 100 profiles from Facebook /friends_following page.
// @author       nullpk.com
// @match        https://www.facebook.com/*/friends_following*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Scroll to load more profiles
    async function autoScrollToBottom(duration = 8000) {
        console.log("🔽 Auto scrolling...");
        const end = Date.now() + duration;
        while (Date.now() < end) {
            window.scrollTo(0, document.body.scrollHeight);
            await wait(1000);
        }
        window.scrollTo(0, 0); // return to top
        console.log("✅ Done scrolling.");
    }

    // Start unfollow process
    async function startUnfollow() {
        if (isRunning) return;
        isRunning = true;

        console.log("🚀 Starting unfollow process...");
        await autoScrollToBottom(8000); // scroll 8 seconds

        const menus = Array.from(document.querySelectorAll('div[aria-label][role="button"]'))
            .filter(btn => btn.getAttribute('aria-label').includes("Actions for") || btn.getAttribute('aria-label').includes("More options"));

        console.log(`🧷 Found ${menus.length} menu buttons`);

        let unfollowed = 0;

        for (let i = 0; i < menus.length && unfollowed < 100; i++) {
            menus[i].click();
            await wait(1000);

            const items = document.querySelectorAll('[role="menuitem"]');
            let found = false;

            for (const item of items) {
                if (item.innerText.toLowerCase().includes("unfollow")) {
                    item.click();
                    unfollowed++;
                    found = true;
                    console.log(`❌ Unfollowed #${unfollowed}`);
                    break;
                }
            }

            if (!found) {
                console.log(`⚠️ No unfollow option for item #${i + 1}`);
            }

            document.body.click(); // close menu
            await wait(1500);
        }

        alert(`🎉 Done! Unfollowed ${unfollowed} profiles.\nMade by nullpk.com`);
        isRunning = false;
    }

    // Add buttons
    function addUI() {
        if (document.getElementById('nullpk-start')) return;

        const startBtn = document.createElement('button');
        startBtn.id = 'nullpk-start';
        startBtn.innerText = '🚀 Start Unfollow';
        startBtn.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            padding: 10px 18px;
            background-color: #1877f2;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        startBtn.onclick = startUnfollow;

        const credit = document.createElement('a');
        credit.href = 'https://nullpk.com';
        credit.target = '_blank';
        credit.innerText = '👤 nullpk.com';
        credit.style = `
            position: fixed;
            top: 65px;
            right: 20px;
            z-index: 99999;
            background: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            text-decoration: none;
            color: black;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(startBtn);
        document.body.appendChild(credit);
    }

    // Watch for the page to load
    function observePage() {
        const observer = new MutationObserver(() => {
            if (window.location.href.includes("/friends_following")) {
                addUI();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observePage();
})();
