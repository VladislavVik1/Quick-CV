
const noExp = document.getElementById('noExperience');
const experienceSection = document.getElementById('experienceSection');
const genDescBtn = document.getElementById('genDesc');
const preview = document.getElementById('preview');
const photoInput = document.getElementById('photo');
const form = document.getElementById('cvForm');
const output = document.getElementById('output');

noExp.addEventListener('change', () => {
  experienceSection.hidden = noExp.checked;
});

photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

genDescBtn.addEventListener('click', async () => {
  const name = document.getElementById('firstName').value.trim() || 'Кандидат';
  const skillsRaw = document.getElementById('skills').value;
  const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

  try {
    const response = await fetch('http://localhost:3000/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, skills })
    });

    const result = await response.json();
    const description = result.description || 'Ошибка при генерации описания.';
    document.getElementById('about').value = description;

  } catch (error) {
    document.getElementById('about').value = 'Ошибка при генерации описания.';
    console.error(error);
  }
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    age: document.getElementById('age').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    skills: document.getElementById('skills').value,
    about: document.getElementById('about').value,
    photo: preview.src || null,
    position: noExp.checked ? 'Нет опыта' : document.getElementById('position').value,
    years: noExp.checked ? '' : document.getElementById('years').value
  };

  const outputHTML = `
<h2>Резюме ${data.firstName} ${data.lastName}</h2>
<p><strong>Возраст:</strong> ${data.age}</p>
<p><strong>Телефон:</strong> ${data.phone}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Навыки:</strong> ${data.skills}</p>
<p><strong>Опыт:</strong> ${data.position} ${data.years}</p>
<p><strong>О себе:</strong><br>${data.about}</p>
${data.photo ? `<img src="${data.photo}" style="width:200px;height:auto;border-radius:10px">` : ''}
  `;
  output.innerHTML = outputHTML;
});
