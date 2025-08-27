// public/scripts/template-preview.js
(() => {
  // ===== 0) Хост справа =====
  function ensureHost() {
    let right = document.querySelector('.right-form');
    if (!right) {
      right = document.createElement('div');
      right.className = 'right-form';
      document.body.appendChild(right);
    }
    let host = right.querySelector('.preview-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'preview-host';
      right.appendChild(host);
    }
    let tb = host.querySelector('.preview-toolbar');
    if (!tb) {
      tb = document.createElement('div');
      tb.className = 'preview-toolbar';
      tb.innerHTML = `<button type="button" data-act="print">Print to PDF</button>`;
      host.appendChild(tb);
    }
    let paper = host.querySelector('.preview-paper');
    if (!paper) {
      paper = document.createElement('div');
      paper.className = 'preview-paper';
      host.appendChild(paper);
    }
    return { host, paper };
  }

  // ===== 0.1) Базовые стили (если не подключены в style.css) =====
  if (!document.getElementById('cv-preview-inline-style')) {
    const s = document.createElement('style');
    s.id = 'cv-preview-inline-style';
    s.textContent = `
      .preview-host{display:grid;gap:8px}
      .preview-toolbar{display:flex;gap:8px}
      .preview-toolbar button{padding:6px 10px;border:1px solid #d0d7e2;background:#fff;border-radius:8px;cursor:pointer}
      .preview-toolbar button:hover{background:#f3f4f6}
      .preview-paper{width:794px;height:1123px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 24px rgba(15,23,42,.06);overflow:hidden}
      .cv{font:14px/1.5 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;color:#0b1220;height:100%;display:flex;flex-direction:column}
      .cv h1,.cv h2,.cv h3{margin:0 0 6px}
      .cv small,.cv .muted{color:#6b7280}
      .cv ul{margin:6px 0 0 18px}.cv li{margin:4px 0}
      @media print{
        body{background:#fff}
        .up-header-wrapper,.left-form,.preview-toolbar{display:none!important}
        .preview-paper{box-shadow:none!important;border:none!important;width:210mm;height:297mm}
      }
    `;
    document.head.appendChild(s);
  }

  // ===== 1) Данные из формы =====
  function getData() {
    const val = id => document.getElementById(id)?.value?.trim() || '';
    const split = s => (s || '').split(/\n|,/).map(x => x.trim()).filter(Boolean);
    const photo =
      document.getElementById('livePhoto')?.src ||
      document.getElementById('preview')?.src || '';

    return {
      firstName : val('firstName'),
      lastName  : val('lastName'),
      position  : val('position') || 'Your Position',
      city      : val('city'),
      phone     : val('phone'),
      email     : val('email'),
      github    : val('github'),
      about     : val('about'),
      skills    : split(document.getElementById('skills')?.value),
      experience: split(document.getElementById('experience')?.value),
      education : split(document.getElementById('education')?.value),
      photo
    };
  }

  // ===== 2) Семейства макетов =====
  function viewClassic(d) {
    const fullName = `${d.firstName || 'Name'} ${d.lastName || 'Surname'}`.trim();
    const skillsLi = (d.skills?.length ? d.skills : ['JavaScript','HTML','CSS']).map(s=>`<li>${s}</li>`).join('');
    const expLi = (d.experience?.length ? d.experience : ['Company — Role — Years']).map(s=>`<li>${s}</li>`).join('');
    const eduLi = (d.education?.length ? d.education : ['University — Program — Years']).map(s=>`<li>${s}</li>`).join('');
    return `
      <div class="header" style="display:flex;gap:18px;align-items:center;margin:0 0 12px;">
        <div class="avatar" style="width:84px;height:84px;border-radius:12px;background:#e5e7eb;overflow:hidden;flex:0 0 auto;">
          ${d.photo ? `<img src="${d.photo}" alt="" style="width:100%;height:100%;object-fit:cover">` : ''}
        </div>
        <div class="title">
          <h1 style="font-size:26px">${fullName}</h1>
          <div class="role" style="color:#475569">${d.position}</div>
          <div class="muted">${[d.city, d.phone, d.email, d.github].filter(Boolean).join(' · ')}</div>
        </div>
      </div>
      <div class="grid" style="display:grid;grid-template-columns:1.1fr .9fr;gap:20px;margin-top:10px;">
        <div class="card" style="border:1px solid #eef2f7;border-radius:10px;padding:12px;background:#fff">
          <h3>About</h3>
          <p class="muted">${d.about || 'Short summary goes here.'}</p>
          <h3>Skills</h3>
          <ul>${skillsLi}</ul>
        </div>
        <div class="card" style="border:1px solid #eef2f7;border-radius:10px;padding:12px;background:#fff">
          <h3>Experience</h3>
          <ul>${expLi}</ul>
          <h3>Education</h3>
          <ul>${eduLi}</ul>
        </div>
      </div>
    `;
  }

  // === Sidebar (CV-2) — разметка соответствует CSS: .cv2-side / .cv2-header / .cv2-content
  function viewSidebar(d) {
    const fullName = `${d.firstName || 'Name'} ${d.lastName || 'Surname'}`.trim();
    const skills = d.skills?.length ? d.skills : ['HTML/CSS','JavaScript ES6','React'];
    const exp    = d.experience?.length ? d.experience : ['Company — Role — Years'];
    const edu    = d.education?.length ? d.education : ['University — Program — Years'];

    return `
      <aside class="cv2-side">
        <div class="cv2-photo">${d.photo ? `<img src="${d.photo}" alt="">` : ''}</div>

        <h3>Education</h3>
        <ul class="cv2-list">
          ${edu.map(e => `<li>${e}</li>`).join('')}
        </ul>

        <h3>Skills</h3>
        <div>${skills.map(s => `<span class="cv2-chip">${s}</span>`).join('')}</div>

        <h3>Links</h3>
        <ul class="cv2-list">
          ${d.github ? `<li><a href="${d.github}" target="_blank" rel="noreferrer">GitHub</a></li>` : ''}
          <li><a href="#">LinkedIn</a></li>
        </ul>
      </aside>

      <header class="cv2-header">
        <h1 class="cv2-name">${fullName}</h1>
        <div class="cv2-title">${d.position || 'Your Position'}</div>
        <div class="cv2-meta">
          ${d.city ? `<span>${d.city}</span>` : ''}
          ${d.email ? `<a href="mailto:${d.email}">${d.email}</a>` : ''}
          ${d.phone ? `<a href="tel:${d.phone}">${d.phone}</a>` : ''}
        </div>
      </header>

      <main class="cv2-content">
        <section class="cv2-section">
          <h2>Profile</h2>
          <p>${d.about || 'Short summary goes here.'}</p>
        </section>

        <section class="cv2-section">
          <h2>Employment History</h2>
          <ul class="cv2-dots">
            ${exp.map(e => `<li>${e}</li>`).join('')}
          </ul>
        </section>
      </main>
    `;
  }

  function viewModern(d) {
    const fullName = `${d.firstName || 'Name'} ${d.lastName || 'Surname'}`.trim();
    const bullets = (arr, fallback) => (arr?.length ? arr : fallback).map(s=>`<li>${s}</li>`).join('');
    return `
      <header style="padding:10px 0 14px;border-bottom:2px solid #111;">
        <h1 style="font-size:28px;margin:0">${fullName}</h1>
        <div class="muted">${[d.position, d.city, d.email].filter(Boolean).join(' · ')}</div>
      </header>
      <section style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px;">
        <div>
          <h3>About</h3>
          <p class="muted">${d.about || 'Short summary goes here.'}</p>
          <h3>Skills</h3>
          <ul>${bullets(d.skills, ['JS','React','Node'])}</ul>
        </div>
        <div>
          <h3>Experience</h3>
          <ul>${bullets(d.experience, ['Company — Role — Years'])}</ul>
          <h3>Education</h3>
          <ul>${bullets(d.education, ['University — Program — Years'])}</ul>
        </div>
      </section>
    `;
  }

  function viewMinimal(d) {
    const fullName = `${d.firstName || 'Name'} ${d.lastName || 'Surname'}`.trim();
    const bullets = (arr, fb) => (arr?.length ? arr : fb).map(s=>`<li>${s}</li>`).join('');
    return `
      <div style="padding:24px">
        <h1 style="font-weight:600;font-size:24px;margin-bottom:4px">${fullName}</h1>
        <div class="muted" style="margin-bottom:12px">${[d.position, d.city, d.email].filter(Boolean).join(' · ')}</div>
        <h3>About</h3>
        <p class="muted">${d.about || 'Short summary goes here.'}</p>
        <h3>Skills</h3>
        <ul>${bullets(d.skills, ['Communication','Teamwork'])}</ul>
        <h3>Experience</h3>
        <ul>${bullets(d.experience, ['Company — Role — Years'])}</ul>
        <h3>Education</h3>
        <ul>${bullets(d.education, ['University — Program — Years'])}</ul>
      </div>
    `;
  }

  const FAMILY_RENDERER = {
    classic : viewClassic,
    sidebar : viewSidebar,
    modern  : viewModern,
    minimal : viewMinimal
  };

  // ===== 3) Нормализация ключа из data-template =====
  // 1→classic, 2→sidebar, остальные можно переназначить по желанию
  function parseTemplateKey(raw) {
    const NUM_TO_FAMILY = {
      '1': 'classic',
      '2': 'sidebar',
      '3': 'classic',
      '4': 'classic',
      '5': 'minimal',
      '6': 'modern',
      '7': 'classic',
      '8': 'modern'
    };

    if (!raw) return { family: 'classic', num: '1' };

    if (/^\d+$/.test(raw)) {
      const num = String(raw);
      return { family: NUM_TO_FAMILY[num] || 'classic', num };
    }

    const m = String(raw).match(/^(classic|sidebar|modern|minimal)\s*([0-9]+)?$/i);
    if (m) return { family: m[1].toLowerCase(), num: m[2] || '1' };

    return { family: 'classic', num: '1' };
  }

  // ===== 4) Рендер в правую колонку =====
  const { paper } = ensureHost();
  let current = { family: null, num: null };

  function render(rawKey) {
    const key = parseTemplateKey(rawKey);
    const renderFamily = FAMILY_RENDERER[key.family] || FAMILY_RENDERER.classic;
    const data = getData();
    const inner = renderFamily(data);

    // ВАЖНО: один wrapper .cv.cv-<num>, без вложенного .cv-2/.cv-1 внутри
    paper.innerHTML = `<div class="cv cv-${key.num}">${inner}</div>`;
    current = key;
  }

  // ===== 5) Слушатели =====
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.sample-item');
    if (!btn) return;
    render(btn.dataset.template || '1');
  });

  const form = document.querySelector('.main-form');
  if (form) {
    form.addEventListener('input', () => {
      if (current.family) render(`${current.family}${current.num}`);
    });
  }

  // Toolbar: печать
  document.querySelector('.preview-toolbar')?.addEventListener('click', (e) => {
    const act = e.target.closest('button')?.dataset.act;
    if (act === 'print') window.print();
  });

  // Рендер по умолчанию
  render('1');
})();
