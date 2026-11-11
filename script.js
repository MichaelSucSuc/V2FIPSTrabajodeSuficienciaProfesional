/**
 * Trabajo de Suficiencia Profesional FIPS - UNSA
 * Interactive Scripting (2026)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    initScrollProgress();
    initStickyHeader();
    initThemeToggle();
    initMobileMenu();
    initScrollReveal();
    initSearchFilter();
    initChecklist();
    initRoadmapSync();
    initBackToTop();
    initDisclaimerModal();
    initVisitorCounter();
});

/* ==========================================================================
   SCROLL PROGRESS INDICATOR
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });
}

/* ==========================================================================
   STICKY HEADER TRANSITIONS
   ========================================================================== */
function initStickyHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   DARK / LIGHT THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';

        if (currentTheme === 'light') {
            newTheme = 'dark';
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (!mobileMenuBtn || !navMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/* ==========================================================================
   CARD REAL-TIME SEARCH FILTER
   ========================================================================== */
function initSearchFilter() {
    const searchInput = document.getElementById('sectionSearch');
    const clearBtn = document.getElementById('clearSearch');
    const cardsGrid = document.getElementById('cardsGrid');
    const cards = cardsGrid ? cardsGrid.querySelectorAll('.thesis-card') : [];
    const emptyState = document.getElementById('emptySearchState');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }

        let matchCount = 0;

        cards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const isMatch = cardText.includes(query);

            if (isMatch) {
                card.style.display = 'flex';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (matchCount === 0 && query.length > 0) {
            emptyState.style.display = 'block';
            cardsGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            cardsGrid.style.display = 'grid';
        }
    });

    clearBtn.addEventListener('click', resetSearch);
}

function resetSearch() {
    const searchInput = document.getElementById('sectionSearch');
    const clearBtn = document.getElementById('clearSearch');
    const cardsGrid = document.getElementById('cardsGrid');
    const cards = cardsGrid ? cardsGrid.querySelectorAll('.thesis-card') : [];
    const emptyState = document.getElementById('emptySearchState');

    if (searchInput) {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        
        cards.forEach(card => {
            card.style.display = 'flex';
        });

        emptyState.style.display = 'none';
        cardsGrid.style.display = 'grid';
        searchInput.focus();
    }
}

/* ==========================================================================
   INTERACTIVE CHECKLIST LOGIC (PERSISTENT STATE)
   ========================================================================== */
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-cb');
    if (checkboxes.length === 0) return;

    checkboxes.forEach(cb => {
        const id = cb.getAttribute('data-id');
        const savedState = localStorage.getItem(`checklist-item-${id}`);
        if (savedState === 'checked') {
            cb.checked = true;
        }

        cb.addEventListener('change', () => {
            const state = cb.checked ? 'checked' : 'unchecked';
            localStorage.setItem(`checklist-item-${id}`, state);
            updateChecklistProgress();
        });
    });

    updateChecklistProgress();
}

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-cb');
    const circle = document.getElementById('checklistProgressCircle');
    const text = document.getElementById('checklistProgressText');
    const barFill = document.getElementById('checklistBarFill');
    const dynamicPercent = document.querySelector('.dynamic-percent');

    if (checkboxes.length === 0) return;

    const total = checkboxes.length;
    let checkedCount = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / total) * 100);

    if (text) text.textContent = `${percent}%`;
    if (dynamicPercent) dynamicPercent.textContent = `${percent}%`;
    if (barFill) barFill.style.width = `${percent}%`;

    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Actualizar badges de conteo por cada tarjeta de capítulo
    const categoryCards = document.querySelectorAll('.checklist-category-card');
    categoryCards.forEach(card => {
        const catCbs = card.querySelectorAll('.checklist-cb');
        const badge = card.querySelector('.category-count-badge');
        if (catCbs.length > 0 && badge) {
            let catChecked = 0;
            catCbs.forEach(c => { if (c.checked) catChecked++; });
            if (catChecked === catCbs.length && catCbs.length > 0) {
                badge.textContent = `${catChecked}/${catCbs.length} ✓`;
                badge.classList.add('completed');
            } else {
                badge.textContent = `${catChecked}/${catCbs.length}`;
                badge.classList.remove('completed');
            }
        }
    });
}

