(() => {
  const cards = [...document.querySelectorAll('.research-card')];
  const filters = [...document.querySelectorAll('[data-project-filter]')];
  const toolbar = document.querySelector('.research-toolbar');
  const resultCount = document.querySelector('.research-result-count');

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
        let visible = 0;
        cards.forEach(card => {
          card.hidden = category !== 'all' && card.dataset.projectCategory !== category;
          if (!card.hidden) visible += 1;
        });
        resultCount.textContent = `${visible} project${visible === 1 ? '' : 's'}`;
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
  let opener;

  document.querySelectorAll('[data-figure]').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      // Preserve normal links for a new tab or browser context menu.
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.caption;
      original.href = link.href;
      document.body.classList.add('figure-is-open');
      dialog.showModal();
    });
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
  });
})();
