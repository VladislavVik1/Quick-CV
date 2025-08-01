document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('downloadLivePDF');
  const target = document.getElementById('livePreview');

  if (btn && target) {
    btn.addEventListener('click', async () => {
      const wasEditable = target.getAttribute('contenteditable');
      target.removeAttribute('contenteditable');

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff',
        windowWidth: target.scrollWidth,
      });

      const imgData = canvas.toDataURL('image/png');

      // Используем глобальный объект jspdf
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cv-preview.pdf');

      if (wasEditable !== null) {
        target.setAttribute('contenteditable', wasEditable);
      }
    });
  }
});
