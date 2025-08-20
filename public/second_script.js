document.addEventListener('DOMContentLoaded', () => {
  const ANIM = 300;
  const BUFFER_PX = 2;
  const EXTRA_GAP_PX = 16;

  // ====== ACCORDION (single source of truth) ======
  const leftTabs = document.querySelector('.left-tabs');

  const getTargetHeight = (panel) => {
    // Нужна естественная высота + возможный внешний отступ последнего элемента,
    // иначе при анимации виден «обрез».
    const natural = panel.scrollHeight;
    const last = panel.lastElementChild;
    const lastMb = last ? parseFloat(getComputedStyle(last).marginBottom) || 0 : 0;
    return natural + lastMb + BUFFER_PX + EXTRA_GAP_PX;
  };

  const setOpen = (btn, panel, open) => {
    if (!panel || !panel.classList.contains('submenu')) return;

    // Анимация закрытия
    if (!open) {
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
        panel.style.overflow = '';
        panel.classList.remove('open');
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);

      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      const arrow = btn.querySelector('.arrow-icon');
      if (arrow) arrow.classList.remove('rotated');
      return;
    }

    // Анимация открытия
    panel.classList.add('open');
    panel.style.overflow = 'hidden';
    panel.style.transition = 'none';
    panel.style.maxHeight = '0px';

    const target = getTargetHeight(panel);

    requestAnimationFrame(() => {
      panel.style.transition = `max-height ${ANIM}ms ease`;
      panel.style.maxHeight = target + 'px';
    });

    const onEnd = () => {
      panel.style.transition = 'none';
      panel.style.maxHeight = 'none';
      panel.style.overflow = 'visible';
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);

    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    const arrow = btn.querySelector('.arrow-icon');
    if (arrow) arrow.classList.add('rotated');
  };

  const togglePanel = (btn) => {
    const panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains('submenu')) return;

    const isOpen = btn.classList.contains('is-open');

    // Эксклюзивное открытие в рамках одного контейнера
    const scope = panel.parentElement; // общий родитель для соседних блоков
    const opened = scope
      ? Array.from(scope.children).filter(
          (el) => el !== panel && el.classList && el.classList.contains('submenu') && el.classList.contains('open')
        )
      : [];
    opened.forEach((sib) => {
      const sibBtn =
        sib.previousElementSibling && sib.previousElementSibling.classList.contains('tab-button')
          ? sib.previousElementSibling
          : null;
      setOpen(sibBtn, sib, false);
    });

    setOpen(btn, panel, !isOpen);
  };

  if (leftTabs) {
    leftTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-button');
      if (!btn || !leftTabs.contains(btn)) return;
      if (btn.classList.contains('no-arrow') || btn.classList.contains('plus-tab')) return;
      togglePanel(btn);
    });

    // При ресайзе раскрытые панели переводим на auto-height без рывков
    window.addEventListener('resize', () => {
      document.querySelectorAll('.tab-button.is-open + .submenu').forEach((p) => {
        p.style.transition = 'none';
        p.style.maxHeight = 'none';
        p.style.overflow = 'visible';
      });
    });
  }

  // ====== GLOBAL CLICK HANDLER for color/sample picks ======
  document.addEventListener('click', (e) => {
    // Цвет
    const colorBtn = e.target.closest('.color-btn');
    if (colorBtn) {
      const row = colorBtn.closest('.color-row');
      if (row) {
        row.querySelectorAll('.color-btn.is-active').forEach((b) => b.classList.remove('is-active'));
        colorBtn.classList.add('is-active');
      }
      return; // не даём событию обрабатываться ниже как sample
    }

    // Шаблон
    const card = e.target.closest('.sample-item');
    if (card) {
      const grid = card.closest('.sample-grid');
      if (grid) {
        grid.querySelectorAll('.sample-item.is-active').forEach((el) => el.classList.remove('is-active'));
        card.classList.add('is-active');
      }
    }
  });

  // ====== PROGRESS (readiness) ======
  const form = document.querySelector('.main-form');
  const progressLabel = document.querySelector('.readness-block span');
  const progressFill = document.querySelector('.progress-fill');

  const inputs = form
    ? Array.from(form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea'))
    : [];

  const updateProgress = () => {
    const total = inputs.length || 1;
    const filled = inputs.filter((i) => (i.value || '').trim().length > 0).length;
    const pct = Math.round((filled / total) * 100);
    if (progressLabel) progressLabel.textContent = pct + '%';
    if (progressFill) progressFill.style.width = pct + '%';
  };

  inputs.forEach((i) => i.addEventListener('input', updateProgress));
  updateProgress();

  // ====== SAVE BUTTON (stub or delegation) ======
  const saveBtn = document.querySelector('.save-cv-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      // Если хочешь запускать сабмит формы public/script.js:
      // const cvForm = document.getElementById('cvForm');
      // if (cvForm) cvForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      // Иначе — простая заглушка:
      alert('CV saved locally (stub). Add your persistence logic here.');
    });
  }
});
