document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle Controller with Focus Management
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        function toggleMenu(forceClose = false) {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            const shouldClose = forceClose || isExpanded;

            mobileMenuToggle.setAttribute('aria-expanded', String(!shouldClose));
            mobileMenu.setAttribute('aria-hidden', String(shouldClose));
            mobileMenuToggle.classList.toggle('active', !shouldClose);
            mobileMenu.classList.toggle('active', !shouldClose);
            mobileMenuToggle.setAttribute('aria-label', shouldClose ? 'Menü öffnen' : 'Menü schließen');

            if (!shouldClose) {
                // Focus first menu item when opening to aid screen readers and keyboard navigation
                const firstLink = mobileMenu.querySelector('a');
                if (firstLink) {
                    // Small timeout to allow visibility transition
                    setTimeout(() => firstLink.focus(), 50);
                }
            }
        }

        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded && !mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                toggleMenu(true);
            }
        });

        // Close the mobile menu with Escape key and restore focus to the toggle button
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    toggleMenu(true);
                    mobileMenuToggle.focus();
                }
            }
        });
    }

    // 2. Map Facade Replacement with Focus Redirection
    document.querySelectorAll('.map-facade').forEach(facade => {
        function loadMap() {
            const src = facade.dataset.src;
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.width = '100%';
            iframe.height = '200';
            iframe.frameBorder = '0';
            iframe.style.cssText = 'border:0;border-radius:8px;display:block;';
            iframe.allowFullscreen = true;
            iframe.title = 'Karte: Netz-Weise, Freundallee 13A, 30173 Hannover';
            iframe.tabIndex = 0; // Make focusable
            facade.replaceWith(iframe);
            iframe.focus();
        }
        facade.addEventListener('click', loadMap);
        facade.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadMap();
            }
        });
    });

    // 3. Smooth Scrolling for Internal Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Focus the target element (or its heading) if possible for accessibility
                if (target.tabIndex === undefined || target.tabIndex === -1) {
                    target.setAttribute('tabindex', '-1');
                }
                target.focus({ preventScroll: true });
            }
        });
    });

    // 4. Dynamic Footer Copyright Year
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});

// 5. Global Copy-to-Clipboard Utility (exposed to global scope for HTML inline calls)
window.copyToClipboard = function(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const text = element.textContent;
    const button = element.nextElementSibling || document.querySelector(`button[onclick*="${elementId}"]`);
    if (!button) return;
    const originalIcon = button.innerHTML;
    const originalLabel = button.getAttribute('aria-label') || 'Code kopieren';

    navigator.clipboard.writeText(text).then(() => {
        button.classList.add('success');
        button.setAttribute('aria-label', 'Code kopiert!');
        button.innerHTML = '<svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>';

        setTimeout(() => {
            button.classList.remove('success');
            button.setAttribute('aria-label', originalLabel);
            button.innerHTML = originalIcon;
        }, 2000);
    }).catch(err => {
        console.error('Kopieren fehlgeschlagen:', err);
    });
};

// 6. Global Google Analytics (GA4) Tracker (safe wrapper before script is fully loaded)
window.trackEvent = function(eventName, parameters = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, {
            event_category: 'Community Engagement',
            event_label: parameters.label || '',
            value: parameters.value || 1,
            ...parameters
        });
    } else {
        console.log('Buffered Analytics Event:', eventName, parameters);
    }
};

// 7. Dynamic and Deferred Google Tag Manager Loader (delayed 1.5s after page load to optimize LCP)
window.addEventListener('load', () => {
    setTimeout(() => {
        // Dynamic Preconnect to GA endpoints
        const preconnectTags = [
            { href: 'https://www.googletagmanager.com', rel: 'preconnect' },
            { href: 'https://www.google-analytics.com', rel: 'preconnect' }
        ];
        preconnectTags.forEach(tagData => {
            const link = document.createElement('link');
            link.rel = tagData.rel;
            link.href = tagData.href;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Inject script
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-TWCEG7YCEQ';
        script.async = true;
        document.head.appendChild(script);

        // Initialize GA dataLayer
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { dataLayer.push(arguments); };
        window.gtag('js', new Date());

        // Base Configuration
        const gaConfig = {
            page_title: document.title,
            page_location: window.location.href,
            allow_ad_personalization_signals: false
        };

        // Add home page custom dimension mappings
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname.split('/').pop() === '') {
            gaConfig.custom_map = {
                'custom_dimension_1': 'user_type',
                'custom_dimension_2': 'meeting_interest'
            };
        }

        window.gtag('config', 'G-TWCEG7YCEQ', gaConfig);
    }, 1500);
});
