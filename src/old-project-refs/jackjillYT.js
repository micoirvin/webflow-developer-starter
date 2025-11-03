// YouTube Player
initializeYouTubePlayers();

async function initializeYouTubePlayers() {
  let ytPlayers = document.querySelectorAll('yt-player');
  if (ytPlayers.length === 0) return;

  const vidstackStyles = [
    'https://cdn.vidstack.io/player/theme.css',
    'https://cdn.vidstack.io/player/video.css',
  ];
  vidstackStyles.forEach((href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  });

  function getYouTubeVideoID(url) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|embed|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  async function loadCustomPlayerLibrary(retryCount = 3) {
    try {
      return await import('https://cdn.vidstack.io/player');
    } catch (error) {
      if (retryCount > 0) {
        console.warn('Retrying to load Vidstack player library...');
        return loadCustomPlayerLibrary(retryCount - 1);
      } else {
        console.error('Failed to load Vidstack player library after retries:', error);
        throw error;
      }
    }
  }

  try {
    let { VidstackPlayer, VidstackPlayerLayout } = await loadCustomPlayerLibrary();
    let players = [];
    let currentlyPlaying = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            let player = entry.target.playerInstance;
            if (player && !player.paused) {
              player.pause();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    for (let [index, target] of ytPlayers.entries()) {
      let videoLink = target.getAttribute('data-yt-link');
      let videoID = getYouTubeVideoID(videoLink);
      if (!videoLink) {
        console.error('Video Link is missing or not correct.');
        continue;
      }

      target.id = `youtube-player-${index}`;
      let playerConfig = {
        target: `#${target.id}`,
        title: target.getAttribute('data-title'),
        src: videoLink,
        poster:
          target.getAttribute('data-poster') ||
          `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`,
        layout: new VidstackPlayerLayout(),
        playsinline: true,
        mute: false,
      };

      try {
        let player = await VidstackPlayer.create(playerConfig);
        players.push(player);
        target.playerInstance = player;

        observer.observe(target);

        player.addEventListener('play', () => {
          target.classList.add('playing');
          if (currentlyPlaying && currentlyPlaying !== player) {
            currentlyPlaying.pause();
          }
          currentlyPlaying = player;
        });

        player.addEventListener('pause', () => {
          target.classList.remove('playing');
          if (currentlyPlaying === player) {
            currentlyPlaying = null;
          }
        });

        if (target.closest('[video-wrap]')) {
          let videoWrap = target.closest('[video-wrap]');
          let mutedVideoEmbed = videoWrap.querySelector('[muted-video-embed]');
          mutedVideoEmbed?.addEventListener('click', () => {
            gsap.to(mutedVideoEmbed, {
              duration: 0.5,
              opacity: 0,
              onComplete: () => {
                mutedVideoEmbed.remove();
                player.play();
              },
            });
          });
        }
      } catch (error) {
        console.error(`Failed to initialize player for video ${videoLink}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to initialize YouTube players:', error);
  }
}
