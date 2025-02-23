const { useState } = React;
const { createElement: e } = React;

import { DraggableWindow } from './DraggableWindow.js';

// Separate TitleBar component (similar to MessageWindow)
const TitleBar = ({ onClose, onMinimize, handleMaximize }) => {
  return e('div', {
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
          className: 'w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors',
          onClick: (e) => {
            e.stopPropagation();
            onClose();
          },
          title: 'Close'
        }),
        e('button', {
          key: 'minimize',
          className: 'w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors',
          onClick: (e) => {
            e.stopPropagation();
            onMinimize();
          },
          title: 'Minimize'
        }),
        e('button', {
          key: 'maximize',
          className: 'w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors',
          onClick: (e) => {
            e.stopPropagation();
            if (typeof handleMaximize === 'function') {
              handleMaximize();
            }
          },
          title: 'Maximize'
        })
      ]),
      e('span', {
        key: 'title',
        className: 'text-sm font-medium ml-2'
      }, 'Notes')
    ])
  );
};

export const NotesWindow = ({ onClose, onMinimize, isMinimized, handleMaximize, isMaximized }) => {
  const [note, setNote] = useState('Write your note here...');
  
  return e(DraggableWindow, {
    onClose,
    onMinimize,
    isMinimized,
    initialPosition: { x: 150, y: 100 }
  }, [
    e(TitleBar, {
      key: 'titlebar',
      onClose,
      onMinimize,
      handleMaximize
    }),
    e('textarea', {
      key: 'content',
      className: `w-96 p-4 focus:outline-none resize-none ${isMaximized ? 'h-[calc(100vh-48px)]' : 'h-64'}`,
      value: note,
      onChange: (e) => setNote(e.target.value)
    })
  ]);
};