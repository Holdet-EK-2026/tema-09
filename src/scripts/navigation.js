const header = document.querySelector('.site-header');
const toggle = header?.querySelector('.menu-toggle');
const menu = header?.querySelector('.mobile-navigation');
if (toggle && menu) {
  const mobile = matchMedia('(max-width: 600px)');
  function close(restore = false) {
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = mobile.matches;
    if (restore) toggle.focus();
  }
  function sync() { toggle.hidden = !mobile.matches; close(); }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); menu.hidden = !open;
    if (open) menu.querySelector('a').focus();
  });
  header.addEventListener('keydown', e => { if(e.key === 'Escape') close(true); });
  menu.addEventListener('click', e => { if(e.target.closest('a')) close(); });
  document.addEventListener('pointerdown', e => { if(!header.contains(e.target)) close(); });
  header.addEventListener('focusout', e => { if(e.relatedTarget && !header.contains(e.relatedTarget)) close(); });
  mobile.addEventListener('change', sync); sync();
}
