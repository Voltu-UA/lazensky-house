function setupLoadMoreButton(buttonId, itemSelector, batchSize, options = {}) {
  const button = document.getElementById(buttonId);
  const items = Array.from(document.querySelectorAll(itemSelector));
  const { deferHiddenImages = false } = options;

  if (!button) return;
  if (items.length === 0) {
    button.style.display = 'none';
    return;
  }

  const getImagesFromItem = (item) => {
    if (item.tagName === 'IMG') return [item];
    return Array.from(item.querySelectorAll('img'));
  };

  if (deferHiddenImages) {
    items.forEach((item) => {
      getImagesFromItem(item).forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !img.dataset.src) {
          img.dataset.src = src;
          img.removeAttribute('src');
        }
        img.loading = 'lazy';
        img.decoding = 'async';
      });
    });
  }

  let visibleCount = 0;

  const render = () => {
    items.forEach((item, index) => {
      const shouldShow = index < visibleCount;
      item.classList.toggle('show', shouldShow);

      if (shouldShow && deferHiddenImages) {
        getImagesFromItem(item).forEach((img) => {
          if (!img.getAttribute('src') && img.dataset.src) {
            img.setAttribute('src', img.dataset.src);
          }
        });
      }
    });

    const remaining = Math.max(items.length - visibleCount, 0);
    button.setAttribute('aria-expanded', String(visibleCount > 0));
    button.textContent = remaining > 0 ? 'Показати ще' : 'Приховати';
  };

  button.addEventListener('click', () => {
    const step = typeof batchSize === 'function' ? batchSize() : batchSize;

    if (visibleCount >= items.length) {
      visibleCount = 0;
    } else {
      visibleCount = Math.min(visibleCount + step, items.length);
    }
    render();
  });

  render();
}

function applyResponsiveGalleryInitialState() {
  const initiallyVisible = 3;
  const galleryItems = Array.from(document.querySelectorAll('#gallery .gallery-grid > img'));

  galleryItems.forEach((item, index) => {
    if (index >= initiallyVisible) {
      item.classList.add('hidden-image');
      item.classList.remove('show');
    } else {
      item.classList.remove('hidden-image');
      item.classList.remove('show');
    }
  });
}

function applyResponsivePlansInitialState() {
  const initiallyVisible = 3;
  const planItems = Array.from(document.querySelectorAll('#plans .plans-grid > a'));

  planItems.forEach((item, index) => {
    if (index >= initiallyVisible) {
      item.classList.add('hidden-image');
      item.classList.remove('show');
    } else {
      item.classList.remove('hidden-image');
      item.classList.remove('show');
    }
  });
}

