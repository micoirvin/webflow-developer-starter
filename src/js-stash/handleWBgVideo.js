const handleWBgVideo = () => {
  document.querySelectorAll('.w-background-video').forEach((videoWrap) => {
    videoWrap.addEventListener('click', () => {
      const video = videoWrap.querySelector('video');
      if (!video) return;
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
};