window.resetChecklist = function() {
    const checkboxes = document.querySelectorAll('.checklist-cb');
    checkboxes.forEach(cb => {
        const id = cb.getAttribute('data-id');
        cb.checked = false;
        localStorage.removeItem(`checklist-item-${id}`);
    });
    updateChecklistProgress();
};

window.downloadChecklist = function() {
    let content = "========================================================\n";
    content += "   CHECKLIST FINAL DEL TSP - FIPS UNSA (2026)\n";
    content += "========================================================\n\n";
    
    let totalCheckboxes = 0;
    let checkedCount = 0;

    const categories = document.querySelectorAll('.checklist-category-card');
    if (categories.length > 0) {
        categories.forEach(cat => {
            const catTitle = cat.querySelector('.category-header h3')?.textContent.trim() || 'Capítulo';
            content += `\n[ ${catTitle.toUpperCase()} ]\n`;
            content += "--------------------------------------------------------\n";
            const cbs = cat.querySelectorAll('.checklist-cb');
            cbs.forEach((cb, idx) => {
                totalCheckboxes++;
                const text = cb.parentNode.querySelector('.item-text').textContent.trim();
                const status = cb.checked ? "[X] CUMPLIDO " : "[ ] PENDIENTE";
                if (cb.checked) checkedCount++;
                content += `  ${idx + 1}. ${status} - ${text}\n`;
            });
        });
    } else {
        const cbs = document.querySelectorAll('.checklist-cb');
        cbs.forEach((cb, idx) => {
            totalCheckboxes++;
            const text = cb.parentNode.querySelector('.item-text').textContent.trim();
            const status = cb.checked ? "[X] CUMPLIDO " : "[ ] PENDIENTE";
            if (cb.checked) checkedCount++;
            content += `${idx + 1}. ${status} - ${text}\n`;
        });
    }
    content += "\n";

    const percent = totalCheckboxes > 0 ? Math.round((checkedCount / totalCheckboxes) * 100) : 0;
    content += "========================================================\n";
    content += `RESUMEN DE PROGRESO:\n`;
    content += `- Ítems Cumplidos: ${checkedCount} de ${totalCheckboxes}\n`;
    content += `- Porcentaje de Avance: ${percent}%\n`;
    content += `- Fecha de Exportación: ${new Date().toLocaleString()}\n`;
    content += "========================================================\n";

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Checklist_Final_TSP_FIPS.txt';
    link.click();
    URL.revokeObjectURL(url);
};

/* ==========================================================================
   ROADMAP TIMELINE SYNC ON SCROLL & CLICKS
   ========================================================================== */
