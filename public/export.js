document.addEventListener('DOMContentLoaded', () => {
    const exportModal  = document.getElementById('exportModal');
    const openExport   = document.getElementById('openExport');
    const closeExport  = document.getElementById('closeExport');
    const btnPdf       = document.getElementById('exportPdf');
    const previewPaper = document.querySelector('.preview-paper');
  
    const showModal = () => exportModal?.classList.remove('hidden');
    const hideModal = () => exportModal?.classList.add('hidden');
  
    openExport?.addEventListener('click', showModal);
    closeExport?.addEventListener('click', hideModal);
    exportModal?.addEventListener('click', (e) => {
      if (e.target === exportModal) hideModal(); // клик по фону
    });
  
    // Подтягиваем все стили (link + style), чтобы PDF выглядел как в превью
    function collectStyles() {
      return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map(el => el.outerHTML).join('\n');
    }
  
    // Экспорт в PDF через окно печати (надёжно и с правильной типографикой)
    btnPdf?.addEventListener('click', () => {
      if (!previewPaper) return;
  
      const styles = collectStyles();
      const w = window.open('', '_blank', 'width=900,height=1200');
      if (!w) return;
  
      w.document.write(`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>QuickCV PDF</title>
            ${styles}
            <style>
              @page { size: A4; margin: 10mm; }
              body { margin: 0; }
            </style>
          </head>
          <body>
            ${previewPaper.outerHTML}
            <script>
              window.onload = () => setTimeout(() => { window.print(); window.close(); }, 150);
            <\/script>
          </body>
        </html>
      `);
      w.document.close();
      hideModal();
    });
  });
  