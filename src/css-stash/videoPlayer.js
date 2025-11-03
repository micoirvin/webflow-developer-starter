{
  /* <script src="https://cdn.plyr.io/3.6.8/plyr.polyfilled.js"></script>
<link rel="stylesheet" href="https://cdn.plyr.io/3.6.8/plyr.css"> */
} // --- NEED SCRIPTS

const plyrContainers = document.querySelectorAll('.plyr');

if (plyrContainers.length > 0) {
  const activePlayers = [];

  function pauseAllPlayers(excludePlayer) {
    activePlayers.forEach((player) => {
      if (player !== excludePlayer && player.playing) player.pause();
    });
  }

  function pauseAllVideos() {
    activePlayers.forEach((player) => {
      if (player.playing) player.pause();
    });
  }

  function setupPlayer(player, container) {
    if (!activePlayers.includes(player)) activePlayers.push(player);
    player.on('play', () => {
      pauseAllPlayers(player);
      container.classList.add('playing');
    });
  }

  const loadVideo = (container) => {
    const provider = container.getAttribute('data-plyr-provider');

    if (provider === 'html5') {
      const mp4Source = container.getAttribute('data-plyr-mp4');
      if (mp4Source) {
        const videoElement = document.createElement('video');
        videoElement.controls = true;
        const sourceElement = document.createElement('source');
        sourceElement.src = mp4Source;
        sourceElement.type = 'video/mp4';
        videoElement.appendChild(sourceElement);
        container.appendChild(videoElement);
        const player = new Plyr(videoElement);
        setupPlayer(player, container);
        player.play();
      }
    } else if (provider === 'youtube') {
      const player = new Plyr(container, {
        youtube: { rel: 1 }, // Enable related videos
      });
      setupPlayer(player, container);
    } else if (provider === 'vimeo') {
      const player = new Plyr(container);
      setupPlayer(player, container);
    }
  };

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  plyrContainers.forEach((container) => {
    observer.observe(container);
  });

  // Event listener for all pause-all buttons
  const pauseAllButtons = document.querySelectorAll('[pause-video="all"]');
  pauseAllButtons.forEach((button) => {
    button.addEventListener('click', () => {
      pauseAllVideos();
    });
  });
}
