// =========================
// QuickCV – unified script
// (tabs + preview + accent + extras)
// =========================

// ---- Global state for preview ----
const state = {
  accent: '#1A3C74',
  template: 1,
  data: {
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: '',
    role: '',
    skills: '',
    experience: '',
    education: ''
  }
};

// ---- Helpers ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ---- Preview data helpers ----
function getData() {
  state.data.firstName  = $('#firstName')?.value.trim()  || '';
  state.data.lastName   = $('#lastName')?.value.trim()   || '';
  state.data.address    = $('#address')?.value.trim()    || '';
  state.data.email      = $('#email')?.value.trim()      || '';
  state.data.phone      = $('#phone')?.value.trim()      || '';
  state.data.role       = $('#role')?.value.trim()       || '';
  state.data.skills     = $('#skills')?.value.trim()     || '';
  state.data.experience = $('#experience')?.value.trim() || '';
  state.data.education  = $('#education')?.value.trim()  || '';
  return state.data;
}

function calcPercent(d) {
  const fields = [
    d.firstName, d.lastName, d.email, d.phone,
    d.address, d.role, d.skills, d.experience, d.education
  ];
  const filled = fields.filter(v => v && v.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

function setAccent(color) {
  if (!color) return;
  state.accent = color;
  document.documentElement.style.setProperty('--accent', color);
  $$('.color-btn').forEach(b => b.classList.toggle('is-active', b.dataset.color === color));
}

function renderSkillsUL(listEl, chips = false) {
  if (!listEl) return;
  const skills = (state.data.skills || 'React, TypeScript, UX')
    .split(/\s*,\s*/).filter(Boolean);
  listEl.innerHTML = '';
  if (chips) {
    skills.forEach(s => {
      const span = document.createElement('span');
      span.className = 'cv2-chip';
      span.textContent = s;
      listEl.appendChild(span);
    });
  } else {
    skills.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      listEl.appendChild(li);
    });
  }
}

function updatePreview() {
  const d = getData();

  // CV1
  if ($('#cv1-name')) $('#cv1-name').textContent = `${d.firstName || 'First'} ${d.lastName || 'Last'}`;
  if ($('#cv1-role')) $('#cv1-role').textContent = d.role || 'Your role';
  if ($('#cv1-email')) $('#cv1-email').textContent = d.email || 'email@example.com';
  if ($('#cv1-phone')) $('#cv1-phone').textContent = d.phone || '+1 000 000 0000';
  if ($('#cv1-address')) $('#cv1-address').textContent = d.address || 'Address';
  if ($('#cv1-exp')) $('#cv1-exp').textContent = d.experience || 'Company • Role • 2022–Now';
  if ($('#cv1-edu')) $('#cv1-edu').textContent = d.education || 'University • Degree';
  if ($('#cv1-skills')) renderSkillsUL($('#cv1-skills'));
  if ($('#cv1-summary')) {
    $('#cv1-summary').innerHTML =
      `<li>Experienced professional with strengths in ${d.skills || 'skills'}.</li>`;
  }

  // CV2
  if ($('#cv2-name')) $('#cv2-name').textContent = `${d.firstName || 'First'} ${d.lastName || 'Last'}`;
  if ($('#cv2-role')) $('#cv2-role').textContent = d.role || 'Your role';
  if ($('#cv2-email')) $('#cv2-email').textContent = d.email || 'email@example.com';
  if ($('#cv2-phone')) $('#cv2-phone').textContent = d.phone || '+1 000 000 0000';
  if ($('#cv2-address')) $('#cv2-address').textContent = d.address || 'Address';
  if ($('#cv2-exp')) $('#cv2-exp').textContent = d.experience || 'Company • Role • 2022–Now';
  if ($('#cv2-edu')) $('#cv2-edu').textContent = d.education || 'University • Degree';
  if ($('#cv2-skills')) renderSkillsUL($('#cv2-skills'), true);

  // Progress
  const pct = calcPercent(d);
  if ($('#percentText')) $('#percentText').textContent = pct + '%';
  if ($('#percentBar')) $('#percentBar').style.width = Math.max(1, pct) + '%';
}

function setTemplate(n) {
  state.template = n;
  if ($('#cv1')) $('#cv1').style.display = n === 1 ? 'block' : 'none';
  if ($('#cv2')) $('#cv2').style.display = n === 2 ? 'grid' : 'none';
}

// ---- Tabs: data-target version (совместимо с твоим HTML .tab-btn) ----
function initDataTargetTabs() {
  $$('.tab-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSel = btn.getAttribute('data-target');
      const panel = targetSel ? document.querySelector(targetSel) : null;
      if (!panel) return;

      const isOpen = btn.classList.contains('open');
      if (isOpen) {
        panel.style.maxHeight = '0px';
      } else {
        // авто-высота
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
      btn.classList.toggle('open', !isOpen);
    });
  });
}

