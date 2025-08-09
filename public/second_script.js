document.addEventListener('DOMContentLoaded', () => {
  // === настройки ===
  const ANIM = 300;          // длительность анимации, мс
  const BUFFER_PX = 2;       // страховочный буфер
  const EXTRA_GAP_PX = 16;   // зазор снизу у открытой панели

  // на случай, если были навешаны старые обработчики — сбросим узел
  const root = document.querySelector('.left-tabs');
  if (!root) return;
  root.replaceWith(root.cloneNode(true));
  const leftTabs = document.querySelector('.left-tabs');

  // вспомогательные
  const getTargetHeight = (panel) => {
    const natural = panel.scrollHeight;
    const last = panel.lastElementChild;
    const lastMb = last ? parseFloat(getComputedStyle(last).marginBottom) || 0 : 0;
    return natural + lastMb + BUFFER_PX + EXTRA_GAP_PX;
  };

  const setOpen = (btn, panel, open) => {
    // старые классы/инлайны
    panel.classList.remove('open');

    if (open) {
      // ОТКРЫТИЕ
      // 1) готовим
      panel.style.overflow = 'hidden';
      panel.style.transition = 'none';
      panel.style.maxHeight = 'none';
      const target = getTargetHeight(panel);

      // 2) старт: 0px
      panel.style.maxHeight = '0px';

      // 3) следующий кадр — едем к target
      requestAnimationFrame(() => {
        panel.style.transition = `max-height ${ANIM}ms ease`;
        panel.style.maxHeight = target + 'px';
      });

      // кнопка
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');

      const onEnd = () => {
        panel.style.transition = 'none';
        panel.style.maxHeight = 'none';   // снимаем ограничение, чтобы контейнер тянулся
        panel.style.overflow = 'visible'; // тени/скругления не режутся
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);

    } else {
      // ЗАКРЫТИЕ
      panel.style.overflow = 'hidden';
      panel.style.transition = 'none';

      // фиксируем текущую высоту -> анимируем к 0
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

  // клик по табам
  leftTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-button');
    if (!btn) return;

    const panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains('submenu')) return;

    const isOpen = btn.classList.contains('is-open');
    setOpen(btn, panel, !isOpen);
  });

  // пересчёт при ресайзе — открытым панелям снимаем ограничение
  window.addEventListener('resize', () => {
    document.querySelectorAll('.tab-button.is-open + .submenu').forEach(p => {
      p.style.transition = 'none';
      p.style.maxHeight = 'none';
      p.style.overflow = 'visible';
    });
  });
});
