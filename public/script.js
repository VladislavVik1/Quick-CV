// =================== ЯЗЫК: модальное окно выбора и сохранение ===================
let selectedLanguage = localStorage.getItem('language') || 'ru';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('languageModal');
  const langButtons = modal.querySelectorAll('button');

  if (!localStorage.getItem('language')) {
    modal.style.display = 'flex';
  } else {
    modal.style.display = 'none';
  }

  langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedLanguage = btn.dataset.lang;
    localStorage.setItem('language', selectedLanguage);
    modal.style.display = 'none';

    // 🔁 СРАЗУ МЕНЯЕМ ТЕКСТЫ НА СТРАНИЦЕ:
    if (typeof applyTranslations === 'function') {
      applyTranslations(); // если ты вынес это как отдельную функцию
    } else {
      location.reload(); // fallback если нет applyTranslations
    }
  });
});
  // =================== ВСЯ ОСТАЛЬНАЯ ЛОГИКА ПОСЛЕ ВЫБОРА ЯЗЫКА ===================

  const genDescBtn = document.getElementById('genDesc');
  const noExp = document.getElementById('noExperience');
  const experienceSection = document.getElementById('experienceSection');
  const courseExp = document.getElementById('courseExperience');
  const coursesSection = document.getElementById('coursesSection');

  function updateExperienceDisplay() {
    const noChecked = noExp.checked;
    const courseChecked = courseExp.checked;

    if (noChecked) courseExp.checked = false;
    if (courseChecked) noExp.checked = false;

    experienceSection.style.display = (!noChecked && !courseChecked) ? 'block' : 'none';
    coursesSection.style.display = courseChecked ? 'block' : 'none';
  }

  if (noExp && courseExp && experienceSection && coursesSection) {
    noExp.addEventListener('change', updateExperienceDisplay);
    courseExp.addEventListener('change', updateExperienceDisplay);
    updateExperienceDisplay();
  }

  const skillInput = document.getElementById('skillInput');
  const suggestionsList = document.getElementById('suggestions');
  const selectedSkillsContainer = document.getElementById('selectedSkills');
  const form = document.getElementById('cvForm');

  const allSkills = [
    // Frontend
    'HTML', 'HTML5',
    'CSS', 'CSS3', 'SASS', 'SCSS', 'LESS',
    'JavaScript', 'TypeScript',
    'React', 'Redux', 'Redux Toolkit', 'React Router', 'Next.js',
    'Vue.js', 'Nuxt.js',
    'Angular',
    'Bootstrap', 'Tailwind CSS', 'Material UI',
    'Styled Components',
    'Jest', 'React Testing Library',
    'Vite', 'Webpack', 'Parcel', 'Gulp',
    'Babel', 'ESLint', 'Prettier',
  
    // Backend
    'Node.js', 'Express', 'NestJS',
    'MongoDB', 'Mongoose',
    'PostgreSQL', 'MySQL', 'Sequelize',
    'Prisma',
    'REST API', 'GraphQL', 'Apollo Server',
    'Socket.IO',
    'JWT', 'OAuth2.0', 'Passport.js',
    'Zod', 'Yup', 'Joi',
  
    // DevOps / Tools
    'Git', 'GitHub', 'GitLab', 'Bitbucket',
    'Docker', 'Docker Compose',
    'CI/CD', 'GitHub Actions',
    'Nginx',
    'Linux', 'Bash',
    'Vercel', 'Netlify', 'Render', 'Heroku',
  
    // UI/UX
    'Figma', 'Adobe XD', 'Photoshop',
    'Responsive Design', 'Pixel Perfect',
    'Accessibility (a11y)', 'BEM',
  
    // Testing
    'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright',
  
    // Other
    'Agile', 'Scrum', 'Kanban',
    'English B2', 'English C1', 'Teamwork', 'Problem Solving',
    'ChatGPT', 'Prompt Engineering',
    'Trello', 'Jira', 'Notion',
  
    // Optional extras
    'Three.js', 'Canvas API', 'WebGL',
    'Service Workers', 'PWA',
    'WebSockets', 'SSR', 'CSR', 'ISR',
  
    // Профессиональные навыки
    'Adaptability', 'Communication', 'Time Management',
     
    // Менеджеры
  'Project Management', 'Team Leadership', 'Strategic Planning',
  'Budgeting', 'Risk Management', 'Recruitment', 'Mentoring',
  'Conflict Resolution', 'Business Development',

  // Риелтор
  'Real Estate Sales', 'Property Valuation', 'Client Negotiation',
  'CRM Systems', 'Contract Review', 'Market Analysis',
  'Mortgage Consulting', 'Showing Properties',

  //Финансы
  '1C:Accounting', 'Tax Reporting', 'Financial Planning',
  'Management Accounting', 'Audit', 'Banking Operations',
  'Cash Handling', 'Cost Optimization',

  // Маркетинг
  'SEO', 'SMM', 'Email Marketing', 'Content Marketing',
  'Google Ads', 'Meta Ads', 'Presentation Skills',
  'Cold Calling', 'Sales Funnel Analysis', 'AmoCRM', 'Bitrix24',

  // Логистика
  'Supply Chain Management', 'Inventory Control', 'Route Optimization',
  'Customs Documentation', 'WMS Systems', 'International Logistics',

  // Медицина
  'Patient Care', 'Medical Documentation', 'First Aid',
  'Diagnosis', 'Medical Examinations', 'MIS (Medical Info Systems)',

  // Учителя
  'Teaching', 'Curriculum Development', 'Online Teaching',
  'Knowledge Assessment', 'LMS Systems', 'Mentoring Students',

  // Офисные навыки
  'MS Word', 'MS Excel', 'Google Docs', 'Office Administration',
  'Scheduling', 'Document Management', 'Business Correspondence'

  ];
  let selectedSkills = [];

  skillInput.addEventListener('input', () => {
    const input = skillInput.value.toLowerCase();
    suggestionsList.innerHTML = '';
    if (!input) return suggestionsList.classList.add('hidden');

    const filtered = allSkills.filter(skill =>
      skill.toLowerCase().includes(input) && !selectedSkills.includes(skill)
    );

    if (filtered.length === 0) return suggestionsList.classList.add('hidden');

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

  function updateSelectedSkills() {
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

  if (noExp && experienceSection) {
  noExp.addEventListener('change', () => {
    experienceSection.style.display = noExp.checked ? 'none' : 'block';
  });
}

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
          language: selectedLanguage // ✅ передаем язык на сервер
        })
      });

      const result = await response.json();
      document.getElementById('about').value = result.description || 'Ошибка генерации описания.';
    } catch (error) {
      console.error('❌ Ошибка генерации:', error);
      document.getElementById('about').value = 'Ошибка генерации описания.';
    }
  });

  document.getElementById('photo')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      document.getElementById('preview').src = URL.createObjectURL(file);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errors = [];

    const name = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    const age = document.getElementById('age')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const github = document.getElementById('github')?.value.trim();
    const city = document.getElementById('city')?.value.trim();
    const languages = document.getElementById('languages')?.value.trim();
    const education = document.getElementById('education')?.value.trim();
    const hobbies = document.getElementById('hobbies')?.value.trim();
    const about = document.getElementById('about')?.value.trim();
    const position = document.getElementById('position')?.value.trim();
    const years = document.getElementById('years')?.value.trim();
    const noExperience = document.getElementById('noExperience')?.checked;
    const courseExperience = document.getElementById('courseExperience')?.checked;
    const courses = document.getElementById('courses')?.value.trim();

    const photoFile = document.getElementById('photo')?.files[0];
    const photoURL = photoFile ? URL.createObjectURL(photoFile) : '';

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
      noExperience ||
      courseExperience;

    if (!hasExperience) errors.push('Опыт работы (или отметьте соответствующую галочку)');
    if (courseExperience && !courses) errors.push('Укажите, какие курсы вы прошли');

    if (!education) errors.push('Образование');
    if (!hobbies) errors.push('Хобби');
    if (!about) errors.push('О себе');
    if (!photoFile) errors.push('Фото');

    if (errors.length > 0) {
      alert(`❌ Пожалуйста, заполните следующие поля:\n- ${errors.join('\n- ')}`);
      return;
    }

    const html = `
      <div class="cv-preview">
        <div class="cv-header">
          <div>
            <h2>${name} ${lastName}</h2>
            <p><strong>Возраст:</strong> ${age}</p>
            <p><strong>Телефон:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          ${photoURL ? `<img src="${photoURL}" alt="Фото" class="cv-photo"/>` : ''}
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
    document.getElementById('output').innerHTML = html;

    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          lastName,
          age,
          phone,
          email,
          github,
          city,
          languages,
          education,
          hobbies,
          about,
          skills: selectedSkills,
          photo: photoURL,
          noExperience,
          courseExperience,
          courses,
          position,
          years
        })
      });

      const data = await res.json();
      if (res.ok) {
        console.log('✅ Резюме успешно отправлено:', data);
      } else {
        alert(data?.error || '❌ Ошибка при сохранении');
      }
    } catch (err) {
      console.error('❌ Ошибка при отправке:', err);
      alert('Ошибка соединения с сервером');
    }
  });
});