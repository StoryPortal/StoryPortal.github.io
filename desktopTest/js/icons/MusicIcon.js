// js/icons/MusicIcon.js
const { createElement: e } = React;

export const MusicIcon = () => e('svg', {
  className: 'w-8 h-8 text-white',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, 
  e('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
  })
);