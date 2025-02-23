const { useState } = React;
const { createElement: e } = React;

// Import our components
import { MessageWindow } from './components/MessageWindow.js';
import { NotesWindow } from './components/NotesWindow.js';
import { PhotoAlbumWindow } from './components/PhotoAlbumWindow.js';
import { MessageIcon } from './icons/MessageIcon.js';
import { NotesIcon } from './icons/NotesIcon.js';
import { PhotoIcon } from './icons/PhotoIcon.js';

const DesktopInterface = () => {
  const [isMessageOpen, setIsMessageOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isPhotoAlbumOpen, setIsPhotoAlbumOpen] = useState(false);

  return e('div', {
    className: 'relative w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100'
  }, [
    // Desktop Icons
    e('div', {
      key: 'icons',
      className: 'absolute top-4 left-4 space-y-4'
    }, [
      // Messages Icon
      e('div', {
        key: 'messages-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => setIsMessageOpen(true)
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(MessageIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900'
        }, 'Messages')
      ]),
      // Notes Icon
      e('div', {
        key: 'notes-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => setIsNotesOpen(true)
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(NotesIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900'
        }, 'Notes')
      ]),
      // Photo Album Icon
      e('div', {
        key: 'photo-album-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => setIsPhotoAlbumOpen(true)
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(PhotoIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900'
        }, 'Photos')
      ])
    ]),

    // Windows
    isMessageOpen && e(MessageWindow, {
      key: 'message-window',
      onClose: () => setIsMessageOpen(false)
    }),
    
    isNotesOpen && e(NotesWindow, {
      key: 'notes-window',
      onClose: () => setIsNotesOpen(false)
    }),

    isPhotoAlbumOpen && e(PhotoAlbumWindow, {
      key: 'photo-album-window',
      onClose: () => setIsPhotoAlbumOpen(false)
    }),

    // Dock/Taskbar
    e('div', {
      key: 'dock',
      className: 'absolute bottom-0 w-full bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200'
    },
      e('div', {
        className: 'max-w-screen-lg mx-auto p-2 flex items-center justify-center space-x-2'
      }, [
        e('button', {
          key: 'dock-messages',
          className: 'w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors',
          onClick: () => setIsMessageOpen(true)
        }, e(MessageIcon)),
        e('button', {
          key: 'dock-notes',
          className: 'w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors',
          onClick: () => setIsNotesOpen(true)
        }, e(NotesIcon)),
        e('button', {
          key: 'dock-photos',
          className: 'w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors',
          onClick: () => setIsPhotoAlbumOpen(true)
        }, e(PhotoIcon))
      ])
    )
  ]);
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(DesktopInterface));