function setupConstructionTimeline() {
  const carousel = document.getElementById('constructionMonthCarousel');
  const prevButton = document.getElementById('constructionMonthPrev');
  const nextButton = document.getElementById('constructionMonthNext');
  const currentLabel = document.getElementById('constructionMonthCurrent');
  const content = document.getElementById('constructionMonthContent');
  const videos = document.getElementById('constructionVideos');
  const description = document.getElementById('constructionDescription');
  const readMoreBtn = document.getElementById('constructionReadMoreBtn');
  const details = document.getElementById('constructionDetails');
  const highlights = document.getElementById('constructionHighlights');
  const photos = document.getElementById('constructionPhotos');
  const dataScript = document.getElementById('constructionUpdatesData');

  if (
    !carousel || !prevButton || !nextButton || !currentLabel || !content ||
    !videos || !description || !readMoreBtn || !details || !highlights ||
    !photos || !dataScript
  ) {
    return;
  }

  let updates = [];
  try {
    updates = JSON.parse(dataScript.textContent || '[]');
  } catch (error) {
    console.error('Invalid construction updates JSON', error);
    return;
  }

  updates = updates
    .map((item) => {
      if (!item) return null;
      const monthVideos = Array.isArray(item.videos) ? item.videos : (item.videoId ? [item.videoId] : []);
      return { ...item, videos: monthVideos };
    })
    .filter((item) => item && item.year && item.month && item.videos.length > 0)
    .sort((a, b) => (a.year - b.year) || (a.month - b.month));

  if (updates.length === 0) {
    content.textContent = 'Наразі немає відео для відображення.';
    carousel.style.display = 'none';
    return;
  }

  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentYearItems = updates
    .map((item, index) => ({ ...item, index }))
    .filter((item) => item.year === currentYear);

  const defaultIndex = currentYearItems.length > 0
    ? currentYearItems.sort((a, b) => b.month - a.month)[0].index
    : 0;

  let selectedIndex = defaultIndex;
  let detailsExpanded = false;

  const renderUpdate = (index) => {
    const item = updates[index];
    if (!item) return;

    const currentMonthLabel = `${monthNames[item.month - 1]} ${item.year}`;
    content.classList.add('construction-month-switching');

    description.textContent = item.description || '';

    videos.innerHTML = '';
    item.videos.forEach((videoId) => {
      const card = document.createElement('a');
      card.className = 'construction-media-item construction-video-item';
      card.href = `https://youtube.com/shorts/${videoId}`;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

      const thumb = document.createElement('img');
      thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      thumb.alt = `Відео будівництва за ${currentMonthLabel}`;

      const label = document.createElement('span');
      label.className = 'construction-video-label';
      label.textContent = 'Дивитись на YouTube';

      card.append(thumb, label);
      videos.append(card);
    });

    highlights.innerHTML = '';
    if (Array.isArray(item.highlights)) {
      item.highlights.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = entry;
        highlights.append(li);
      });
    }

    photos.innerHTML = '';
    if (Array.isArray(item.photos)) {
      item.photos.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Фото будівництва ${currentMonthLabel}`;
        img.loading = 'lazy';
        photos.append(img);
      });
    }

    detailsExpanded = false;
    details.classList.remove('expanded');
    readMoreBtn.setAttribute('aria-expanded', 'false');
    readMoreBtn.textContent = 'Дізнатися більше';

    window.requestAnimationFrame(() => {
      content.classList.remove('construction-month-switching');
    });
  };

  const labelFor = (index) => {
    const item = updates[index];
    return `${monthNames[item.month - 1]} ${item.year}`;
  };

  const renderControls = () => {
    currentLabel.textContent = labelFor(selectedIndex);
    prevButton.disabled = selectedIndex === 0;
    nextButton.disabled = selectedIndex === updates.length - 1;
  };

  prevButton.addEventListener('click', () => {
    if (selectedIndex <= 0) return;
    selectedIndex -= 1;
    renderControls();
    renderUpdate(selectedIndex);
  });

  nextButton.addEventListener('click', () => {
    if (selectedIndex >= updates.length - 1) return;
    selectedIndex += 1;
    renderControls();
    renderUpdate(selectedIndex);
  });

  readMoreBtn.addEventListener('click', () => {
    detailsExpanded = !detailsExpanded;
    details.classList.toggle('expanded', detailsExpanded);
    readMoreBtn.setAttribute('aria-expanded', String(detailsExpanded));
    readMoreBtn.textContent = detailsExpanded ? 'Приховати деталі' : 'Дізнатися більше';
  });

  renderControls();
  renderUpdate(selectedIndex);
}

function setupGalleryEnhancements() {
  const galleryImages = Array.from(document.querySelectorAll('#gallery .gallery-grid > img'));
  const showMoreButton = document.getElementById('showMoreBtn');
  if (galleryImages.length === 0) return;

  galleryImages.forEach((img) => {
    const fullSrc = img.getAttribute('src');
    if (!fullSrc) return;

    img.dataset.full = fullSrc;
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  let lightbox = document.getElementById('galleryLightbox');
  let lightboxImage = document.getElementById('galleryLightboxImage');
  let lightboxClose = document.getElementById('galleryLightboxClose');

  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'galleryLightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <button id="galleryLightboxClose" type="button" class="gallery-lightbox-close" aria-label="Закрити">×</button>
      <img id="galleryLightboxImage" src="" alt="Зображення галереї" />
    `;
    document.body.append(lightbox);
    lightboxImage = document.getElementById('galleryLightboxImage');
    lightboxClose = document.getElementById('galleryLightboxClose');
  }

  const openLightbox = (fullSrc, altText) => {
    if (!lightboxImage || !lightbox) return;
    lightboxImage.setAttribute('src', fullSrc);
    lightboxImage.setAttribute('alt', altText || 'Зображення галереї');
    lightbox.hidden = false;
  };

  const closeLightbox = () => {
    if (!lightboxImage || !lightbox) return;
    lightbox.hidden = true;
    lightboxImage.setAttribute('src', '');
  };

  galleryImages.forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      openLightbox(img.dataset.full || img.getAttribute('src') || '', img.alt);
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  // Intentional no auto-load on scroll; only explicit button click.
}

function scrollToSectionByPath() {
  const rawPath = window.location.pathname.replace(/^\/|\/$/g, '');
  if (!rawPath) return;

  const section = document.getElementById(rawPath);
  if (!section) return;

  window.requestAnimationFrame(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    section.setAttribute('tabindex', '-1');
    try {
      section.focus({ preventScroll: true });
    } catch (error) {
      section.focus();
    }

    // Keep direct section routes for SEO, but restore "/" after navigation
    // so manual refresh returns to the hero/logo view.
    window.setTimeout(() => {
      window.history.replaceState(null, '', '/');
    }, 220);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  applyResponsiveGalleryInitialState();
  applyResponsivePlansInitialState();
  setupLoadMoreButton(
    'showMoreBtn',
    '#gallery .hidden-image',
    3,
    { deferHiddenImages: true }
  );
  setupLoadMoreButton(
    'showMorePlansBtn',
    '#plans .hidden-image',
    3
  );
  setupGalleryEnhancements();
  setupConstructionTimeline();
  scrollToSectionByPath();
});
