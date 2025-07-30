// Funcionalidad específica de la galería
let currentImageIndex = 0;
let filteredImages = [];
let allImages = [];

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initLightbox();
    initFilters();
    initLazyLoading();
});

// Inicializar galería
function initGallery() {
    // Recopilar todas las imágenes
    allImages = Array.from(document.querySelectorAll('.gallery-item'));
    filteredImages = [...allImages];
    
    // Agregar eventos de click a las imágenes
    allImages.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(this, index);
        });
        
        // Agregar efecto de hover
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animación de entrada
    animateGalleryItems();
}

// Inicializar lightbox
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    // Cerrar lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Cerrar al hacer click fuera de la imagen
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    previousImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
    
    // Botones de navegación
    lightboxPrev.addEventListener('click', previousImage);
    lightboxNext.addEventListener('click', nextImage);
}

// Abrir lightbox
function openLightbox(element, index = 0) {
    const lightbox = document.getElementById('lightbox');
    const img = element.querySelector('img');
    const overlay = element.querySelector('.gallery-overlay');
    
    // Encontrar índice en imágenes filtradas
    currentImageIndex = filteredImages.indexOf(element);
    if (currentImageIndex === -1) currentImageIndex = 0;
    
    // Configurar imagen
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    
    if (overlay) {
        const title = overlay.querySelector('h3');
        const desc = overlay.querySelector('p');
        
        lightboxTitle.textContent = title ? title.textContent : '';
        lightboxDesc.textContent = desc ? desc.textContent : '';
    }
    
    // Mostrar lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Precargar imágenes adyacentes
    preloadAdjacentImages();
}

// Cerrar lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Imagen anterior
function previousImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1;
    updateLightboxImage();
}

// Imagen siguiente
function nextImage() {
    currentImageIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0;
    updateLightboxImage();
}

// Actualizar imagen del lightbox
function updateLightboxImage() {
    const currentItem = filteredImages[currentImageIndex];
    const img = currentItem.querySelector('img');
    const overlay = currentItem.querySelector('.gallery-overlay');
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    
    // Efecto de transición
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (overlay) {
            const title = overlay.querySelector('h3');
            const desc = overlay.querySelector('p');
            
            lightboxTitle.textContent = title ? title.textContent : '';
            lightboxDesc.textContent = desc ? desc.textContent : '';
        }
        
        lightboxImg.style.opacity = '1';
    }, 150);
    
    preloadAdjacentImages();
}

// Precargar imágenes adyacentes
function preloadAdjacentImages() {
    const preloadIndices = [
        currentImageIndex - 1 >= 0 ? currentImageIndex - 1 : filteredImages.length - 1,
        currentImageIndex + 1 < filteredImages.length ? currentImageIndex + 1 : 0
    ];
    
    preloadIndices.forEach(index => {
        const item = filteredImages[index];
        if (item) {
            const img = new Image();
            img.src = item.querySelector('img').src;
        }
    });
}

// Inicializar filtros
function initFilters() {
    const filterButtons = document.querySelectorAll('.pill');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar imágenes
            const filter = this.getAttribute('data-filter');
            filterImages(filter);
        });
    });
}

// Filtrar imágenes
function filterImages(filter) {
    const allItems = document.querySelectorAll('.gallery-item');
    
    // Aplicar filtro con animación
    allItems.forEach((item, index) => {
        setTimeout(() => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.classList.remove('filtered-out');
                item.classList.add('filtered-in');
                item.style.display = 'block';
            } else {
                item.classList.remove('filtered-in');
                item.classList.add('filtered-out');
                setTimeout(() => {
                    if (item.classList.contains('filtered-out')) {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        }, index * 50);
    });
    
    // Actualizar array de imágenes filtradas
    setTimeout(() => {
        filteredImages = Array.from(document.querySelectorAll('.gallery-item:not(.filtered-out)'));
    }, 500);
}

// Animación de entrada de elementos
function animateGalleryItems() {
    const items = document.querySelectorAll('.gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

// Lazy loading optimizado para galería
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const container = img.closest('.gallery-item');
                    
                    // Agregar clase de loading
                    container.classList.add('loading');
                    
                    // Cargar imagen
                    img.src = img.dataset.src || img.src;
                    
                    img.onload = function() {
                        container.classList.remove('loading');
                        img.style.opacity = '1';
                    };
                    
                    img.onerror = function() {
                        container.classList.remove('loading');
                        img.src = '../assets/images/placeholder.jpg';
                        img.alt = 'Imagen no disponible';
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });
    }
}

// Navegación suave entre secciones
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Resaltar sección
                targetElement.style.backgroundColor = 'rgba(230, 126, 34, 0.1)';
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
}

// Inicializar navegación suave
initSmoothScroll();

// Función para compartir imagen (opcional)
function shareImage(element) {
    const img = element.querySelector('img');
    const title = element.querySelector('.gallery-overlay h3')?.textContent || 'Imagen de Oaxaca';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Mira esta increíble imagen de Oaxaca',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copiar URL al clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('URL copiada al portapapeles', 'success');
        });
    }
}

// Función para descargar imagen (opcional)
function downloadImage(element) {
    const img = element.querySelector('img');
    const link = document.createElement('a');
    link.href = img.src;
    link.download = img.alt.replace(/\s+/g, '-').toLowerCase() + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Búsqueda en galería (funcionalidad extra)
function initSearch() {
    const searchInput = document.getElementById('gallery-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = document.querySelectorAll('.gallery-item');
            
            items.forEach(item => {
                const title = item.querySelector('.gallery-overlay h3')?.textContent.toLowerCase() || '';
                const desc = item.querySelector('.gallery-overlay p')?.textContent.toLowerCase() || '';
                const alt = item.querySelector('img')?.alt.toLowerCase() || '';
                
                if (title.includes(searchTerm) || desc.includes(searchTerm) || alt.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.classList.remove('filtered-out');
                } else {
                    item.style.display = 'none';
                    item.classList.add('filtered-out');
                }
            });
            
            // Actualizar imágenes filtradas
            filteredImages = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
        });
    }
}

// Estadísticas de la galería
function getGalleryStats() {
    const totalImages = allImages.length;
    const categories = {};
    
    allImages.forEach(item => {
        const category = item.getAttribute('data-category') || 'uncategorized';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    return {
        total: totalImages,
        categories: categories,
        currentFilter: document.querySelector('.pill.active')?.getAttribute('data-filter') || 'all',
        visibleImages: filteredImages.length
    };
}

// Exportar funciones para uso global
window.galleryFunctions = {
    openLightbox,
    closeLightbox,
    filterImages,
    shareImage,
    downloadImage,
    getGalleryStats
};
