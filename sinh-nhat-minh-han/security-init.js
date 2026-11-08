document.documentElement.classList.add('intro-pending');
// Keep the birthday page visible if its intro script cannot load.
document.addEventListener('error', event => {
  if (event.target instanceof HTMLScriptElement && event.target.getAttribute('src') === 'intro.js?v=2') {
    document.documentElement.classList.remove('intro-pending');
  }
}, true);
