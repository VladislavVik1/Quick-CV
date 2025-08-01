document.addEventListener('DOMContentLoaded', () => {
    // 👤 Имя + фамилия
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const liveName = document.getElementById('liveName');
  
    const updateFullName = () => {
      if (liveName) {
        liveName.textContent = `${firstName?.value || ''} ${lastName?.value || ''}`.trim();
      }
    };
  
    firstName?.addEventListener('input', updateFullName);
    lastName?.addEventListener('input', updateFullName);
    updateFullName();
  
    // 📄 Общая функция обновления
    const liveMap = {
      age: 'liveAge',
      phone: 'livePhone',
      email: 'liveEmail',
      github: 'liveGithub',
      linkedin: 'liveLinkedin',
      telegram: 'liveTelegram',
      city: 'liveCity',
      portfolio: 'livePortfolio',
      languages: 'liveLanguages',
      specialty: 'liveSpecialty',
      education: 'liveEducation',
      hobbies: 'liveHobbies',
      about: 'liveAbout',
      courses: 'liveCourses',
    };
  
    for (const [inputId, targetId] of Object.entries(liveMap)) {
      const input = document.getElementById(inputId);
      const target = document.getElementById(targetId);
      if (input && target) {
        input.addEventListener('input', () => {
          target.textContent = input.value || '—';
        });
        target.textContent = input?.value || '—';
      }
    }
  
    // 🧠 Навыки (список)
    const skillInput = document.getElementById('skillInput');
    const liveSkills = document.getElementById('liveSkills');
    if (skillInput && liveSkills) {
      const updateSkills = () => {
        const selectedTags = document.querySelectorAll('#selectedSkills .skill-tag');
        const skills = Array.from(selectedTags).map(tag => tag.childNodes[0].textContent.trim());
        liveSkills.textContent = skills.join(', ') || '—';
      };
      skillInput.addEventListener('input', updateSkills);
      document.getElementById('selectedSkills')?.addEventListener('click', updateSkills);
      updateSkills();
    }
  
    // 🖼 Фото
    const photo = document.getElementById('photo');
    const livePhoto = document.getElementById('livePhoto');
    photo?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file && livePhoto) {
        livePhoto.src = URL.createObjectURL(file);
      }
    });
  
    // 🧠 Опыт (динамическая логика)
    const expFields = ['noExperience', 'courseExperience', 'position', 'years', 'courses'];
    const liveExperience = document.getElementById('liveExperience');
  
    const updateExperience = () => {
      const noExp = document.getElementById('noExperience')?.checked;
      const courseExp = document.getElementById('courseExperience')?.checked;
      const position = document.getElementById('position')?.value;
      const years = document.getElementById('years')?.value;
      const courses = document.getElementById('courses')?.value;
      let text = '—';
  
      if (noExp) {
        text = 'Нет опыта';
      } else if (courseExp) {
        text = courses ? `Нет опыта, но проходил(а) курсы: ${courses}` : 'Нет опыта, но проходил(а) курсы';
      } else if (position && years) {
        text = `${position}, ${years}`;
      }
  
      if (liveExperience) liveExperience.textContent = text;
    };
  
    expFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', updateExperience);
      }
    });
    updateExperience();
  
    // 🎨 Стилизация текста
    document.getElementById('fontSelect')?.addEventListener('change', e => {
      document.execCommand('fontName', false, e.target.value);
    });
  
    document.getElementById('colorPicker')?.addEventListener('input', e => {
      document.execCommand('foreColor', false, e.target.value);
    });
  });
  