// ---- Global clicks (palette + template) ----
function initGlobalClicks() {
  document.addEventListener('click', (e) => {
    const colorBtn = e.target.closest('.color-btn');
    if (colorBtn && colorBtn.dataset.color) {
      setAccent(colorBtn.dataset.color);
    }
    const card = e.target.closest('.sample-item');
    if (card) {
      setTemplate(Number(card.dataset.template) || 1);
    }
  });
}

// ---- Bind preview update to inputs ----
function bindPreviewInputs() {
  [
    '#firstName','#lastName','#address','#email',
    '#phone','#role','#skills','#experience','#education'
  ].forEach(sel => {
    const el = $(sel);
    if (el) el.addEventListener('input', updatePreview);
  });
}

// =================== Extras (бывший «Секонд-скрипт») ===================
(function extras() {
  let selectedLanguage = localStorage.getItem('language') || 'ru';
  let base64Photo = '';
  let selectedSkills = [];

  document.addEventListener('DOMContentLoaded', () => {
    // ---- Language modal (optional) ----
    const modal = document.getElementById('languageModal');
    if (modal) {
      const langButtons = modal.querySelectorAll('button');
      if (!localStorage.getItem('language')) {
        modal.style.display = 'flex';
      } else {
        modal.style.display = 'none';
      }
      langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          selectedLanguage = btn.dataset.lang || 'ru';
          localStorage.setItem('language', selectedLanguage);
          modal.style.display = 'none';
          if (typeof window.applyTranslations === 'function') {
            window.applyTranslations();
          } else {
            location.reload();
          }
        });
      });
    }

    // ---- Experience toggles (optional) ----
    const noExp = document.getElementById('noExperience');
    const courseExp = document.getElementById('courseExperience');
    const experienceSection = document.getElementById('experienceSection');
    const coursesSection = document.getElementById('coursesSection');

    function updateExperienceDisplay() {
      const noChecked = !!noExp?.checked;
      const courseChecked = !!courseExp?.checked;
      if (noExp && courseExp) {
        if (noChecked) courseExp.checked = false;
        if (courseChecked) noExp.checked = false;
      }
      if (experienceSection) experienceSection.style.display = (!noChecked && !courseChecked) ? 'block' : 'none';
      if (coursesSection) coursesSection.style.display = courseChecked ? 'block' : 'none';
    }
    if (noExp && courseExp) {
      noExp.addEventListener('change', updateExperienceDisplay);
      courseExp.addEventListener('change', updateExperienceDisplay);
      updateExperienceDisplay();
    }

    // ---- Skills autocomplete (optional) ----
    const skillInput = document.getElementById('skillInput');
    const suggestionsList = document.getElementById('suggestions');
    const selectedSkillsContainer = document.getElementById('selectedSkills');

    const allSkills = [
      'HTML','HTML5','CSS','CSS3','SASS','SCSS','LESS',
      'JavaScript','TypeScript','React','Redux','Redux Toolkit','React Router','Next.js',
      'Vue.js','Nuxt.js','Angular','Bootstrap','Tailwind CSS','Material UI','Styled Components',
      'Jest','React Testing Library','Vite','Webpack','Parcel','Gulp','Babel','ESLint','Prettier',
      'Node.js','Express','NestJS','MongoDB','Mongoose','PostgreSQL','MySQL','Sequelize','Prisma',
      'REST API','GraphQL','Apollo Server','Socket.IO','JWT','OAuth2.0','Passport.js','Zod','Yup','Joi',
      'Git','GitHub','GitLab','Bitbucket','Docker','Docker Compose','CI/CD','GitHub Actions','Nginx',
      'Linux','Bash','Vercel','Netlify','Render','Heroku',
      'Figma','Adobe XD','Photoshop','Responsive Design','Pixel Perfect','Accessibility (a11y)','BEM',
      'Mocha','Chai','Cypress','Playwright',
      'Agile','Scrum','Kanban','English B2','English C1','Teamwork','Problem Solving',
      'ChatGPT','Prompt Engineering','Trello','Jira','Notion',
      'Three.js','Canvas API','WebGL','Service Workers','PWA','WebSockets','SSR','CSR','ISR',
      'Adaptability','Communication','Time Management',
      'Project Management','Team Leadership','Strategic Planning','Budgeting','Risk Management','Recruitment','Mentoring',
      'Conflict Resolution','Business Development',
      'Real Estate Sales','Property Valuation','Client Negotiation','CRM Systems','Contract Review','Market Analysis',
      'Mortgage Consulting','Showing Properties',
      '1C:Accounting','Tax Reporting','Financial Planning','Management Accounting','Audit','Banking Operations',
      'Cash Handling','Cost Optimization',
      'SEO','SMM','Email Marketing','Content Marketing','Google Ads','Meta Ads','Presentation Skills',
      'Cold Calling','Sales Funnel Analysis','AmoCRM','Bitrix24',
      'Supply Chain Management','Inventory Control','Route Optimization','Customs Documentation','WMS Systems','International Logistics',
      'Patient Care','Medical Documentation','First Aid','Diagnosis','Medical Examinations','MIS (Medical Info Systems)',
      'Teaching','Curriculum Development','Online Teaching','Knowledge Assessment','LMS Systems','Mentoring Students',
      'MS Word','MS Excel','Google Docs','Office Administration','Scheduling','Document Management','Business Correspondence'
    ];

    function updateSelectedSkills() {
      if (!selectedSkillsContainer) return;
      selectedSkillsContainer.innerHTML = '';
      selectedSkills.forEach(skill => {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', () => {
          selectedSkills = selectedSkills.filter(s => s !== skill);
          updateSelectedSkills();
        });
        tag.appendChild(removeBtn);
        selectedSkillsContainer.appendChild(tag);
      });
    }

    if (skillInput && suggestionsList) {
      skillInput.addEventListener('input', () => {
        const input = skillInput.value.toLowerCase();
        suggestionsList.innerHTML = '';
        if (!input) return suggestionsList.classList.add('hidden');
        const filtered = allSkills.filter(
          s => s.toLowerCase().includes(input) && !selectedSkills.includes(s)
        );
        if (!filtered.length) return suggestionsList.classList.add('hidden');
        filtered.forEach(skill => {
          const li = document.createElement('li');
          li.textContent = skill;
          li.addEventListener('click', () => {
            selectedSkills.push(skill);
            updateSelectedSkills();
            skillInput.value = '';
            suggestionsList.classList.add('hidden');
          });
          suggestionsList.appendChild(li);
        });
        suggestionsList.classList.remove('hidden');
      });
    }

    // ---- Generate description (optional) ----
    const genDescBtn = document.getElementById('genDesc');
    if (genDescBtn) {
      genDescBtn.addEventListener('click', async () => {
        const name = document.getElementById('firstName')?.value.trim() || 'Кандидат';
        const specialty = document.getElementById('specialty')?.value.trim() || 'специалист';
        const hobbies = document.getElementById('hobbies')?.value.trim() || '';

        try {
          const response = await fetch('/generate-description', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              skills: selectedSkills,
              specialty,
              hobbies,
              language: selectedLanguage
            })
          });
          const result = await response.json();
          const about = document.getElementById('about');
          if (about) about.value = result.description || 'Ошибка генерации описания.';
        } catch (err) {
          console.error('❌ Ошибка генерации:', err);
          const about = document.getElementById('about');
          if (about) about.value = 'Ошибка генерации описания.';
        }
      });
    }

    // ---- Download triggers (optional) ----
    const form = document.getElementById('cvForm');
    const downloadBtn = document.getElementById('downloadLivePDF');
    if (form && downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      });
    }

    // ---- Photo upload (optional) ----
    const photoInput = document.getElementById('photo');
    if (photoInput) {
      photoInput.addEventListener('change', function () {
        const file = this.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          base64Photo = e.target?.result || '';
          const prev = document.getElementById('preview');
          const live = document.getElementById('livePhoto');
          if (prev) prev.src = base64Photo;
          if (live) live.src = base64Photo;
        };
        reader.readAsDataURL(file);
      });
    }

    // ---- Submit CV (optional) ----
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Простейшая валидация с защитой от отсутствующих полей
        const val = id => document.getElementById(id)?.value.trim() || '';
        const bool = id => !!document.getElementById(id)?.checked;

        const name = val('firstName');
        const lastName = val('lastName');
        const age = val('age');
        const phone = val('phone');
        const email = val('email');
        const github = val('github');
        const city = val('city');
        const languages = val('languages');
        const education = val('education');
        const hobbies = val('hobbies');
        const about = val('about');
        const position = val('position');
        const years = val('years');
        const noExperience = bool('noExperience');
        const courseExperience = bool('courseExperience');
        const courses = val('courses');

        const errors = [];
        if (!name) errors.push('Имя');
        if (!lastName) errors.push('Фамилия');
        if (!age) errors.push('Возраст');
        if (!phone) errors.push('Телефон');
        if (!email) errors.push('Email');
        if (!github) errors.push('GitHub');
        if (!city) errors.push('Город');
        if (!languages) errors.push('Языки');
        if (selectedSkills.length < 1) errors.push('Навыки');

        const hasExperience =
          (!noExperience && !courseExperience && position && years) ||
          noExperience || courseExperience;

        if (!hasExperience) errors.push('Опыт работы (или отметьте соответствующую галочку)');
        if (courseExperience && !courses) errors.push('Укажите, какие курсы вы прошли');
        if (!education) errors.push('Образование');
        if (!hobbies) errors.push('Хобби');
        if (!about) errors.push('О себе');

        if (errors.length) {
          alert(`❌ Пожалуйста, заполните:\n- ${errors.join('\n- ')}`);
          return;
        }

        const output = document.getElementById('output');
        if (output) {
          const html = `
            <div class="cv-preview">
              <div class="cv-header">
                <div>
                  <h2>${name} ${lastName}</h2>
                  <p><strong>Возраст:</strong> ${age}</p>
                  <p><strong>Телефон:</strong> ${phone}</p>
                  <p><strong>Email:</strong> ${email}</p>
                </div>
                ${base64Photo ? `<img src="${base64Photo}" alt="Фото" class="cv-photo"/>` : ''}
              </div>
              <p><strong>Город:</strong> ${city}</p>
              <p><strong>Языки:</strong> ${languages}</p>
              <p><strong>Навыки:</strong> ${selectedSkills.join(', ')}</p>
              ${
                noExperience
                  ? '<p><strong>Опыт:</strong> Нет опыта</p>'
                  : courseExperience
                    ? `<p><strong>Опыт:</strong> Нет опыта, но проходил(а) курсы: ${courses}</p>`
                    : `<p><strong>Опыт:</strong> ${position}, ${years}</p>`
              }
              <p><strong>Образование:</strong> ${education}</p>
              <p><strong>Хобби:</strong> ${hobbies}</p>
              <p><strong>О себе:</strong> ${about}</p>
            </div>
          `;
          output.innerHTML = html;
          if (typeof window.translateCVPreview === 'function') window.translateCVPreview();
        }

        try {
          const res = await fetch('/api/cv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name, lastName, age, phone, email, github, city, languages,
              education, hobbies, about, skills: selectedSkills,
              photo: base64Photo || document.getElementById('preview')?.src || '',
              noExperience, courseExperience, courses, position, years
            })
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            alert(data?.error || '❌ Ошибка при сохранении');
          } else {
            console.log('✅ Резюме успешно отправлено:', data);
          }
        } catch (err) {
          console.error('❌ Ошибка при отправке:', err);
          alert('Ошибка соединения с сервером');
        }
      });
    }

    // ---- Translate preview (optional) ----
    window.translateCVPreview = function translateCVPreview() {
      const lang = localStorage.getItem('language') || 'ru';
      const translations = (window.translations && window.translations[lang]) || null;
      const output = document.getElementById('output');
      if (!translations || !output || !output.innerHTML.trim()) return;

      const t = translations;
      const replacements = {
        'Возраст': t.age,
        'Телефон': t.phone,
        'Email': t.email,
        'Город': t.city,
        'Портфолио': t.portfolio,
        'Языки': t.languages,
        'Навыки': t.skillInput,
        'Профессия': t.specialty,
        'Опыт': 'Опыт',
        'Образование': t.education,
        'Хобби': t.hobbies,
        'О себе': t.about,
        'Нет опыта': t.noExperience,
        'Нет опыта, но проходил(а) курсы': t.courseExperience
      };

      let html = output.innerHTML;
      Object.entries(replacements).forEach(([ruText, translated]) => {
        const regex = new RegExp(`(<strong>)${ruText}(?=:)`, 'g');
        html = html.replace(regex, `$1${translated}`);
      });

      html = html.replace(
        /<strong>.*?Опыт:.*?<\/strong>\s*Нет опыта/g,
        `<strong>${t.position}:</strong> ${t.noExperience}`
      );
      html = html.replace(
        /<strong>.*?Опыт:.*?<\/strong>\s*Нет опыта, но проходил\(а\) курсы:/g,
        `<strong>${t.position}:</strong> ${t.courseExperience}:`
      );
      output.innerHTML = html;
    };
  });
})();

// =================== Bootstrap ===================
document.addEventListener('DOMContentLoaded', () => {
  initDataTargetTabs();
  initGlobalClicks();
  bindPreviewInputs();

  // Save button (demo)
  const saveBtn = document.querySelector('.save-cv-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      alert('Saved (demo)');
    });
  }

  setAccent(state.accent);
  setTemplate(1);
  updatePreview();
});
