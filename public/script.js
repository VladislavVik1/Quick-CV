const genDescBtn = document.getElementById('genDesc');
const noExp = document.getElementById('noExperience');
const experienceSection = document.getElementById('experienceSection');

// Автозаполнение навыков
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

  // Soft skills 
  'Adaptability', 'Communication', 'Time Management'
];
const skillInput = document.getElementById('skillInput');
const suggestionsList = document.getElementById('suggestions');
const selectedSkillsContainer = document.getElementById('selectedSkills');
const hiddenSkills = document.getElementById('skills'); // textarea (скрытая)

let selectedSkills = [];

skillInput.addEventListener('input', () => {
  const input = skillInput.value.toLowerCase();
  suggestionsList.innerHTML = '';
  if (!input) return suggestionsList.classList.add('hidden');

  const filtered = allSkills.filter(skill =>
    skill.toLowerCase().includes(input) && !selectedSkills.includes(skill)
  );

  if (filtered.length === 0) {
    suggestionsList.classList.add('hidden');
    return;
  }

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

  hiddenSkills.value = selectedSkills.join(', ');
}

// Скрытие опыта при выборе галки
noExp.addEventListener('change', () => {
  experienceSection.style.display = noExp.checked ? 'none' : 'block';
});

// Генерация описания
genDescBtn.addEventListener('click', async () => {
  const name = document.getElementById('firstName').value.trim() || 'Кандидат';
  const skills = selectedSkills;

  try {
    const response = await fetch('/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, skills })
    });

    const result = await response.json();
    document.getElementById('about').value = result.description || 'Ошибка генерации описания.';
  } catch (error) {
    console.error(error);
    document.getElementById('about').value = 'Ошибка генерации описания.';
  }
});

// Превью фото
document.getElementById('photo').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    document.getElementById('preview').src = URL.createObjectURL(file);
  }
});

// Отправка формы
document.getElementById('cvForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const age = document.getElementById('age').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const about = document.getElementById('about').value.trim();
  const noExp = document.getElementById('noExperience').checked;
  const position = document.getElementById('position').value.trim();
  const years = document.getElementById('years').value.trim();
  const skills = selectedSkills.join(', ');

  const photoFile = document.getElementById('photo').files[0];
  const photoURL = photoFile ? URL.createObjectURL(photoFile) : '';

  let expText = '';
  if (!noExp && position && years) {
    expText = `<p><strong>Опыт:</strong> ${position}, ${years}</p>`;
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
      <p><strong>Навыки:</strong> ${skills}</p>
      ${expText}
      <p><strong>О себе:</strong> ${about}</p>
    </div>
  `;

  document.getElementById('output').innerHTML = html;
});
