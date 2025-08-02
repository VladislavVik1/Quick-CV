const translations = {
    ru: {
      firstName: "Имя",
      lastName: "Фамилия",
      age: "Возраст",
      phone: "Телефон",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
      telegram: "Telegram",
      city: "Город",
      portfolio: "Портфолио",
      languages: "Языки",
      specialty: "Профессия",
      skillInput: "Навыки...",
      position: "Место работы",
      years: "Годы (например: 2020–2023)",
      courses: "Курсы (например: GoIT Fullstack)",
      education: "Образование",
      hobbies: "Хобби",
      genDesc: "Сгенерировать описание",
      about: "О себе",
      downloadPDF: "СОХРАНИТЬ В PDF",
      noExperience: "Нет опыта",
      courseExperience: "Нет, но проходил(ла) курсы",
    },
    uk: {
      firstName: "Ім’я",
      lastName: "Прізвище",
      age: "Вік",
      phone: "Телефон",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
      telegram: "Telegram",
      city: "Місто",
      portfolio: "Портфоліо",
      languages: "Мови",
      specialty: "Професія",
      skillInput: "Навички...",
      position: "Місце роботи",
      years: "Роки (наприклад: 2020–2023)",
      courses: "Курси (наприклад: GoIT Fullstack)",
      education: "Освіта",
      hobbies: "Хобі",
      genDesc: "Згенерувати опис",
      about: "Про себе",
      downloadPDF: "ЗБЕРЕГТИ У PDF",
      noExperience: "Немає досвіду",
      courseExperience: "Немає, але проходив(ла) курси",
    },
    en: {
      firstName: "First Name",
      lastName: "Last Name",
      age: "Age",
      phone: "Phone",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
      telegram: "Telegram",
      city: "City",
      portfolio: "Portfolio",
      languages: "Languages",
      specialty: "Profession",
      skillInput: "Skills...",
      position: "Workplace",
      years: "Years (e.g. 2020–2023)",
      courses: "Courses (e.g. GoIT Fullstack)",
      education: "Education",
      hobbies: "Hobbies",
      genDesc: "Generate Description",
      about: "About Me",
      downloadPDF: "SAVE TO PDF",
      noExperience: "No experience",
      courseExperience: "No, but took courses",
    }
  };
  
  function applyTranslations() {
    const lang = localStorage.getItem('language') || 'ru';
    const t = translations[lang];
  
    if (!t) return;
  
    const setValue = (id, text) => {
      const el = document.getElementById(id);
      if (!el) return;
  
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = text;
      } else if (el.tagName === "BUTTON") {
        el.textContent = text;
      }
    };
  
    setValue("firstName", t.firstName);
    setValue("lastName", t.lastName);
    setValue("age", t.age);
    setValue("phone", t.phone);
    setValue("email", t.email);
    setValue("github", t.github);
    setValue("linkedin", t.linkedin);
    setValue("telegram", t.telegram);
    setValue("city", t.city);
    setValue("portfolio", t.portfolio);
    setValue("languages", t.languages);
    setValue("specialty", t.specialty);
    setValue("skillInput", t.skillInput);
    setValue("position", t.position);
    setValue("years", t.years);
    setValue("courses", t.courses);
    setValue("education", t.education);
    setValue("hobbies", t.hobbies);
    setValue("genDesc", t.genDesc);
    setValue("about", t.about);
    setValue("downloadLivePDF", t.downloadPDF);
  
    // Переводим текст чекбоксов
    const noExpLabel = document.querySelector('label[for="noExperience"]') || document.querySelector('#noExperience')?.parentElement;
    const courseExpLabel = document.querySelector('label[for="courseExperience"]') || document.querySelector('#courseExperience')?.parentElement;
  
    if (noExpLabel) noExpLabel.innerText = t.noExperience;
    if (courseExpLabel) courseExpLabel.innerText = t.courseExperience;
  }
  
  // Применяем сразу при загрузке страницы
  document.addEventListener('DOMContentLoaded', applyTranslations);
  