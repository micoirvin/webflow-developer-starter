// Initialize and add the map
let map;
const markers = [];
var infoWindow;
const colors = {
  normal: { bg: '#FFFDF7', line: '#272516' },
  active: { bg: '#272516', line: '#FFFDF7' },
  unique: { bg: '#272516', line: '#FFFDF7' },
};
let pinSvgString = '';
let activePinSvgString = '';
let uniquePinSvgString = '';

export const initMap = async () => {
  const mapEl = document.querySelector('.the-map');
  if (!mapEl) return;
  const positions = getPositions();

  getDefaultPosition(mapEl, positions);

  // SET POSITIONS FOR MAP (EVERYTHING BE VISIBLE)

  const lats = positions.map((p) => p.position.lat);
  const lngs = positions.map((p) => p.position.lng);

  const centerPosition = {
    lat: (Math.max(...lats) + Math.min(...lats)) / 2,
    lng: (Math.max(...lngs) + Math.min(...lngs)) / 2,
  };

  let mapZoom = mapEl.getAttribute('map-zoom');
  if (!mapZoom) mapZoom = 17;
  mapZoom = Number(mapZoom);

  const { Map } = await google.maps.importLibrary('maps');
  map = new Map(mapEl, {
    zoom: mapZoom,
    center: centerPosition,
    mapId: 'DEMO_MAP_ID',
  });

  await setInfoWindow();

  readPinColors(mapEl);
  createPinSvgs();

  positions.forEach((p) => {
    createMarker(p, positions.length == 1, infoWindow);
  });

  mapInteractions(positions, infoWindow);
};

const getPositions = () => {
  const mapCoordWraps = document.querySelectorAll('[the-map-coord-wrap]');
  const positions = [];

  // GET POSITIONS FROM CMS COLLECTION
  mapCoordWraps.forEach((w) => {
    const name = w.getAttribute('title') ?? 'No name';
    let lat = w.getAttribute('lat');
    let lng = w.getAttribute('lng');
    const slug = w.getAttribute('slug');
    if (!lat || !lng || !slug) return;
    lat = Number(lat);
    lng = Number(lng);
    if (isNaN(lat) || isNaN(lng)) return;
    positions.push({
      unique: false,
      name: name,
      slug: slug,
      position: {
        lat: lat,
        lng: lng,
      },
    });
  });

  return positions;
};

const getDefaultPosition = (mapEl, positions) => {
  let lat = mapEl.getAttribute('default-lat');
  let lng = mapEl.getAttribute('default-lng');
  if (!lat || !lng) return;
  lat = Number(lat);
  lng = Number(lng);
  if (isNaN(lat) || isNaN(lng)) return;
  const name = mapEl.getAttribute('default-title') ?? 'No name';
  positions.push({
    unique: true,
    name: name,
    position: {
      lat: lat,
      lng: lng,
    },
  });
};

const setInfoWindow = async () => {
  const { InfoWindow } = await google.maps.importLibrary('maps');
  infoWindow = new InfoWindow();
};

const createMarker = async (p, active, infoWindow) => {
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

  const parser = new DOMParser();
  let svgHtml = p.unique ? uniquePinSvgString : active ? activePinSvgString : pinSvgString;
  const pinSvg = parser.parseFromString(svgHtml, 'image/svg+xml').documentElement;

  const marker = new AdvancedMarkerElement({
    map: map,
    position: p.position,
    content: pinSvg,
    title: p.name,
    gmpClickable: true,
  });

  markers.push({ marker: marker, slug: p.slug });

  marker.addListener('click', ({ domEvent, latLng }) => {
    const { target } = domEvent;

    infoWindow.close();
    infoWindow.setContent(marker.title);
    infoWindow.open(marker.map, marker);
  });

  if (p.unique) {
    marker.targetElement.querySelector('svg').style.transform = 'scale(1.5)';
    marker.targetElement.style.zIndex = '202020';
  }
};

const mapInteractions = (positions, infoWindow) => {
  const mapCoordWraps = document.querySelectorAll('[the-map-coord-wrap]');
  mapCoordWraps.forEach((w) => {
    w.addEventListener('click', () => {
      infoWindow.close();
      let slug = '';

      if (w.classList.contains('is-active')) {
        w.classList.remove('is-active');
      } else {
        slug = w.getAttribute('slug');
        if (!slug) return;
        w.classList.add('is-active');
      }

      markers.forEach((m) => {
        const uniquePin = positions.filter((p) => p.unique);
        if (uniquePin.slug == m.slug) return;
        const styles =
          m.slug === slug
            ? {
                transform: 'scale(1.5)',
                stroke: colors.active.line,
                fill: colors.active.bg,
                zIndex: '101010',
              }
            : {
                transform: 'scale(1)',
                stroke: colors.normal.line,
                fill: colors.normal.bg,
                zIndex: '1',
              };
        m.marker.targetElement.querySelector('svg').style.transform = styles.transform;
        m.marker.targetElement.style.zIndex = styles.zIndex;
        m.marker.targetElement
          .querySelectorAll('svg path')
          .forEach((p) => (p.style.stroke = styles.stroke));
        m.marker.targetElement
          .querySelectorAll('svg circle')
          .forEach((c) => (c.style.fill = styles.fill));
      });

      mapCoordWraps.forEach((ow) => {
        if (ow !== w) ow.classList.remove('is-active');
      });
    });
  });
};

