// ==UserScript==
// @name         Facebook Bulk Unfollow (With Credit) - August 2025
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Unfollow all profiles from following list on Facebook (with working selectors and credit)
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const log = console.log;

    const waitForPage = setInterval(() => {
        const container = document.querySelector('body');
        if (container) {
            clearInterval(waitForPage);
            log('✅ Facebook DOM loaded. Injecting buttons...');
            injectButtons();
        }
    }, 1000);

    function injectButtons() {
        // 🚀 Start Unfollow button
        const btn = document.createElement("button");
        btn.innerText = "🚀 Start Unfollow";
        Object.assign(btn.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "10px 15px",
            backgroundColor: "#f02849",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        });
        btn.addEventListener("click", startUnfollow);
        document.body.appendChild(btn);

        // 👤 Credit Link Button
        const credit = document.createElement("a");
        credit.innerText = "👤 By Naqash";
        credit.href = "https://nullpk.com";
        credit.target = "_blank";
        Object.assign(credit.style, {
            position: "fixed",
            top: "60px",
            right: "20px",
            zIndex: 9999,
            padding: "5px 10px",
            backgroundColor: "#333",
            color: "#ccc",
            border: "1px solid #555",
            borderRadius: "4px",
            fontSize: "12px",
            textDecoration: "none",
            fontFamily: "sans-serif"
        });
        document.body.appendChild(credit);
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function startUnfollow() {
        log("🚀 Starting smart unfollow...");

        const menuButtons = Array.from(document.querySelectorAll('div[aria-label][role="button"]'))
            .filter(el => el.getAttribute('aria-label').includes('Actions') || el.getAttribute('aria-label').includes('More'));

        log(`🧷 Found ${menuButtons.length} 3-dot menus.`);

        for (let i = 0; i < menuButtons.length; i++) {
            const btn = menuButtons[i];
            try {
                btn.scrollIntoView({ behavior: "smooth", block: "center" });
                await sleep(1000);
                btn.click();
                log(`➡️ Opened menu #${i + 1}`);
                await sleep(1500);

                const unfollowOption = Array.from(document.querySelectorAll('div[role="menuitem"]'))
                    .find(el => el.innerText.trim().toLowerCase() === 'unfollow');

                if (unfollowOption) {
                    unfollowOption.click();
                    log(`❌ Unfollowed #${i + 1}`);
                } else {
                    log(`⚠️ Unfollow option not found for #${i + 1}`);
                }

                await sleep(1500);
            } catch (error) {
                log(`❌ Error with menu #${i + 1}:`, error);
            }
        }

        log("✅ Done unfollowing.");
    }
})();
