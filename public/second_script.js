document.addEventListener('DOMContentLoaded', () => {
  const ANIM = 300;
  const BUFFER_PX = 2;
  const EXTRA_GAP_PX = 16;

  const root = document.querySelector('.left-tabs');
  if (!root) return;
  root.replaceWith(root.cloneNode(true));
  const leftTabs = document.querySelector('.left-tabs');

  const getTargetHeight = (panel) => {
    const natural = panel.scrollHeight;
    const last = panel.lastElementChild;
    const lastMb = last ? parseFloat(getComputedStyle(last).marginBottom) || 0 : 0;
    return natural + lastMb + BUFFER_PX + EXTRA_GAP_PX;
  };

  const setOpen = (btn, panel, open) => {
    panel.classList.remove('open');

    if (open) {
      panel.style.overflow = 'hidden';
      panel.style.transition = 'none';
      panel.style.maxHeight = 'none';
      const target = getTargetHeight(panel);

      panel.style.maxHeight = '0px';

      requestAnimationFrame(() => {
        panel.style.transition = `max-height ${ANIM}ms ease`;
        panel.style.maxHeight = target + 'px';
      });

      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');

      const onEnd = () => {
        panel.style.transition = 'none';
        panel.style.maxHeight = 'none';
        panel.style.overflow = 'visible';
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);

    } else {
      panel.style.overflow = 'hidden';
      panel.style.transition = 'none';

      const current = panel.scrollHeight;
      panel.style.maxHeight = current + 'px';

      requestAnimationFrame(() => {
        panel.style.transition = `max-height ${ANIM}ms ease`;
        panel.style.maxHeight = '0px';
      });

      const onEnd = () => {
        panel.style.transition = 'none';
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);

      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  };

  leftTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-button');
    if (!btn) return;

    const panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains('submenu')) return;

    const isOpen = btn.classList.contains('is-open');
    setOpen(btn, panel, !isOpen);
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.tab-button.is-open + .submenu').forEach(p => {
      p.style.transition = 'none';
      p.style.maxHeight = 'none';
      p.style.overflow = 'visible';
    });
  });
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.color-btn');
  if (!btn) return;

  const row = btn.closest('.color-row');
  if (!row) return;

  row.querySelectorAll('.color-btn.is-active').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');

});

document.addEventListener('click', (e) => {
  const card = e.target.closest('.sample-item');
  if (!card) return;
  const grid = card.closest('.sample-grid');
  grid.querySelectorAll('.sample-item.is-active').forEach(el => el.classList.remove('is-active'));
  card.classList.add('is-active');

});