/* ═══════════════════════════════════════════════════════════
   vCard 2026 — Interactive Features
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ──── CONTACT DATA (editable) ────
    const CONTACT = {
        firstName: 'Darío Oscar',
        lastName: 'Lanza',
        company: 'Seguridad Integral',
        jobTitle: 'Técnico en Seg. Pública y Ciudadana · Mentor en Liderazgo',
        mobile: '+5491100000000',
        phone: '+541100000000',
        email: 'contacto@ejemplo.com',
        website: 'https://www.ejemplo.com',
        street: '',
        city: 'Buenos Aires',
        state: '',
        zip: '',
        country: 'Argentina',
        birthday: '1980-01-01',
        pageUrl: window.location.href
    };

    // ──── THEME TOGGLE ────
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                showToast(newTheme === 'dark' ? 'Tema oscuro activado' : 'Tema claro activado');
            });
        }
    }

    // ──── ENTRANCE ANIMATIONS (IntersectionObserver) ────
    function initAnimations() {
        const elements = document.querySelectorAll('[data-animate]');

        if (!('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.delay || '0', 10);
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach(el => observer.observe(el));
    }

    // ──── RIPPLE EFFECT ON BUTTONS ────
    function initRipples() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                this.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });
    }

    // ──── TOAST NOTIFICATION ────
    function showToast(message) {
        const toast = document.getElementById('toast');
        const msgEl = document.getElementById('toast-message');
        msgEl.textContent = message;
        toast.classList.add('is-active');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('is-active');
        }, 2500);
    }

    // ──── GENERATE vCARD FILE (.vcf) ────
    function generateVCard() {
        const lines = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${CONTACT.firstName} ${CONTACT.lastName}`,
            `N:${CONTACT.lastName};${CONTACT.firstName};;;`,
            `ORG:${CONTACT.company}`,
            `TITLE:${CONTACT.jobTitle}`,
            CONTACT.mobile ? `TEL;TYPE=CELL:${CONTACT.mobile}` : '',
            CONTACT.phone ? `TEL;TYPE=WORK:${CONTACT.phone}` : '',
            CONTACT.email ? `EMAIL;TYPE=INTERNET:${CONTACT.email}` : '',
            CONTACT.website ? `URL:${CONTACT.website}` : '',
            CONTACT.birthday ? `BDAY:${CONTACT.birthday.replace(/-/g, '')}` : '',
            [CONTACT.street, CONTACT.city, CONTACT.state, CONTACT.zip, CONTACT.country]
                .filter(Boolean).length
                ? `ADR;TYPE=WORK:;;${CONTACT.street};${CONTACT.city};${CONTACT.state};${CONTACT.zip};${CONTACT.country}`
                : '',
            'END:VCARD'
        ].filter(Boolean).join('\r\n');

        return lines;
    }

    function downloadVCard() {
        const vcf = generateVCard();
        const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${CONTACT.firstName}_${CONTACT.lastName}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Contacto descargado');
    }

    // ──── SHARE FUNCTIONS ────
    function shareVia(platform) {
        const text = `${CONTACT.firstName} ${CONTACT.lastName} — ${CONTACT.company}`;
        const url = CONTACT.pageUrl;

        const urls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            x: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'noopener,noreferrer');
        }
    }

    function copyLink() {
        const url = CONTACT.pageUrl;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                showToast('Enlace copiado al portapapeles');
            }).catch(() => {
                fallbackCopy(url);
            });
        } else {
            fallbackCopy(url);
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast('Enlace copiado al portapapeles');
        } catch {
            showToast('No se pudo copiar');
        }
        document.body.removeChild(ta);
    }

    // ──── SEND BY EMAIL ────
    function sendByEmail() {
        const subject = encodeURIComponent(`Contacto: ${CONTACT.firstName} ${CONTACT.lastName}`);
        const body = encodeURIComponent(
            `${CONTACT.firstName} ${CONTACT.lastName}\n` +
            `${CONTACT.jobTitle}\n` +
            `${CONTACT.company}\n\n` +
            `Tel: ${CONTACT.mobile}\n` +
            `Email: ${CONTACT.email}\n` +
            `Web: ${CONTACT.website}\n\n` +
            `Página: ${CONTACT.pageUrl}`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    // ──── EVENT LISTENERS ────
    function initEvents() {
        // Action buttons
        const saveBtn = document.getElementById('btn-save-contact');
        const downloadBtn = document.getElementById('btn-download-vcard');
        const sendEmailBtn = document.getElementById('btn-send-email');

        if (saveBtn) saveBtn.addEventListener('click', downloadVCard);
        if (downloadBtn) downloadBtn.addEventListener('click', downloadVCard);
        if (sendEmailBtn) sendEmailBtn.addEventListener('click', sendByEmail);

        // Share icons
        const shareMap = {
            'share-whatsapp': () => shareVia('whatsapp'),
            'share-facebook': () => shareVia('facebook'),
            'share-x': () => shareVia('x'),
            'share-email-link': () => shareVia('email'),
            'share-copy': copyLink
        };

        Object.entries(shareMap).forEach(([id, handler]) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', handler);
        });
    }

    // ──── INIT ────
    document.addEventListener('DOMContentLoaded', () => {
        initThemeToggle();
        initAnimations();
        initRipples();
        initEvents();
    });

})();
