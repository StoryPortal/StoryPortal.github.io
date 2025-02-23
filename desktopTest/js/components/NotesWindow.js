const { useState } = React;
const { createElement: e } = React;

import { DraggableWindow } from './DraggableWindow.js';

export const NotesWindow = ({ onClose }) => {
  const [note, setNote] = useState('Write your note here...');
  
  return e(DraggableWindow, {
    onClose,
    initialPosition: { x: 150, y: 100 }
  }, [
    e('div', {
      key: 'titlebar',
      className: 'window-titlebar flex items-center justify-between bg-gray-100 p-2 rounded-t-lg border-b'
    }, 
      e('div', {
        className: 'flex items-center space-x-2'
      }, [
        e('div', {
          key: 'buttons',
          className: 'flex space-x-2'
        }, [
          e('button', {
            key: 'close',
            className: 'w-3 h-3 rounded-full bg-red-500',
            onClick: onClose
          }),
          e('div', {
            key: 'minimize',
            className: 'w-3 h-3 rounded-full bg-yellow-500'
          }),
          e('div', {
            key: 'maximize',
            className: 'w-3 h-3 rounded-full bg-green-500'
          })
        ]),
        e('span', {
          key: 'title',
          className: 'text-sm font-medium'
        }, 'Notes')
      ])
    ),
    
    e('textarea', {
      key: 'content',
      className: 'w-96 h-64 p-4 focus:outline-none resize-none',
      value: note,
      onChange: (e) => setNote(e.target.value)
    })
  ]);
};