const genDescBtn = document.getElementById('genDesc');
const noExp = document.getElementById('noExperience');
const experienceSection = document.getElementById('experienceSection');

noExp.addEventListener('change', () => {
  experienceSection.style.display = noExp.checked ? 'none' : 'block';
});

genDescBtn.addEventListener('click', async () => {
  const name = document.getElementById('firstName').value.trim() || 'Кандидат';
  const skillsRaw = document.getElementById('skills').value;
  const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

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
