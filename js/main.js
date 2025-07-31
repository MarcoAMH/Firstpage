/*
================================================
TEPOSCOLULA - PUEBLO MÁGICO
JavaScript para funcionalidad interactiva
================================================
*/

// ========== VARIABLES GLOBALES ==========
let isMenuOpen = false;
let currentFilter = 'all';
let isScrolling = false;

// ========== DOM CONTENT LOADED ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ========== INICIALIZACIÓN PRINCIPAL ==========
function initializeApp() {
    // Inicializar componentes
    initNavigation();
    initScrollEffects();
    initHeroEffects();
    initGalleryFilters();
    initSmoothScrolling();
    initAnimationsOnScroll();
    initContactForm();
    initLazyLoading();
    
    // Mostrar página después de cargar
    document.body.style.opacity = '1';
    
    console.log('🌟 Teposcolula - Sitio Web Cargado Exitosamente');
}

// ========== NAVEGACIÓN ==========
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Toggle menú hamburguesa
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer click en enlaces
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Efecto scroll en header
    window.addEventListener('scroll', throttle(handleHeaderScroll, 100));

    // Highlight active nav link
    window.addEventListener('scroll', throttle(highlightActiveNavLink, 100));
}

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    isMenuOpen = !isMenuOpen;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    isMenuOpen = false;
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPos = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ========== EFECTOS DE SCROLL ==========
function initScrollEffects() {
    // Botón scroll to top
    createScrollToTopButton();
    
    // Parallax effects
    window.addEventListener('scroll', throttle(handleParallaxEffects, 10));
    
    // Progress bar
    createScrollProgressBar();
}

function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--pm-dorado);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Mostrar/ocultar botón
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    // Scroll to top al hacer click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--pm-dorado), var(--pm-rojo));
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }, 10));
}

function handleParallaxEffects() {
    const scrolled = window.pageYOffset;
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        const speed = 0.5;
        heroVideo.style.transform = `translate(-50%, calc(-50% + ${scrolled * speed}px))`;
    }
}

// ========== EFECTOS DEL HERO ==========
function initHeroEffects() {
    const heroContent = document.querySelector('.hero-content');
    const scrollArrow = document.querySelector('.scroll-arrow');
    
    // Animación de entrada del hero
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.animation = 'fadeInUp 1s ease-out forwards';
        }, 500);
    }
    
    // Click en scroll arrow
    if (scrollArrow) {
        scrollArrow.parentElement.addEventListener('click', () => {
            const lugaresSection = document.getElementById('lugares');
            if (lugaresSection) {
                lugaresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Typing effect en el título
    initTypingEffect();
}

function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    const typeSpeed = 100;
    
    function typeWriter() {
        if (i < originalText.length) {
            heroTitle.innerHTML += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// ========== FILTROS DE GALERÍA ==========
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.galeria-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            setActiveFilter(filter);
            filterGalleryItems(filter);
        });
    });
    
    // Lightbox para galería
    initGalleryLightbox();
}

function setActiveFilter(filter) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    currentFilter = filter;
}

function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.galeria-item');
    
    galleryItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.galeria-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });
}

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
        animation: zoomIn 0.3s ease;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: none;
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 2001;
    `;
    
    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Cerrar lightbox
    const closeLightbox = () => {
        lightbox.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(lightbox);
        }, 300);
    };
    
    lightbox.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    
    // Cerrar con ESC
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    
    document.addEventListener('keydown', handleEsc);
}

// ========== SMOOTH SCROLLING ==========
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== ANIMACIONES ON SCROLL ==========
function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animaciones específicas por tipo de elemento
                if (entry.target.classList.contains('lugar-card')) {
                    animateLugarCard(entry.target);
                } else if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                } else if (entry.target.classList.contains('info-card')) {
                    animateInfoCard(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    const animatableElements = document.querySelectorAll(
        '.lugar-card, .timeline-item, .info-card, .galeria-item, .section-header'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

function animateLugarCard(card) {
    card.style.animation = 'slideInUp 0.6s ease forwards';
}

function animateTimelineItem(item) {
    item.style.animation = 'slideInLeft 0.6s ease forwards';
}

function animateInfoCard(card) {
    card.style.animation = 'bounceIn 0.6s ease forwards';
}

// ========== FORMULARIO DE CONTACTO ==========
function initContactForm() {
    // Crear formulario de contacto dinámico si no existe
    const contactSection = document.querySelector('.contacto-info');
    if (contactSection && !document.querySelector('.contact-form')) {
        createContactForm(contactSection);
    }
}

function createContactForm(container) {
    const formHTML = `
        <div class="contact-form" style="margin-top: 30px;">
            <h4 style="color: var(--pm-dorado); margin-bottom: 20px;">Envíanos un mensaje</h4>
            <form id="contactForm">
                <div class="form-group" style="margin-bottom: 15px;">
                    <input type="text" id="name" name="name" placeholder="Tu nombre" required
                           style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                </div>
                <div class="form-group" style="margin-bottom: 15px;">
                    <input type="email" id="email" name="email" placeholder="Tu email" required
                           style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                </div>
                <div class="form-group" style="margin-bottom: 15px;">
                    <textarea id="message" name="message" placeholder="Tu mensaje" required rows="4"
                              style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; resize: vertical;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Enviar Mensaje
                </button>
            </form>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', formHTML);
    
    // Manejar envío del formulario
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Simular envío exitoso
    showNotification('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
    e.target.reset();
}

// ========== LAZY LOADING ==========
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== UTILIDADES ==========
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--pm-verde)' : 'var(--pm-rojo)'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========== FUNCIONES ESPECÍFICAS DE LUGARES ==========
function initLugaresInteractivity() {
    const lugarCards = document.querySelectorAll('.lugar-card');
    
    lugarCards.forEach(card => {
        // Efecto hover mejorado
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click para más información
        const btn = card.querySelector('.btn-outline');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('href');
                showPreviewModal(href, card);
            });
        }
    });
}

function showPreviewModal(href, card) {
    const title = card.querySelector('.lugar-title').textContent;
    const description = card.querySelector('.lugar-description').textContent;
    const image = card.querySelector('img');
    
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        animation: slideInUp 0.3s ease;
        margin: 20px;
    `;
    
    modalContent.innerHTML = `
        <button class="modal-close" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        <div style="padding: 30px;">
            <img src="${image ? image.src : ''}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: var(--pm-verde); margin-bottom: 15px; font-family: var(--font-primary);">${title}</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${description}</p>
            <div style="display: flex; gap: 15px;">
                <button class="btn btn-primary" onclick="this.closest('.preview-modal').remove()">Cerrar</button>
                <a href="${href}" class="btn btn-outline">Ver página completa</a>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    modalContent.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
}

// ========== ANIMACIONES CSS ADICIONALES ==========
function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            50% {
                transform: scale(1.05);
            }
            70% {
                transform: scale(0.9);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes zoomIn {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideOutRight {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ========== INICIALIZACIÓN COMPLETA ==========
document.addEventListener('DOMContentLoaded', () => {
    addCustomAnimations();
    initLugaresInteractivity();
});

// ========== MANEJO DE ERRORES ==========
window.addEventListener('error', (e) => {
    console.error('Error en el sitio:', e.error);
});

// ========== PERFORMANCE MONITORING ==========
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Sitio cargado en ${Math.round(loadTime)}ms`);
});
