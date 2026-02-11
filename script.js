// ===== vCard Page Interactivity =====

document.addEventListener('DOMContentLoaded', () => {

  // --- Copy Link to Clipboard ---
  const copyBtn = document.getElementById('copyLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast('✅ Enlace copiado al portapapeles');
      }).catch(() => {
        // fallback
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('✅ Enlace copiado al portapapeles');
      });
    });
  }

  // --- Toast Notification ---
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // --- Send by Email Modal ---
  const emailModalTrigger = document.getElementById('emailModalTrigger');
  const emailModal = document.getElementById('emailModal');
  const emailModalClose = document.getElementById('emailModalClose');
  const emailModalSend = document.getElementById('emailModalSend');
  const emailInput = document.getElementById('emailInput');

  if (emailModalTrigger && emailModal) {
    emailModalTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      emailModal.classList.add('active');
      setTimeout(() => emailInput && emailInput.focus(), 300);
    });
  }

  if (emailModalClose && emailModal) {
    emailModalClose.addEventListener('click', () => {
      emailModal.classList.remove('active');
    });
  }

  if (emailModal) {
    emailModal.addEventListener('click', (e) => {
      if (e.target === emailModal) {
        emailModal.classList.remove('active');
      }
    });
  }

  if (emailModalSend && emailInput) {
    emailModalSend.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (email && email.includes('@')) {
        const subject = encodeURIComponent('Mi tarjeta de contacto');
        const body = encodeURIComponent(
          `Hola,\n\nTe comparto mi tarjeta de contacto digital:\n${window.location.href}\n\nSaludos!`
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        emailModal.classList.remove('active');
        showToast('📧 Abriendo cliente de email...');
      } else {
        showToast('⚠️ Ingresa un email válido');
      }
    });
  }

  // --- Download vCard ---
  const downloadBtn = document.getElementById('downloadVCard');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateVCard();
    });
  }

  const saveBtnBottom = document.getElementById('saveToPhone');
  if (saveBtnBottom) {
    saveBtnBottom.addEventListener('click', (e) => {
      e.preventDefault();
      generateVCard();
    });
  }

  function generateVCard() {
    const data = window.vcardData || {};
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.firstName || ''} ${data.lastName || ''}`,
      `N:${data.lastName || ''};${data.firstName || ''};;;`,
      `ORG:${data.company || ''}`,
      `TITLE:${data.job || ''}`,
      `TEL;TYPE=CELL:${data.mobile || ''}`,
      `TEL;TYPE=WORK:${data.phone || ''}`,
      `EMAIL:${data.email || ''}`,
      `ADR;TYPE=WORK:;;${data.street || ''};${data.city || ''};${data.state || ''};${data.zip || ''};${data.country || ''}`,
      `URL:${data.website || ''}`,
      `BDAY:${data.birthday || ''}`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.firstName || 'contacto'}_${data.lastName || ''}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📇 Descargando vCard...');
  }

  // --- Share buttons ---
  const sharePageBtn = document.getElementById('sharePageBtn');
  if (sharePageBtn) {
    sharePageBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const shareData = {
        title: 'Mi Tarjeta de Contacto',
        text: 'Mira mi tarjeta de contacto digital',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // user cancelled
        }
      } else {
        showToast('Usa los botones de compartir abajo');
      }
    });
  }

  // --- Smooth scroll for address section ---
  const showOnMapLinks = document.querySelectorAll('.show-map-link');
  showOnMapLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const mapSection = document.getElementById('mapSection');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

});
