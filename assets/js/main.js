const themeToggle=document.querySelector('.theme-toggle');
const menuToggle=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('.mobile-nav');
const THEME_KEY='thien-site-theme';

function applyTheme(theme){
  document.body.classList.toggle('dark-mode',theme==='dark');
  if(themeToggle){
    themeToggle.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');
    themeToggle.setAttribute('title',theme==='dark'?'Switch to light mode':'Switch to dark mode');
  }
}
const savedTheme=localStorage.getItem(THEME_KEY);
const prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme||(prefersDark?'dark':'light'));

themeToggle?.addEventListener('click',()=>{
  const next=document.body.classList.contains('dark-mode')?'light':'dark';
  localStorage.setItem(THEME_KEY,next);
  applyTheme(next);
});

menuToggle?.addEventListener('click',()=>{
  const open=mobileNav?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(Boolean(open)));
});

mobileNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  mobileNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded','false');
}));