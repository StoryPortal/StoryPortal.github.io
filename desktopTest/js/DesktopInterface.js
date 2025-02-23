const { useState } = React;
const { createElement: e } = React;

// Import our components
import { MessageWindow } from './components/MessageWindow.js';
import { NotesWindow } from './components/NotesWindow.js';
import { PhotoAlbumWindow } from './components/PhotoAlbumWindow.js';
import { LookoutWindow } from './components/LookoutWindow.js';
import { MessageIcon } from './icons/MessageIcon.js';
import { NotesIcon } from './icons/NotesIcon.js';
import { PhotoIcon } from './icons/PhotoIcon.js';
import { LookoutIcon } from './icons/LookoutIcon.js';

// Dock icon component for better visual feedback
const DockIcon = ({ icon: Icon, isOpen, isMinimized, onClick }) => {
  return e('button', {
    className: `relative w-12 h-12 rounded-lg 
      ${isMinimized ? 'bg-blue-700' : isOpen ? 'bg-blue-600' : 'bg-blue-500'} 
      flex items-center justify-center hover:bg-blue-600 transition-colors group`,
    onClick: onClick
  }, [
    e(Icon),
    (isOpen || isMinimized) && e('div', {
      key: 'indicator',
      className: `absolute -bottom-1 left-1/2 transform -translate-x-1/2 
        ${isMinimized ? 'w-4 h-1' : 'w-1 h-1'} 
        bg-white rounded-full transition-all duration-200`
    }),
    isMinimized && e('div', {
      key: 'tooltip',
      className: 'absolute bottom-full mb-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded hidden group-hover:block whitespace-nowrap',
    }, 'Click to restore')
  ]);
};

const DesktopInterface = () => {
  // Track both open and minimized state for each window
  const [messageState, setMessageState] = useState({ isOpen: true, isMinimized: false });
  const [notesState, setNotesState] = useState({ isOpen: false, isMinimized: false });
  const [photoAlbumState, setPhotoAlbumState] = useState({ isOpen: false, isMinimized: false });
  const [lookoutState, setLookoutState] = useState({ isOpen: true, isMinimized: false });
  const [backgroundImage, setBackgroundImage] = useState('./Pictures/spirl.jpg');

  // Helper functions for window states
  const createWindowStateHelpers = (setState) => ({
    open: () => setState({ isOpen: true, isMinimized: false }),
    close: () => setState({ isOpen: false, isMinimized: false }),
    minimize: () => setState(prev => ({ ...prev, isMinimized: true })),
    restore: () => setState(prev => ({ ...prev, isMinimized: false }))
  });

  const messageHelpers = createWindowStateHelpers(setMessageState);
  const notesHelpers = createWindowStateHelpers(setNotesState);
  const photoAlbumHelpers = createWindowStateHelpers(setPhotoAlbumState);
  const lookoutHelpers = createWindowStateHelpers(setLookoutState);

  return e('div', {
    className: 'relative w-full h-screen bg-cover bg-center',
    style: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
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
        onClick: messageHelpers.open
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
        onClick: notesHelpers.open
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
        key: 'photoalbum-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: photoAlbumHelpers.open
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
    messageState.isOpen && e(MessageWindow, {
      key: 'message-window',
      onClose: messageHelpers.close,
      onMinimize: messageHelpers.minimize,
      isMinimized: messageState.isMinimized,
      handleMaximize: () => {} // Placeholder for maximize functionality
    }),

    notesState.isOpen && e(NotesWindow, {
      key: 'notes-window',
      onClose: notesHelpers.close,
      onMinimize: notesHelpers.minimize,
      isMinimized: notesState.isMinimized,
      handleMaximize: () => {} // Placeholder for maximize functionality
    }),

    photoAlbumState.isOpen && e(PhotoAlbumWindow, {
      key: 'photoalbum-window',
      onClose: photoAlbumHelpers.close,
      onMinimize: photoAlbumHelpers.minimize,
      isMinimized: photoAlbumState.isMinimized,
      handleMaximize: () => {} // Placeholder for maximize functionality
    }),

    lookoutState.isOpen && e(LookoutWindow, {
      key: 'lookout-window',
      onClose: lookoutHelpers.close,
      onMinimize: lookoutHelpers.minimize,
      isMinimized: lookoutState.isMinimized,
      handleMaximize: () => {} // Placeholder for maximize functionality
    }),

    // Enhanced dock with better minimize indicators
    e('div', {
      key: 'dock',
      className: 'absolute bottom-0 w-full bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200'
    },
      e('div', {
        className: 'max-w-screen-lg mx-auto p-2 flex items-center justify-center space-x-2'
      }, [
        e(DockIcon, {
          key: 'dock-messages',
          icon: MessageIcon,
          isOpen: messageState.isOpen,
          isMinimized: messageState.isMinimized,
          onClick: () => messageState.isMinimized ? messageHelpers.restore() : messageHelpers.open()
        }),
        e(DockIcon, {
          key: 'dock-notes',
          icon: NotesIcon,
          isOpen: notesState.isOpen,
          isMinimized: notesState.isMinimized,
          onClick: () => notesState.isMinimized ? notesHelpers.restore() : notesHelpers.open()
        }),
        e(DockIcon, {
          key: 'dock-photoalbum',
          icon: PhotoIcon,
          isOpen: photoAlbumState.isOpen,
          isMinimized: photoAlbumState.isMinimized,
          onClick: () => photoAlbumState.isMinimized ? photoAlbumHelpers.restore() : photoAlbumHelpers.open()
        }),
        e(DockIcon, {
          key: 'dock-lookout',
          icon: LookoutIcon,
          isOpen: lookoutState.isOpen,
          isMinimized: lookoutState.isMinimized,
          onClick: () => lookoutState.isMinimized ? lookoutHelpers.restore() : lookoutHelpers.open()
        })
      ])
    )
  ]);
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(DesktopInterface));