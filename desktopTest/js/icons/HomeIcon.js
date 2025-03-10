// js/icons/HomeIcon.js
const { createElement: e } = React;

export const HomeIcon = () => e('svg', {
  className: 'w-8 h-8 text-white',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, 
  e('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0a1 1 0 00-1 1v3'
  })
);