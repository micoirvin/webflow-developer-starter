const handleVimeoLightbox = () => {
  document.querySelectorAll('.u-lightbox-video').forEach((lightbox) => {
    const closeButtons = lightbox.querySelectorAll('[modal-close]');
    if (!closeButtons.length) return;

    closeButtons.forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => {
        const iframe = lightbox.querySelector('iframe');
        if (!iframe || !iframe.src.includes('vimeo.com')) return;

        const player = new Vimeo.Player(iframe);
        player.pause();
      });
    });
  });
};
