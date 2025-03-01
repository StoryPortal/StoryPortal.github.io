// js/icons/PDFIcon.js
const { createElement: e } = React;

export const PDFIcon = () => e('svg', {
  className: 'w-8 h-8 text-white',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, 
  e('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
  }),
  e('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M15 2v5a2 2 0 002 2h5'
  }),
  e('text', {
    x: '11',
    y: '16',
    fontSize: '6',
    fontWeight: 'bold',
    fill: 'currentColor',
    textAnchor: 'middle'
  }, 'PDF')
);