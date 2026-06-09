/* =====================================================================
   MacÉireann — Google Analytics 4
   ---------------------------------------------------------------------
   SETUP: replace G-XXXXXXXXXX below with your GA4 Measurement ID.
   Find it in Google Analytics → Admin → Data streams → (your web stream).
   Until you do, this file does nothing (no requests, no tracking), so it
   is safe to leave in place.

   Loaded on every page via <script defer src="/analytics.js"></script>.
   Automatically tracks two conversions:
     - app_store_click   : any "Download on the App Store" button
     - newsletter_signup : a successful email signup (fired from the forms)
   ===================================================================== */

var GA_MEASUREMENT_ID = 'G-8E51WC26FH';

(function () {
    // Not configured yet — do nothing so the placeholder never makes requests.
    if (GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) return;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    // Conversion: App Store button clicks (works for any current/future badge).
    document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a.app-store-btn') : null;
        if (a) {
            gtag('event', 'app_store_click', {
                link_url: a.href,
                page_path: location.pathname
            });
        }
    });
})();