function initRoadmapSync() {
    const nodes = document.querySelectorAll('.roadmap-step-node');
    const cards = document.querySelectorAll('.thesis-card');
    const progress = document.getElementById('roadmapProgress');
    const navLinks = document.querySelectorAll('.nav-link');

    if (nodes.length === 0 || cards.length === 0) return;

    window.scrollToStep = function(stepNumber) {
        const targetCard = Array.from(cards).find(card => card.getAttribute('data-step') === String(stepNumber));
        if (targetCard) {
            const headerOffset = 100;
            const elementPosition = targetCard.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    window.addEventListener('scroll', () => {
        let currentStep = 0;
        const triggerPoint = window.innerHeight / 2;

        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerPoint) {
                currentStep = parseInt(card.getAttribute('data-step'));
            }
        });

        nodes.forEach(node => {
            const nodeStep = parseInt(node.getAttribute('data-step'));
            if (nodeStep <= currentStep) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        if (progress) {
            const percent = Math.max(0, Math.min(100, (currentStep / (nodes.length - 1)) * 100));
            progress.style.width = `${percent}%`;
        }

        const activeNode = document.querySelector(`.roadmap-step-node[data-step="${currentStep}"]`);
        const scrollWrapper = document.querySelector('.roadmap-scroll-wrapper');
        if (activeNode && scrollWrapper && !scrollWrapper.classList.contains('is-dragging')) {
            const wrapperWidth = scrollWrapper.offsetWidth;
            const nodeLeft = activeNode.offsetLeft;
            const nodeWidth = activeNode.offsetWidth;
            scrollWrapper.scrollTo({
                left: nodeLeft - (wrapperWidth / 2) + (nodeWidth / 2),
                behavior: 'smooth'
            });
        }

        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (top < 150 && top + height > 150) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ==========================================
    // Slider Buttons & Drag-to-Scroll Controls
    // ==========================================
    const scrollWrapper = document.querySelector('.roadmap-scroll-wrapper');
    const prevBtn = document.getElementById('roadmapPrevBtn');
    const nextBtn = document.getElementById('roadmapNextBtn');

    if (scrollWrapper) {
        const getScrollStep = () => Math.max(300, Math.floor(scrollWrapper.clientWidth * 0.65));

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                scrollWrapper.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                scrollWrapper.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
            });
        }

        const updateButtonStates = () => {
            if (!prevBtn || !nextBtn) return;
            const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
            if (maxScroll <= 5) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                return;
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }

            if (scrollWrapper.scrollLeft <= 5) {
                prevBtn.classList.add('is-disabled');
            } else {
                prevBtn.classList.remove('is-disabled');
            }

            if (scrollWrapper.scrollLeft >= maxScroll - 5) {
                nextBtn.classList.add('is-disabled');
            } else {
                nextBtn.classList.remove('is-disabled');
            }
        };

        scrollWrapper.addEventListener('scroll', updateButtonStates, { passive: true });
        window.addEventListener('resize', updateButtonStates);
        setTimeout(updateButtonStates, 150);

        // Mouse Drag-to-Scroll
        let isDown = false;
        let startX = 0;
        let scrollStart = 0;
        let hasDragged = false;

        scrollWrapper.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDown = true;
            hasDragged = false;
            startX = e.pageX;
            scrollStart = scrollWrapper.scrollLeft;
            scrollWrapper.classList.add('is-dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const delta = e.pageX - startX;
            if (Math.abs(delta) > 5) {
                hasDragged = true;
            }
            scrollWrapper.scrollLeft = scrollStart - delta;
        });

        window.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            scrollWrapper.classList.remove('is-dragging');
            setTimeout(() => {
                hasDragged = false;
            }, 80);
        });

        // Prevent clicking step nodes if user was dragging
        scrollWrapper.addEventListener('click', (e) => {
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   DISCLAIMER MODAL
   ========================================================================== */
function initDisclaimerModal() {
    const modal = document.getElementById('disclaimerModal');
    const closeBtn = document.getElementById('closeDisclaimerBtn');
    if (!modal || !closeBtn) return;

    // Check if disclaimer was already accepted in this session
    const disclaimerAccepted = sessionStorage.getItem('disclaimerAccepted');
    if (disclaimerAccepted === 'true') {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        return;
    }

    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 400);

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        sessionStorage.setItem('disclaimerAccepted', 'true');
    });
}

/* ==========================================================================
   GLOBAL VISITOR COUNTER
   ========================================================================== */
async function initVisitorCounter() {
    const counterEl = document.getElementById('visitorCount');
    if (!counterEl) return;

    const namespace = 'fips-unsa-tsp-2026';
    const key = 'visitas';
    const sessionKey = 'tsp_visit_counted';
    const alreadyCounted = sessionStorage.getItem(sessionKey);

    // If first visit in current browser session, increment count (/up); otherwise read current count
    const url = alreadyCounted 
        ? `https://api.counterapi.dev/v1/${namespace}/${key}`
        : `https://api.counterapi.dev/v1/${namespace}/${key}/up`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data && typeof data.count !== 'undefined') {
                animateCounter(counterEl, data.count);
                sessionStorage.setItem(sessionKey, 'true');
                return;
            }
        }
        
        // If read endpoint failed (e.g. key doesn't exist yet), attempt /up to create & increment
        if (alreadyCounted) {
            const fallbackResponse = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`);
            if (fallbackResponse.ok) {
                const data = await fallbackResponse.json();
                if (data && typeof data.count !== 'undefined') {
                    animateCounter(counterEl, data.count);
                    return;
                }
            }
        }

        counterEl.textContent = 'Activo';
    } catch (error) {
        console.warn('Servicio de contador no disponible:', error);
        counterEl.textContent = 'En línea';
    }
}

function animateCounter(element, targetValue) {
    const target = parseInt(targetValue, 10);
    if (isNaN(target)) {
        element.textContent = targetValue;
        return;
    }

    const duration = 1200;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuad)
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(start + (target - start) * ease);
        
        element.textContent = currentCount.toLocaleString('es-PE');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('es-PE');
        }
    }

    requestAnimationFrame(update);
}

