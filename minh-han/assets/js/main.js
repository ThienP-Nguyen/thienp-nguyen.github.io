const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const themeKey = 'minh-han-site-theme';
function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  themeToggle?.setAttribute('aria-label', label);
  themeToggle?.setAttribute('title', label);
}
let savedTheme;
try { savedTheme = localStorage.getItem(themeKey); } catch {}
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
themeToggle?.addEventListener('click', () => {
  const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  try { localStorage.setItem(themeKey, next); } catch {}
  applyTheme(next);
});
function closeMenu() {
  mobileNav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}
menuToggle?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileNav?.classList.contains('open')) {
    closeMenu();
    menuToggle?.focus();
  }
});
const filters = document.querySelectorAll('.pub-filter');
const papers = document.querySelectorAll('.pub-card');
const groups = document.querySelectorAll('.pub-year-group');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  papers.forEach(paper => {
    const type = paper.dataset.type;
    paper.hidden = filter !== 'all' && filter !== type && !(filter === 'manuscript' && ['revision', 'preparation'].includes(type));
  });
  groups.forEach(group => {
    group.hidden = ![...group.querySelectorAll('.pub-card')].some(paper => !paper.hidden);
  });
}));

