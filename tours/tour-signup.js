// Shared waitlist signup for tour pages.
// Wires every <form class="waitlist-form"> on the page and tags the
// submission with the form's data-source so signups can be attributed
// to the tour the visitor came from.
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form.waitlist-form').forEach(function (form) {
        var input = form.querySelector('input[type="email"]');
        var msg = form.parentElement.querySelector('.signup-msg');
        var source = form.getAttribute('data-source') || 'tour-page';

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (msg) msg.classList.add('hidden');

            try {
                var res = await fetch('https://newsletter-worker.jobee-dev.workers.dev/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: input.value, source: source })
                });

                if (res.ok) {
                    if (window.gtag) gtag('event', 'newsletter_signup', { source: source });
                    form.innerHTML = '<p class="signup-msg success">Sláinte! You\'re on the list — we\'ll be in touch.</p>';
                } else {
                    var err = await res.json().catch(function () { return { error: 'Something went wrong' }; });
                    if (msg) {
                        msg.textContent = err.error || 'Something went wrong. Please try again.';
                        msg.className = 'signup-msg error';
                    }
                }
            } catch (e) {
                if (msg) {
                    msg.textContent = 'Network error. Please try again.';
                    msg.className = 'signup-msg error';
                }
            }
        });
    });
});
