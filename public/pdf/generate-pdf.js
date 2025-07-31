document.addEventListener('DOMContentLoaded', () => {
  const downloadBtn = document.getElementById('downloadPDF');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', async () => {
    const element = document.querySelector('.cv-preview');
    if (!element) {
      alert('Сначала згенерируй резюме.');
      return;
    }

    const { jsPDF } = window.jspdf; // 

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = {
      width: canvas.width,
      height: canvas.height
    };

    const ratio = imgProps.width / imgProps.height;
    const pdfImgWidth = pdfWidth;
    const pdfImgHeight = pdfImgWidth / ratio;

    let position = 0;
    let heightLeft = pdfImgHeight;

    while (heightLeft > 0) {
      pdf.addImage(imgData, 'JPEG', 0, position, pdfImgWidth, pdfImgHeight);
      heightLeft -= pdfHeight;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    pdf.save('my-cv.pdf');
  });
});
