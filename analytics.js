/* =====================================================================
   MacÉireann — Google Analytics 4 with Consent Mode v2 + cookie banner
   ---------------------------------------------------------------------
   - GA loads on every page with consent DENIED by default, so no cookies
     are set until the visitor accepts. Until then GA runs in Google's
     cookieless "modelled" mode (you still get basic, privacy-safe data).
   - A themed banner asks the visitor to Accept or Decline. Their choice
     is remembered in localStorage and can be changed any time via a link
     with  data-cookie-settings  (e.g. "Cookie settings" in the footer).

   SETUP: set GA_MEASUREMENT_ID to your GA4 ID (already done below).
   Loaded on every page via  <script defer src="/analytics.js"></script>.
   Tracks two conversions: app_store_click and newsletter_signup.
   ===================================================================== */

var GA_MEASUREMENT_ID = 'G-8E51WC26FH';

// gtag must be global so inline form handlers can fire events too.
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

(function () {
    if (GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) return; // not configured

    var STORAGE_KEY = 'mac-cookie-consent'; // 'granted' | 'declined'

    function readChoice() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function saveChoice(v) {
        try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
    }

    // --- Consent Mode v2: deny everything up front ----------------------
    gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        wait_for_update: 500
    });

    // Re-apply a previously granted choice before GA initialises.
    if (readChoice() === 'granted') {
        gtag('consent', 'update', { analytics_storage: 'granted' });
    }

    // --- Load GA ---------------------------------------------------------
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    // Conversion: App Store button clicks.
    document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a.app-store-btn') : null;
        if (a) gtag('event', 'app_store_click', { link_url: a.href, page_path: location.pathname });
    });

    // --- Consent banner --------------------------------------------------
    function applyConsent(granted) {
        gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
        saveChoice(granted ? 'granted' : 'declined');
    }

    function injectStyles() {
        if (document.getElementById('mac-consent-styles')) return;
        var css = document.createElement('style');
        css.id = 'mac-consent-styles';
        css.textContent =
            '#mac-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;' +
            'max-width:640px;margin:0 auto;background:rgba(15,41,30,0.97);color:#f1efe8;' +
            'border:1px solid rgba(255,255,255,0.12);border-radius:14px;' +
            'box-shadow:0 14px 40px rgba(0,0,0,0.4);backdrop-filter:blur(10px);' +
            '-webkit-backdrop-filter:blur(10px);padding:20px 22px;' +
            "font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;" +
            'opacity:0;transform:translateY(12px);transition:opacity .35s ease,transform .35s ease;}' +
            '#mac-consent.is-visible{opacity:1;transform:translateY(0);}' +
            '#mac-consent p{margin:0 0 14px 0;font-size:.92rem;line-height:1.55;color:rgba(241,239,232,0.9);}' +
            '#mac-consent a{color:#E67E22;text-decoration:underline;}' +
            '#mac-consent .mac-consent-actions{display:flex;gap:10px;flex-wrap:wrap;}' +
            '#mac-consent button{flex:1 1 auto;min-width:120px;cursor:pointer;border-radius:8px;' +
            'padding:11px 18px;font-size:.85rem;font-weight:600;letter-spacing:.5px;' +
            'text-transform:uppercase;font-family:inherit;transition:all .25s ease;}' +
            '#mac-consent .mac-accept{background:#E67E22;color:#fff;border:none;}' +
            '#mac-consent .mac-accept:hover{background:#d67118;}' +
            '#mac-consent .mac-decline{background:transparent;color:#f1efe8;' +
            'border:1px solid rgba(255,255,255,0.4);}' +
            '#mac-consent .mac-decline:hover{background:rgba(255,255,255,0.08);}';
        document.head.appendChild(css);
    }

    function showBanner() {
        if (document.getElementById('mac-consent')) return;
        injectStyles();
        var bar = document.createElement('div');
        bar.id = 'mac-consent';
        bar.setAttribute('role', 'dialog');
        bar.setAttribute('aria-label', 'Cookie consent');
        bar.innerHTML =
            '<p>We use cookies to understand how visitors use the site and improve it. ' +
            'You can accept analytics cookies or decline. See our ' +
            '<a href="/privacy.html#cookies">Privacy Policy</a>.</p>' +
            '<div class="mac-consent-actions">' +
            '<button type="button" class="mac-decline">Decline</button>' +
            '<button type="button" class="mac-accept">Accept</button>' +
            '</div>';
        document.body.appendChild(bar);
        requestAnimationFrame(function () { bar.classList.add('is-visible'); });

        function close() {
            bar.classList.remove('is-visible');
            setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 350);
        }
        bar.querySelector('.mac-accept').addEventListener('click', function () { applyConsent(true); close(); });
        bar.querySelector('.mac-decline').addEventListener('click', function () { applyConsent(false); close(); });
    }

    // Public API so a "Cookie settings" link can reopen the banner.
    window.macConsent = {
        accept: function () { applyConsent(true); },
        decline: function () { applyConsent(false); },
        reopen: showBanner
    };

    // Any element marked  data-cookie-settings  reopens the banner.
    document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
        if (t) { e.preventDefault(); showBanner(); }
    });

    // Show the banner on first visit (no stored choice yet).
    function start() { if (!readChoice()) showBanner(); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