const readPinColors = (mapEl) => {
  let c0 = mapEl.getAttribute('color-pin') ?? null;
  let c1 = mapEl.getAttribute('color-pin-line') ?? null;
  let c2 = mapEl.getAttribute('color-active-pin') ?? null;
  let c3 = mapEl.getAttribute('color-active-pin-line') ?? null;
  let c4 = mapEl.getAttribute('color-unique-pin') ?? null;
  console.log('hello', c4);
  let c5 = mapEl.getAttribute('color-unique-pin-line') ?? null;

  if (c0) colors.normal.bg = c0;
  if (c1) colors.normal.line = c1;
  if (c2) colors.active.bg = c2;
  if (c3) colors.active.line = c3;
  if (c4) colors.unique.bg = c4;
  if (c5) colors.unique.line = c5;
};

const createPinSvgs = () => {
  pinSvgString = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: transform 300ms ease-in-out;">
<circle cx="18" cy="18" r="18" fill="${colors.normal.bg}" style="transition: fill 300ms ease-in-out"/>
<path d="M26 16.5555C26 22.7778 18 28.1111 18 28.1111C18 28.1111 10 22.7778 10 16.5555C10 14.4338 10.8429 12.399 12.3431 10.8987C13.8434 9.3984 15.8783 8.55554 18 8.55554C20.1217 8.55554 22.1566 9.3984 23.6569 10.8987C25.1571 12.399 26 14.4338 26 16.5555Z" stroke="${colors.normal.line}" stroke-linecap="round" stroke-linejoin="round" style="transition: stroke 300ms ease-in-out"/>
<path d="M18.0002 19.2222C19.4729 19.2222 20.6668 18.0283 20.6668 16.5555C20.6668 15.0828 19.4729 13.8889 18.0002 13.8889C16.5274 13.8889 15.3335 15.0828 15.3335 16.5555C15.3335 18.0283 16.5274 19.2222 18.0002 19.2222Z" stroke="${colors.normal.line}" stroke-linecap="round" stroke-linejoin="round" style="transition: stroke 300ms ease-in-out"/>
</svg>
`;

  activePinSvgString = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: transform 300ms ease-in-out; transform: scale(1.5);">
<circle cx="18" cy="18" r="18" fill="${colors.active.bg}" style="transition: fill 300ms ease-in-out"/>
<path d="M26 16.5555C26 22.7778 18 28.1111 18 28.1111C18 28.1111 10 22.7778 10 16.5555C10 14.4338 10.8429 12.399 12.3431 10.8987C13.8434 9.3984 15.8783 8.55554 18 8.55554C20.1217 8.55554 22.1566 9.3984 23.6569 10.8987C25.1571 12.399 26 14.4338 26 16.5555Z" stroke="${colors.active.line}" stroke-linecap="round" stroke-linejoin="round" style="transition: stroke 300ms ease-in-out"/>
<path d="M18.0002 19.2222C19.4729 19.2222 20.6668 18.0283 20.6668 16.5555C20.6668 15.0828 19.4729 13.8889 18.0002 13.8889C16.5274 13.8889 15.3335 15.0828 15.3335 16.5555C15.3335 18.0283 16.5274 19.2222 18.0002 19.2222Z" stroke="${colors.active.line}" stroke-linecap="round" stroke-linejoin="round" style="transition: stroke 300ms ease-in-out"/>
</svg>
`;
  uniquePinSvgString = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: transform 300ms ease-in-out;">
<circle cx="18" cy="18" r="18" fill="${colors.unique.bg}" style="transition: fill 300ms ease-in-out"/>
<path d="M26 16.5555C26 22.7778 18 28.1111 18 28.1111C18 28.1111 10 22.7778 10 16.5555C10 14.4338 10.8429 12.399 12.3431 10.8987C13.8434 9.3984 15.8783 8.55554 18 8.55554C20.1217 8.55554 22.1566 9.3984 23.6569 10.8987C25.1571 12.399 26 14.4338 26 16.5555Z" stroke="${colors.unique.line}" stroke-linecap="round" stroke-linejoin="round" style="transition: stroke 300ms ease-in-out"/>
<path d="M18.0002 19.2222C19.4729 19.2222 20.6668 18.0283 20.6668 16.5555C20.6668 15.0828 19.4729 13.8889 18.0002 13.8889C16.5274 13.8889 15.3335 15.0828 15.3335 16.5555C15.3335 18.0283 16.5274 19.2222 18.0002 19.2222Z" stroke="${colors.unique.line}" stroke-linecap="round" stroke-linejoin="round" style="transition: stroke 300ms ease-in-out"/>
</svg>
`;
};
