function setupLoadMoreButton(buttonId, itemSelector, batchSize) {
  const button = document.getElementById(buttonId);
  const items = Array.from(document.querySelectorAll(itemSelector));

  if (!button) return;
  if (items.length === 0) {
    button.style.display = 'none';
    return;
  }

  let visibleCount = 0;

  const render = () => {
    items.forEach((item, index) => {
      item.classList.toggle('show', index < visibleCount);
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
  const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
  const initiallyVisible = isSmallScreen ? 3 : 6;
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

function setupConstructionTimeline() {
  const carousel = document.getElementById('constructionMonthCarousel');
  const prevButton = document.getElementById('constructionMonthPrev');
  const nextButton = document.getElementById('constructionMonthNext');
  const currentLabel = document.getElementById('constructionMonthCurrent');
  const content = document.getElementById('constructionMonthContent');
  const video = document.getElementById('constructionVideo');
  const description = document.getElementById('constructionDescription');
  const readMoreBtn = document.getElementById('constructionReadMoreBtn');
  const details = document.getElementById('constructionDetails');
  const highlights = document.getElementById('constructionHighlights');
  const photos = document.getElementById('constructionPhotos');
  const youtubeLink = document.getElementById('constructionYoutubeLink');
  const dataScript = document.getElementById('constructionUpdatesData');

  if (
    !carousel || !prevButton || !nextButton || !currentLabel || !content ||
    !video || !description || !readMoreBtn || !details || !highlights ||
    !photos || !youtubeLink || !dataScript
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
    .filter((item) => item && item.year && item.month && item.videoId)
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

    const embedSrc = `https://www.youtube.com/embed/${item.videoId}?hl=uk&cc_lang_pref=uk&cc_load_policy=1&rel=0`;
    const videoTitle = `Будівництво за ${monthNames[item.month - 1]} ${item.year}`;

    content.classList.add('construction-month-switching');

    if (video.getAttribute('src') !== embedSrc) {
      video.setAttribute('src', embedSrc);
    }
    video.setAttribute('title', videoTitle);
    description.textContent = item.description || '';
    youtubeLink.setAttribute('href', `https://youtube.com/shorts/${item.videoId}`);

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
        img.alt = `Фото будівництва ${monthNames[item.month - 1]} ${item.year}`;
        img.loading = 'lazy';
        photos.append(img);
      });
    }

    detailsExpanded = false;
    details.classList.remove('expanded');
    readMoreBtn.setAttribute('aria-expanded', 'false');
    readMoreBtn.textContent = 'Читати більше';

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
    readMoreBtn.textContent = detailsExpanded ? 'Приховати деталі' : 'Читати більше';
  });

  renderControls();
  renderUpdate(selectedIndex);
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
  setupLoadMoreButton(
    'showMoreBtn',
    '#gallery .hidden-image',
    () => (window.matchMedia('(max-width: 768px)').matches ? 3 : 6)
  );
  setupLoadMoreButton('showMorePlansBtn', '#plans .hidden-image', 6);
  setupConstructionTimeline();
  scrollToSectionByPath();
});
