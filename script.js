const siteHeader = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-menu a');
const revealElements = document.querySelectorAll('.reveal');

function updateHeader() {
  if (window.scrollY > 40) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader);
updateHeader();

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => observer.observe(element));


const filterButtons = document.querySelectorAll('.filter-btn');
const traditionCards = document.querySelectorAll('.tradition-card');
const traditionModal = document.getElementById('traditionModal');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalDescription = document.getElementById('modalDescription');
const modalRequirements = document.getElementById('modalRequirements');
const modalImportance = document.getElementById('modalImportance');
const modalImage = document.getElementById('modalImage');
let lastFocusedElement = null;

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    traditionCards.forEach((card) => {
      const categories = card.dataset.category || '';
      const shouldShow = selectedFilter === 'todas' || categories.includes(selectedFilter);
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

function openTraditionModal(card) {
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = card.dataset.title;
  modalDate.textContent = card.dataset.date;
  modalDescription.textContent = card.dataset.description;
  modalRequirements.textContent = card.dataset.requirements;
  modalImportance.textContent = card.dataset.importance;
  if (modalImage) {
    modalImage.src = card.dataset.image || '';
    modalImage.alt = card.dataset.imageAlt || card.dataset.title || 'Imagen de la tradición';
  }
  traditionModal.classList.add('open');
  traditionModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  traditionModal.querySelector('.modal-close').focus();
}

function closeTraditionModal() {
  traditionModal.classList.remove('open');
  traditionModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

traditionCards.forEach((card) => {
  const button = card.querySelector('.read-more');
  button.addEventListener('click', () => openTraditionModal(card));
});

traditionModal?.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-modal]')) {
    closeTraditionModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && traditionModal?.classList.contains('open')) {
    closeTraditionModal();
  }
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Gracias por compartir tu mensaje. Puedes conectar este formulario con Formspree, Netlify Forms o el servicio que prefieras.');
    contactForm.reset();
  });
}

// Galería visual tipo coverflow
const coverflowSlides = Array.from(document.querySelectorAll('.coverflow-slide'));
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');
const galleryDots = document.getElementById('galleryDots');
const galleryLightbox = document.getElementById('galleryLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
let activeGalleryIndex = 0;
let lastGalleryFocus = null;

function circularDistance(index, activeIndex, total) {
  let distance = index - activeIndex;
  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return distance;
}

function updateCoverflow() {
  const total = coverflowSlides.length;
  coverflowSlides.forEach((slide, index) => {
    const distance = circularDistance(index, activeGalleryIndex, total);
    slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next');
    slide.setAttribute('aria-hidden', 'true');

    if (distance === 0) {
      slide.classList.add('is-active');
      slide.setAttribute('aria-hidden', 'false');
    } else if (distance === -1) {
      slide.classList.add('is-prev');
    } else if (distance === 1) {
      slide.classList.add('is-next');
    } else if (distance === -2) {
      slide.classList.add('is-far-prev');
    } else if (distance === 2) {
      slide.classList.add('is-far-next');
    }
  });

  const dots = galleryDots?.querySelectorAll('.gallery-dot') || [];
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeGalleryIndex);
    dot.setAttribute('aria-current', index === activeGalleryIndex ? 'true' : 'false');
  });
}

function goToGallerySlide(index) {
  if (!coverflowSlides.length) return;
  activeGalleryIndex = (index + coverflowSlides.length) % coverflowSlides.length;
  updateCoverflow();
}

function openGalleryLightbox(slide) {
  if (!galleryLightbox || !lightboxImage || !lightboxCaption) return;
  lastGalleryFocus = document.activeElement;
  lightboxImage.src = slide.dataset.image || slide.querySelector('img')?.src || '';
  lightboxImage.alt = slide.dataset.alt || slide.querySelector('img')?.alt || '';
  lightboxCaption.textContent = slide.dataset.title || slide.querySelector('figcaption')?.textContent || '';
  galleryLightbox.classList.add('open');
  galleryLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  galleryLightbox.querySelector('.lightbox-close')?.focus();
}

function closeGalleryLightbox() {
  if (!galleryLightbox) return;
  galleryLightbox.classList.remove('open');
  galleryLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lightboxImage) lightboxImage.src = '';
  if (lastGalleryFocus) lastGalleryFocus.focus();
}

if (coverflowSlides.length) {
  coverflowSlides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (index === activeGalleryIndex) {
        openGalleryLightbox(slide);
      } else {
        goToGallerySlide(index);
      }
    });
  });

  coverflowSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ver imagen ${index + 1} de la galería`);
    dot.addEventListener('click', () => goToGallerySlide(index));
    galleryDots?.appendChild(dot);
  });

  galleryPrev?.addEventListener('click', () => goToGallerySlide(activeGalleryIndex - 1));
  galleryNext?.addEventListener('click', () => goToGallerySlide(activeGalleryIndex + 1));

  galleryLightbox?.addEventListener('click', (event) => {
    if (event.target.matches('[data-close-lightbox]') || event.target === galleryLightbox) {
      closeGalleryLightbox();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (galleryLightbox?.classList.contains('open') && event.key === 'Escape') {
      closeGalleryLightbox();
      return;
    }

    const galleryIsVisible = document.getElementById('galeria')?.getBoundingClientRect();
    const isNearGallery = galleryIsVisible && galleryIsVisible.top < window.innerHeight && galleryIsVisible.bottom > 0;
    if (!isNearGallery || galleryLightbox?.classList.contains('open') || traditionModal?.classList.contains('open')) return;

    if (event.key === 'ArrowLeft') goToGallerySlide(activeGalleryIndex - 1);
    if (event.key === 'ArrowRight') goToGallerySlide(activeGalleryIndex + 1);
  });

  updateCoverflow();
}

// Blog cultural: abrir historias en ventana emergente
const blogCards = document.querySelectorAll('.blog-card');
const blogModal = document.getElementById('blogModal');
const blogModalTitle = document.getElementById('blogModalTitle');
const blogModalCategory = document.getElementById('blogModalCategory');
const blogModalImage = document.getElementById('blogModalImage');
const blogModalBody = document.getElementById('blogModalBody');
let lastBlogFocus = null;

function openBlogModal(card) {
  if (!blogModal || !blogModalTitle || !blogModalCategory || !blogModalImage || !blogModalBody) return;
  lastBlogFocus = document.activeElement;
  blogModalTitle.textContent = card.dataset.blogTitle || '';
  blogModalCategory.textContent = card.dataset.blogCategory || '';
  blogModalImage.src = card.dataset.blogImage || '';
  blogModalImage.alt = card.dataset.blogAlt || card.dataset.blogTitle || 'Imagen del blog cultural';
  const paragraphs = (card.dataset.blogBody || '')
    .split('\n\n')
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');
  blogModalBody.innerHTML = paragraphs;
  blogModal.classList.add('open');
  blogModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  blogModal.querySelector('.modal-close')?.focus();
}

function closeBlogModal() {
  if (!blogModal) return;
  blogModal.classList.remove('open');
  blogModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (blogModalImage) blogModalImage.src = '';
  if (lastBlogFocus) lastBlogFocus.focus();
}

blogCards.forEach((card) => {
  const button = card.querySelector('.blog-read-more');
  button?.addEventListener('click', () => openBlogModal(card));
});

blogModal?.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-blog-modal]')) {
    closeBlogModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && blogModal?.classList.contains('open')) {
    closeBlogModal();
  }
});
