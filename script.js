/* ==========================================================================
   HONER HOMES - APPLICATION CONTROLLER & ANIMATION LOGIC (400-FRAME CINEMATIC)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Dom Elements
    const preloader = document.getElementById("preloader");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const canvas = document.getElementById("walkthrough-canvas");
    const ctx = canvas.getContext("2d");
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const mainHeader = document.querySelector(".main-nav");
    const walkthroughNav = document.getElementById("walkthrough-nav");

    // 1. Mobile Menu Toggle
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Close menu when clicking links
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.querySelector("i").className = "fa-solid fa-bars";
        });
    });

    // 2. Header Scroll Effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add("scrolled");
        } else {
            mainHeader.classList.remove("scrolled");
        }
    });

    // 3. Preload Walkthrough Frames (1000 frames: 0 to 999)
    const frameCount = 1000;
    const images = [];
    let loadedCount = 0;

    // Build frame URL helper
    const getFrameUrl = (index) => {
        return `assets/frames/${index}.webp`;
    };

    // Preload image array
    const preloadFrames = new Promise((resolve) => {
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = getFrameUrl(i);
            img.onload = () => {
                loadedCount++;
                const percentage = Math.round((loadedCount / frameCount) * 100);
                progressBar.style.width = `${percentage}%`;
                progressText.textContent = `${percentage}%`;
                
                if (loadedCount === frameCount) {
                    resolve();
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === frameCount) resolve();
            };
            images.push(img);
        }
    });

    // Once assets are ready, execute page setup
    preloadFrames.then(() => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                preloader.style.visibility = "hidden";
                initCanvasAnimation();
                initCounters();
                initNavbarObserver();
                initDotNavigation();
            }
        });
    });

    // 4. Canvas Drawing Controller (Cover Scaled)
    function drawFrame(img) {
        if (!img) return;
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;
        
        const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const x = (canvasWidth - imgWidth * scale) / 2;
        const y = (canvasHeight - imgHeight * scale) / 2;
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (images[scrollObj.frame]) {
            drawFrame(images[scrollObj.frame]);
        }
    }

    // Scroll object to interpolate
    const scrollObj = { frame: 0 };

    function initCanvasAnimation() {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        
        // Render initial frame
        drawFrame(images[0]);

        // Main GSAP ScrollTrigger timeline pinning walkthrough container.
        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#walkthrough-section",
                start: "top top",
                end: "+=600%", // Pin for exactly 600% of viewport height
                scrub: 1.2,
                pin: true,
                anticipatePin: 1
            }
        });

        // Frame Scrubbing Animation (from time 0 to 100 on virtual scale)
        scrollTimeline.to(scrollObj, {
            frame: 999,
            ease: "none",
            duration: 100,
            onUpdate: () => {
                const currentFrame = Math.min(999, Math.floor(scrollObj.frame));
                if (images[currentFrame]) {
                    drawFrame(images[currentFrame]);
                }

                // Highlight nav dots based on scroll progress
                const progress = scrollTimeline.progress();
                let activeDotId = "sec-hero";
                
                if (progress >= 0.89) activeDotId = "sec-outro";
                else if (progress >= 0.86) activeDotId = "sec-temple";
                else if (progress >= 0.842) activeDotId = "sec-theater";
                else if (progress >= 0.817) activeDotId = "sec-gym";
                else if (progress >= 0.75) activeDotId = "sec-pool";
                else if (progress >= 0.663) activeDotId = "sec-exterior";
                else if (progress >= 0.576) activeDotId = "sec-park";
                else if (progress >= 0.512) activeDotId = "sec-sundeck";
                else if (progress >= 0.46) activeDotId = "sec-balcony";
                else if (progress >= 0.273) activeDotId = "sec-interiors";
                else if (progress >= 0.24) activeDotId = "sec-parking";
                else if (progress >= 0.18) activeDotId = "sec-entrance";
                else if (progress >= 0.123) activeDotId = "sec-shops";
                else if (progress >= 0.059) activeDotId = "sec-towers";
                else activeDotId = "sec-hero";
                
                updateActiveDot(activeDotId);
            }
        }, 0);

        // Helper function for staggered section transitions
        const animateSection = (sectionId, startTime, endTime, exitY = -40, isLast = false, isHero = false) => {
            const sec = document.querySelector(sectionId);
            if (!sec) return;

            const card = sec.querySelector('.glass-card');
            const tag = sec.querySelector('.section-tag, .gold-badge');
            const title = sec.querySelector('h2, .hero-title, .outro-title');
            const desc = sec.querySelector('.section-desc, .hero-caption, .outro-subtitle');
            const logo = sec.querySelector('.hero-logo');
            const listItems = sec.querySelectorAll('.landmark-item, .spec-list li, .highlight-pill, .spec-item-mini, .cta-scroll-group, .scroll-indicator');

            const isShort = (endTime - startTime) < 4.5;
            const entranceDuration = isShort ? 0.3 : 1.0;
            const exitDuration = isShort ? 0.3 : 1.2;

            if (isHero) {
                // Set Hero visible immediately at timeline start (no fade-in on scroll)
                scrollTimeline.set(sectionId, { autoAlpha: 1 }, 0);
                if (card) scrollTimeline.set(card, { opacity: 1, y: 0 }, 0);
                if (logo) scrollTimeline.set(logo, { scale: 1, opacity: 1 }, 0);
                if (tag) scrollTimeline.set(tag, { y: 0, opacity: 1 }, 0);
                if (title) scrollTimeline.set(title, { y: 0, opacity: 1 }, 0);
                if (desc) scrollTimeline.set(desc, { y: 0, opacity: 1 }, 0);
                if (listItems.length > 0) scrollTimeline.set(listItems, { y: 0, opacity: 1 }, 0);
            } else {
                // Staggered Entrance
                scrollTimeline.fromTo(sectionId, { autoAlpha: 0 }, { autoAlpha: 1, duration: entranceDuration }, startTime);
                
                let offset = isShort ? 0.05 : 0.2;
                if (card) {
                    scrollTimeline.fromTo(card, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: isShort ? 0.25 : 0.8 }, startTime + offset);
                    offset += isShort ? 0.05 : 0.25;
                }
                if (logo) {
                    scrollTimeline.fromTo(logo, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: isShort ? 0.3 : 1.0 }, startTime + offset);
                    offset += isShort ? 0.05 : 0.2;
                }
                if (tag) {
                    scrollTimeline.fromTo(tag, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: isShort ? 0.25 : 0.8 }, startTime + offset);
                    offset += isShort ? 0.05 : 0.15;
                }
                if (title) {
                    scrollTimeline.fromTo(title, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: isShort ? 0.25 : 0.8 }, startTime + offset);
                    offset += isShort ? 0.05 : 0.15;
                }
                if (desc) {
                    scrollTimeline.fromTo(desc, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: isShort ? 0.25 : 0.8 }, startTime + offset);
                    offset += isShort ? 0.05 : 0.15;
                }
                if (listItems.length > 0) {
                    scrollTimeline.fromTo(listItems, { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: isShort ? 0.05 : 0.12, duration: isShort ? 0.25 : 0.8 }, startTime + offset);
                }
            }

            // Exit transition (only if not the last outro section)
            if (!isLast) {
                const actualExitDuration = (sectionId === "#sec-outro") ? 0.5 : exitDuration;
                scrollTimeline.to(sectionId, { autoAlpha: 0, y: exitY, duration: actualExitDuration }, endTime);
            }
        };

        // Create the staggered animations for the 15 timelines
        animateSection("#sec-hero", 0, 5.0, -50, false, true);
        animateSection("#sec-towers", 5.9, 8.4, -40);
        animateSection("#sec-shops", 12.3, 16.0, -40);
        animateSection("#sec-entrance", 18.0, 21.5, -40);
        animateSection("#sec-parking", 24.0, 26.9, -40);
        animateSection("#sec-interiors", 27.3, 45.8, -40);
        animateSection("#sec-balcony", 46.0, 50.0, -40);
        animateSection("#sec-sundeck", 51.2, 57.5, -40);
        animateSection("#sec-park", 57.6, 66.0, -40);
        animateSection("#sec-exterior", 66.3, 74.0, -40);
        animateSection("#sec-pool", 75.0, 81.5, -40);
        animateSection("#sec-gym", 81.7, 84.0, -40);
        animateSection("#sec-theater", 84.2, 85.9, -40);
        animateSection("#sec-temple", 86.0, 87.6, -40);
        animateSection("#sec-outro", 89.0, 99.5, -30);

        // Elegant fade-out of the canvas container at the end (from 99.5% to 100%) to transition into floor plans
        scrollTimeline.to(".canvas-pin", { autoAlpha: 0, duration: 0.5 }, 99.5);
    }

    // 5. Floating Walkthrough Dot Navigation Controller with Exact Center Targets
    const sectionCenters = [0.025, 0.0715, 0.1415, 0.1975, 0.2545, 0.3655, 0.48, 0.5435, 0.618, 0.7015, 0.7825, 0.8285, 0.8505, 0.868, 0.9425];

    function initDotNavigation() {
        ScrollTrigger.create({
            trigger: "#walkthrough-section",
            start: "top 20%",
            end: "bottom 80%",
            onEnter: () => walkthroughNav.classList.add("visible"),
            onLeave: () => walkthroughNav.classList.remove("visible"),
            onEnterBack: () => walkthroughNav.classList.add("visible"),
            onLeaveBack: () => walkthroughNav.classList.remove("visible")
        });

        // Click handler to smooth scroll to the exact centers of walkthrough sections
        const dots = document.querySelectorAll(".nav-dot");
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                const container = document.getElementById("walkthrough-section");
                const parent = container.parentElement;
                // Get correct spacer top offset whether currently pinned or not
                const containerTop = parent.classList.contains("pin-spacer") ? parent.offsetTop : container.offsetTop;
                const scrollableDistance = 6 * window.innerHeight;
                const targetScrollY = containerTop + (sectionCenters[index] * scrollableDistance);
                
                window.scrollTo({
                    top: targetScrollY + 2,
                    behavior: "smooth"
                });
            });
        });
    }

    // Update active dot in the list
    function updateActiveDot(activeId) {
        const dots = document.querySelectorAll(".nav-dot");
        dots.forEach(dot => {
            dot.classList.remove("active");
            if (dot.getAttribute("data-target") === activeId) {
                dot.classList.add("active");
            }
        });
    }

    // 6. Navigation Highlighting (Global sections)
    function initNavbarObserver() {
        const sections = [
            document.getElementById("walkthrough-section"),
            document.getElementById("floorplans-section"),
            document.getElementById("legacy-section"),
            document.getElementById("chairman-section"),
            document.getElementById("awards-section")
        ];

        const navAnchors = document.querySelectorAll(".nav-links a");

        window.addEventListener("scroll", () => {
            let currentSec = "";
            const scrollPos = window.scrollY + 200;

            sections.forEach(sec => {
                if (sec && scrollPos >= sec.offsetTop && scrollPos < (sec.offsetTop + sec.offsetHeight)) {
                    currentSec = sec.id;
                }
            });

            if (window.scrollY < 300) {
                currentSec = "walkthrough-section";
            }

            navAnchors.forEach(a => {
                a.classList.remove("active");
                const href = a.getAttribute("href");
                if (href === `#${currentSec}`) {
                    a.classList.add("active");
                }
            });
        });
    }

    // 7. Floor Plans Tab Switching and Inspector
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            tabContents.forEach(content => {
                content.classList.remove("active");
                if (content.id === targetTab) {
                    content.classList.add("active");
                    setupActiveTabInspector(content);
                }
            });
        });
    });

    if (tabContents.length > 0) {
        setupActiveTabInspector(tabContents[0]);
    }

    function setupActiveTabInspector(tabElement) {
        const rooms = tabElement.querySelectorAll(".room");
        const tabId = tabElement.id.split("-")[1];
        
        const inspectTitle = document.getElementById(`inspect-title-${tabId}`);
        const inspectDim = document.getElementById(`inspect-dim-${tabId}`);
        const inspectDesc = document.getElementById(`inspect-desc-${tabId}`);

        rooms.forEach(room => {
            room.addEventListener("mouseenter", () => {
                const title = room.getAttribute("data-room-title");
                const dim = room.getAttribute("data-room-dim");
                const desc = room.getAttribute("data-room-desc");

                inspectTitle.textContent = title;
                inspectDim.textContent = dim;
                inspectDesc.textContent = desc;

                gsap.fromTo(`#inspector-${tabId}`, 
                    { borderStyle: "dashed" },
                    { borderColor: "#D4AF37", duration: 0.3 }
                );
            });

            room.addEventListener("mouseleave", () => {
                inspectTitle.textContent = "Room Details";
                inspectDim.textContent = "-";
                inspectDesc.textContent = "Hover over a room layout on the blueprint map to analyze specs dynamically.";
                
                gsap.to(`#inspector-${tabId}`, {
                    borderColor: "rgba(212, 175, 55, 0.2)",
                    duration: 0.3
                });
            });
        });
    }

    // 8. Counter Animation (Legacy Bar)
    function initCounters() {
        const counters = document.querySelectorAll(".counter");
        
        const runCounters = () => {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute("data-target"), 10);
                const countObj = { val: 0 };
                
                const isThousands = target >= 1000;
                const suffix = isThousands ? "+" : (counter.nextElementSibling.textContent.includes("Delivered") ? "M+" : "+");

                gsap.to(countObj, {
                    val: target,
                    duration: 2.5,
                    ease: "power2.out",
                    onUpdate: () => {
                        let displayValue = Math.floor(countObj.val);
                        if (isThousands) {
                            counter.textContent = displayValue.toLocaleString() + suffix;
                        } else {
                            counter.textContent = displayValue + suffix;
                        }
                    }
                });
            });
        };

        ScrollTrigger.create({
            trigger: "#legacy-section",
            start: "top 85%",
            onEnter: () => {
                runCounters();
            },
            once: true
        });
    }

    // 9. Contact Form Submit Controller & Feedback toast
    const enquiryForm = document.getElementById("enquiry-form");
    const toast = document.getElementById("toast");

    enquiryForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const submitBtn = enquiryForm.querySelector(".btn-submit-gold");
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.innerHTML = `<span>REGISTERING...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        submitBtn.style.pointerEvents = "none";

        setTimeout(() => {
            enquiryForm.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.pointerEvents = "auto";
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
            }, 4500);

        }, 1800);
    });
});
