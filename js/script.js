/**
 * ARVIN JOY M. PANGALO — PORTFOLIO ENGINE (LIGHT THEME)
 * Navigation Spy, Multi-Image Lightbox, Certificate Inspector & Contact Form Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. FLOATING NAVIGATION & ACTIVE SCROLL SPY =====
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navToggle = document.getElementById('navToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const backToTop = document.getElementById('backToTop');

    // Mobile Drawer Handlers
    const toggleDrawer = (open) => {
        if (open) {
            mobileDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (navToggle) navToggle.addEventListener('click', () => toggleDrawer(true));
    if (drawerClose) drawerClose.addEventListener('click', () => toggleDrawer(false));
    drawerLinks.forEach(link => link.addEventListener('click', () => toggleDrawer(false)));

    // Scroll Handler
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Back to top visibility
        if (backToTop) {
            if (scrollY > 350) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'auto';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
            }
        }

        // Active section spy
        const scrollPosition = scrollY + 180;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== 2. ONE-CLICK EMAIL COPY WITH TOAST =====
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyEmailText = document.getElementById('copyEmailText');

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = copyEmailBtn.getAttribute('data-email') || 'arvinjoypangalo@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
                showToast('Email address copied to clipboard!', 'success');
                if (copyEmailText) {
                    const original = copyEmailText.textContent;
                    copyEmailText.textContent = 'Copied!';
                    setTimeout(() => {
                        copyEmailText.textContent = original;
                    }, 2000);
                }
            } catch (err) {
                showToast('Failed to copy: ' + email, 'error');
            }
        });
    }

    // ===== 3. UNIVERSAL GALLERY LIGHTBOX =====
    const galleryData = {
        miniway: {
            title: 'Miniway — Public Transit Tracking & Ticketing App',
            category: 'Academic Capstone Project',
            github: 'https://github.com/aj-tech-24/miniway2.0',
            items: [
                {
                    src: 'images/miniway/1.jpeg',
                    caption: 'Real-time GPS bus location tracking & arrival estimates (ETA) for commuters'
                },
                {
                    src: 'images/miniway/2.jpeg',
                    caption: 'Digital ticketing interface & QR code transit passes'
                },
                {
                    src: 'images/miniway/3.jpeg',
                    caption: 'Driver console with seat availability, fares, and passenger count telemetry'
                }
            ]
        },
        admin: {
            title: 'Miniway Operations & Fleet Management Dashboard',
            category: 'Web Platform',
            github: 'https://github.com/aj-tech-24/admin-dashboard',
            items: [
                {
                    src: 'images/miniway/admindashboard.png',
                    caption: 'Executive Operations Overview: Active Fleet, Revenue & Alert Feeds'
                },
                {
                    src: 'images/miniway/analytics.png',
                    caption: 'Ridership Trends, Passenger Heatmaps & Route Efficiency Analytics'
                },
                {
                    src: 'images/miniway/route.png',
                    caption: 'Interactive Route Topology & Waypoint Management Console'
                }
            ]
        },
        tesda: {
            title: 'TESDA Client Satisfaction Measurement (CSM) System',
            category: 'System Development',
            github: '#',
            items: [
                {
                    src: 'images/tesdacsm/admindashboard.png',
                    caption: 'Administrative Dashboard & Overview'
                },
                {
                    src: 'images/tesdacsm/clientdashboard.png',
                    caption: 'Client Dashboard & Data Visualization'
                },
                {
                    src: 'images/tesdacsm/long_strip_client_feedback_form.png',
                    caption: 'Client Feedback Form for Service Rating',
                    isScrollable: true
                }
            ]
        }
    };

    let activeGallery = null;
    let activeIndex = 0;

    const galleryModal = document.getElementById('galleryModal');
    const galleryOverlay = document.getElementById('galleryModalOverlay');
    const galleryCloseBtn = document.getElementById('galleryCloseBtn');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryCategory = document.getElementById('galleryCategory');
    const galleryGitLink = document.getElementById('galleryGitLink');
    const galleryMainImg = document.getElementById('galleryMainImg');
    const galleryDisplay = document.querySelector('.gallery-display');
    const galleryCaption = document.getElementById('galleryCaption');
    const galleryCurrentIdx = document.getElementById('galleryCurrentIdx');
    const galleryTotalIdx = document.getElementById('galleryTotalIdx');
    const galleryPrevBtn = document.getElementById('galleryPrevBtn');
    const galleryNextBtn = document.getElementById('galleryNextBtn');
    const galleryThumbsContainer = document.getElementById('galleryThumbsContainer');

    const updateGalleryView = () => {
        if (!activeGallery) return;
        const currentItem = activeGallery.items[activeIndex];
        
        galleryMainImg.style.opacity = '0';
        setTimeout(() => {
            galleryMainImg.src = currentItem.src;
            galleryCaption.textContent = currentItem.caption;
            
            if (currentItem.isScrollable) {
                galleryMainImg.classList.add('scrollable-img');
                if (galleryDisplay) galleryDisplay.classList.add('scrollable-display');
            } else {
                galleryMainImg.classList.remove('scrollable-img');
                if (galleryDisplay) galleryDisplay.classList.remove('scrollable-display');
            }
            
            galleryMainImg.style.opacity = '1';
        }, 120);

        galleryCurrentIdx.textContent = (activeIndex + 1).toString();
        galleryTotalIdx.textContent = activeGallery.items.length.toString();

        // Update thumbnails
        const thumbs = galleryThumbsContainer.querySelectorAll('.gallery-thumb');
        thumbs.forEach((th, idx) => {
            th.classList.toggle('active', idx === activeIndex);
        });
    };

    const openGallery = (galleryKey) => {
        activeGallery = galleryData[galleryKey];
        if (!activeGallery) return;
        activeIndex = 0;

        galleryTitle.textContent = activeGallery.title;
        galleryCategory.textContent = activeGallery.category;
        galleryGitLink.href = activeGallery.github;

        // Render thumbnails
        galleryThumbsContainer.innerHTML = '';
        activeGallery.items.forEach((item, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `gallery-thumb ${idx === 0 ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${item.src}" alt="Thumbnail ${idx + 1}">`;
            thumb.addEventListener('click', () => {
                activeIndex = idx;
                updateGalleryView();
            });
            galleryThumbsContainer.appendChild(thumb);
        });

        updateGalleryView();
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
        activeGallery = null;
    };

    const nextImage = () => {
        if (!activeGallery) return;
        activeIndex = (activeIndex + 1) % activeGallery.items.length;
        updateGalleryView();
    };

    const prevImage = () => {
        if (!activeGallery) return;
        activeIndex = (activeIndex - 1 + activeGallery.items.length) % activeGallery.items.length;
        updateGalleryView();
    };

    // Attach Gallery Triggers
    document.querySelectorAll('.gallery-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const galleryKey = btn.getAttribute('data-gallery') || 'miniway';
            openGallery(galleryKey);
        });
    });

    document.querySelectorAll('.admin-gallery-trigger').forEach(btn => {
        btn.addEventListener('click', () => openGallery('admin'));
    });

    if (galleryCloseBtn) galleryCloseBtn.addEventListener('click', closeGallery);
    if (galleryOverlay) galleryOverlay.addEventListener('click', closeGallery);
    if (galleryNextBtn) galleryNextBtn.addEventListener('click', nextImage);
    if (galleryPrevBtn) galleryPrevBtn.addEventListener('click', prevImage);

    // ===== 4. CERTIFICATE INSPECTION MODAL =====
    const certModal = document.getElementById('certModal');
    const certModalBackdrop = document.getElementById('certModalBackdrop');
    const certModalClose = document.getElementById('certModalClose');
    const certModalTitle = document.getElementById('certModalTitle');
    const certModalSubtitle = document.getElementById('certModalSubtitle');
    const certModalImage = document.getElementById('certModalImage');
    const certDownload = document.getElementById('certDownload');

    document.querySelectorAll('.cert-clickable').forEach(card => {
        card.addEventListener('click', () => {
            const certSrc = card.getAttribute('data-cert');
            const certTitle = card.getAttribute('data-title') || 'Certificate';
            const certIssuer = card.getAttribute('data-issuer') || 'Issuer';
            const certDate = card.getAttribute('data-date') || '';

            if (certSrc) {
                certModalImage.src = certSrc;
                certDownload.href = certSrc;
                certModalTitle.textContent = certTitle;
                certModalSubtitle.textContent = `${certIssuer} • ${certDate}`;
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeCertModal = () => {
        certModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
    if (certModalBackdrop) certModalBackdrop.addEventListener('click', closeCertModal);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (galleryModal.classList.contains('active')) {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        } else if (certModal.classList.contains('active')) {
            if (e.key === 'Escape') closeCertModal();
        }
    });

    // ===== 5. CONTACT FORM (EMAILJS) =====
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    // EmailJS Configuration — loaded from gitignored js/config.js (or fallback)
    const EMAILJS_PUBLIC_KEY = window.EMAIL_CONFIG?.PUBLIC_KEY || 'Yy08UM0-RcHe1IsqJ';
    const EMAILJS_SERVICE_ID = window.EMAIL_CONFIG?.SERVICE_ID || 'service_7kihxpu';
    const EMAILJS_TEMPLATE_ID = window.EMAIL_CONFIG?.TEMPLATE_ID || 'template_u2j1r6l';

    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY) {
        try {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        } catch (e) {
            console.warn('EmailJS initialization warning:', e);
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name')?.toString().trim();
            const email = formData.get('email')?.toString().trim();
            const subject = formData.get('subject')?.toString().trim();
            const message = formData.get('message')?.toString().trim();

            if (!name || !email || !subject || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please provide a valid email address.', 'error');
                return;
            }

            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';

            // Comprehensive parameter mapping to match any EmailJS template configuration
            const templateParams = {
                name: name,
                from_name: name,
                user_name: name,
                email: email,
                from_email: email,
                user_email: email,
                reply_to: email,
                subject: subject,
                message: message,
                to_name: 'Arvin Joy M. Pangalo'
            };

            try {
                if (typeof emailjs !== 'undefined') {
                    const response = await emailjs.send(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        templateParams,
                        { publicKey: EMAILJS_PUBLIC_KEY }
                    );
                    console.log('EmailJS response:', response);
                    showToast('Message sent successfully! I will get back to you promptly.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('EmailJS SDK is not loaded. Please check your internet connection.');
                }
            } catch (error) {
                console.error('Email submission error:', error);
                
                // Construct mailto link as fallback
                const mailtoUrl = `mailto:arvinjoypangalo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
                
                showToast('Could not reach email service. Opening email client fallback...', 'error');
                
                setTimeout(() => {
                    window.location.href = mailtoUrl;
                }, 1200);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        });
    }

    // ===== 6. TOAST NOTIFICATION SYSTEM =====
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
});
