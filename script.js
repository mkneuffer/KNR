document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const progressBar = document.getElementById('scroll-progress');

    const handleScroll = () => {
        // Navbar glassmorphism class
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll progress bar logic
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    // 2. Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // Init

    // 3. 3D Tilt Effect for Cards (Smoother Implementation)
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Disable on mobile/touch screens for better performance
            if (window.innerWidth <= 768) return;

            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xPct = x / rect.width;
                const yPct = y / rect.height;

                // Dampened rotation for a subtle, premium feel
                const rotateX = (0.5 - yPct) * 8;
                const rotateY = (xPct - 0.5) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                // Slight delay to allow transition back
                setTimeout(() => {
                    card.style.transform = '';
                }, 300);
            });
        });
    });

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // 5. Service Modal Logic (with focus trap for accessibility)
    const serviceCards = document.querySelectorAll('.service-card[id^="service-"]');
    const modal = document.getElementById('service-modal');

    if (modal && serviceCards.length > 0) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const closeBtn = document.querySelector('.modal-close');
        let previouslyFocusedElement = null;

        const openModal = (card) => {
            previouslyFocusedElement = document.activeElement;

            const title = card.querySelector('h3').textContent;
            const details = card.querySelector('.service-details').innerHTML;

            modalTitle.textContent = title;
            modalBody.innerHTML = details;

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');

            // Focus first item in modal for accessibility
            setTimeout(() => {
                closeBtn.focus();
            }, 100);
        };

        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');

            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
            }
        };

        serviceCards.forEach(card => {
            // Ensure cards are keyboard focusable
            card.setAttribute('tabindex', '0');

            card.addEventListener('click', () => openModal(card));

            // Allow opening via Enter key
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                }
            });
        });

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Focus Trap
        const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

        modal.addEventListener('keydown', function (e) {
            let focusableElements = modal.querySelectorAll(focusableElementsString);
            focusableElements = Array.prototype.slice.call(focusableElements);

            const firstTabStop = focusableElements[0];
            const lastTabStop = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstTabStop) {
                        e.preventDefault();
                        lastTabStop.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastTabStop) {
                        e.preventDefault();
                        firstTabStop.focus();
                    }
                }
            }
        });
    }

    // 6. Dynamic Copyright Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 7. Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length === 1) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                if (navLinks.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
