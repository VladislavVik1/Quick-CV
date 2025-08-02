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

  // Временно скрываем элементы
  if (toolbar) toolbar.style.display = 'none';
  if (downloadButton) downloadButton.style.display = 'none';

  // Устанавливаем размеры A4
  previewElement.style.width = '210mm';
  previewElement.style.minHeight = '297mm';
  previewElement.style.height = 'auto';

  const canvas = await html2canvas(previewElement, {
    scale: 2,
    useCORS: true,
    logging: false
  });

  // Возвращаем элементы обратно
  if (toolbar) toolbar.style.display = 'flex';
  if (downloadButton) downloadButton.style.display = 'inline-block';

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 210; // A4 ширина
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new window.jspdf.jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
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