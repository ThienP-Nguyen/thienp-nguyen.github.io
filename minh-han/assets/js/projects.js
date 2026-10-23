(() => {
  const cards = [...document.querySelectorAll('.research-card')];
  const filters = [...document.querySelectorAll('[data-project-filter]')];
  const toolbar = document.querySelector('.research-toolbar');

  if (cards.length && filters.length) {
    toolbar.hidden = false;
    filters.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.projectFilter;
        filters.forEach(filter => {
          const selected = filter === button;
          filter.classList.toggle('active', selected);
          filter.setAttribute('aria-pressed', String(selected));
        });
        cards.forEach(card => {
          card.hidden = category !== 'all' && card.dataset.projectCategory !== category;
        });
      });
    });
  }

  // Move the soft highlight with a mouse; figures remain readable and stationary.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  cards.forEach(card => {
    let frame = 0;
    card.addEventListener('pointermove', event => {
      if (reducedMotion.matches || !finePointer.matches || frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
        frame = 0;
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
    });
  });

  // Native dialog supplies Escape handling and keyboard focus containment.
  const dialog = document.querySelector('.figure-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.figure-dialog-image');
  const caption = dialog.querySelector('#figure-dialog-caption');
  const original = dialog.querySelector('.figure-original');
  const galleryNav = dialog.querySelector('.figure-gallery-nav');
  const position = dialog.querySelector('.figure-position');
  const previous = dialog.querySelector('.figure-previous');
  const next = dialog.querySelector('.figure-next');
  const figureLinks = [...document.querySelectorAll('[data-figure]')];
  let gallery = [];
  let galleryIndex = 0;
  let opener;

  function showFigure(index) {
    if (!gallery.length) return;
    galleryIndex = Math.max(0, Math.min(index, gallery.length - 1));
    const link = gallery[galleryIndex];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    caption.textContent = link.dataset.caption;
    original.href = link.href;
    galleryNav.hidden = gallery.length < 2;
    position.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
    previous.disabled = galleryIndex === 0;
    next.disabled = galleryIndex === gallery.length - 1;
  }

  figureLinks.forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      // Preserve normal links for a new tab or browser context menu.
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      gallery = link.dataset.gallery
        ? figureLinks.filter(figure => figure.dataset.gallery === link.dataset.gallery)
            .sort((a, b) => Number(a.dataset.galleryOrder) - Number(b.dataset.galleryOrder))
        : [link];
      showFigure(gallery.indexOf(link));
      document.body.classList.add('figure-is-open');
      dialog.showModal();
    });
  });

  previous.addEventListener('click', () => showFigure(galleryIndex - 1));
  next.addEventListener('click', () => showFigure(galleryIndex + 1));
  dialog.addEventListener('keydown', event => {
    if (!dialog.open || gallery.length < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showFigure(galleryIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.querySelector('.figure-close').addEventListener('click', () => dialog.close());
  let startedOnBackdrop = false;
  dialog.addEventListener('pointerdown', event => {
    startedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', event => {
    if (!startedOnBackdrop || event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('figure-is-open');
    opener?.focus({ preventScroll: true });
    gallery = [];
  });
})();
