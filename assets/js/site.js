
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener'); rel.add('noreferrer'); a.setAttribute('rel', [...rel].join(' '));
  });
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.removeAttribute('open')));
  }
});
