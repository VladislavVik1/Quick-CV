document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('downloadLivePDF');
  if (btn) btn.addEventListener('click', downloadPDF);
});

async function downloadPDF() {
  const previewElement = document.querySelector('.cv-live-preview');
  const toolbar = document.querySelector('.editor-toolbar');
  const downloadButton = document.getElementById('downloadLivePDF');

  if (!previewElement) {
    alert('⚠️ Блок .cv-live-preview не найден');
    return;
  }

  // 1. Собираем данные из формы
  const data = {
    name: document.getElementById('firstName')?.value.trim(),
    lastName: document.getElementById('lastName')?.value.trim(),
    age: document.getElementById('age')?.value.trim(),
    phone: document.getElementById('phone')?.value.trim(),
    email: document.getElementById('email')?.value.trim(),
    github: document.getElementById('github')?.value.trim(),
    linkedin: document.getElementById('linkedin')?.value.trim(),
    telegram: document.getElementById('telegram')?.value.trim(),
    city: document.getElementById('city')?.value.trim(),
    portfolio: document.getElementById('portfolio')?.value.trim(),
    languages: document.getElementById('languages')?.value.trim(),
    specialty: document.getElementById('specialty')?.value.trim(),
    skills: Array.from(document.querySelectorAll('#selectedSkills .skill-tag')).map(tag => tag.firstChild.textContent.trim()),
    position: document.getElementById('position')?.value.trim(),
    years: document.getElementById('years')?.value.trim(),
    noExperience: document.getElementById('noExperience')?.checked,
    courseExperience: document.getElementById('courseExperience')?.checked,
    courses: document.getElementById('courses')?.value.trim(),
    education: document.getElementById('education')?.value.trim(),
    hobbies: document.getElementById('hobbies')?.value.trim(),
    about: document.getElementById('about')?.value.trim(),
    photo: document.getElementById('preview')?.src || '',
  };

  // 2. Отправляем данные на сервер
  try {
    const res = await fetch('/api/cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      alert(result?.error || '❌ Ошибка при сохранении в базу');
      return;
    }
    console.log('✅ Резюме отправлено на сервер:', result);
  } catch (err) {
    console.error('❌ Ошибка при отправке:', err);
    alert('Ошибка соединения с сервером');
    return;
  }

  // 3. Генерация PDF
  if (toolbar) toolbar.style.display = 'none';
  if (downloadButton) downloadButton.style.display = 'none';

  previewElement.style.width = '210mm';
  previewElement.style.minHeight = '297mm';
  previewElement.style.height = 'auto';

  const canvas = await html2canvas(previewElement, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  if (toolbar) toolbar.style.display = 'flex';
  if (downloadButton) downloadButton.style.display = 'inline-block';

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 210; // A4
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new window.jspdf.jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let heightLeft = imgHeight;
  let position = 0;

  while (heightLeft > 0) {
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    if (heightLeft > 0) {
      pdf.addPage();
      position -= pageHeight;
    }
  }

  pdf.save('resume.pdf');
}
