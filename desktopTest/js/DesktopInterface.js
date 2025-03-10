// js/DesktopInterface.js
const { useState } = React;
const { createElement: e } = React;

// Import our components
import { MessageWindow } from './components/MessageWindow.js';
import { NotesWindow } from './components/NotesWindow.js';
import { PhotoAlbumWindow } from './components/PhotoAlbumWindow.js';
import { LookoutWindow } from './components/LookoutWindow.js';
import { BrowserWindow } from './components/BrowserWindow.js';
import { PDFViewerWindow } from './components/PDFViewerWindow.js';
import { MediaPlayerWindow } from './components/MediaPlayerWindow.js';
import { MessageIcon } from './icons/MessageIcon.js';
import { NotesIcon } from './icons/NotesIcon.js';
import { PhotoIcon } from './icons/PhotoIcon.js';
import { LookoutIcon } from './icons/LookoutIcon.js';
import { BrowserIcon } from './icons/BrowserIcon.js';
import { PDFIcon } from './icons/PDFIcon.js';
import { MusicIcon } from './icons/MusicIcon.js';
import { HomeIcon } from './icons/HomeIcon.js';

// Enhanced DockIcon component
const DockIcon = ({ icon: Icon, label, isOpen, isMinimized, onClick, customClass = '' }) => {
  return e('button', {
    className: `relative w-12 h-12 rounded-lg 
      ${isMinimized ? 'bg-blue-700' : isOpen ? 'bg-blue-600' : 'bg-blue-500'} 
      flex items-center justify-center hover:bg-blue-600 transition-colors group ${customClass}`,
    onClick: onClick
  }, [
    e(Icon),
    (isOpen || isMinimized) && e('div', {
      key: 'indicator',
      className: `absolute -bottom-1 left-1/2 transform -translate-x-1/2 
        ${isMinimized ? 'w-4 h-1' : 'w-1 h-1'} 
        bg-white rounded-full transition-all duration-200`
    }),
    e('div', {
      key: 'tooltip',
      className: 'absolute bottom-full mb-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded hidden group-hover:block whitespace-nowrap',
    }, isMinimized ? 'Click to restore' : label)
  ]);
};

// Home Button Component (special case for story landing page navigation)
const HomeButton = () => {
  return e('button', {
    className: 'relative w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800 transition-colors group mr-4',
    onClick: () => window.location.href = 'https://storyportal.github.io'
  }, [
    e(HomeIcon),
    e('div', {
      key: 'tooltip',
      className: 'absolute bottom-full mb-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded hidden group-hover:block whitespace-nowrap',
    }, 'Go to Story Portal')
  ]);
};

// Simplified Window Manager without z-index handling
const useWindowManager = () => {
  const [windows, setWindows] = useState({
    message: { isOpen: true, isMinimized: false },
    notes: { isOpen: false, isMinimized: false },
    photoAlbum: { isOpen: false, isMinimized: false },
    lookout: { isOpen: true, isMinimized: false },
    browser: { isOpen: false, isMinimized: false },
    mediaPlayer: { isOpen: false, isMinimized: false },
    pdfViewer: { isOpen: false, isMinimized: false }
  });
  
  const createWindowStateHelpers = (windowKey) => ({
    open: () => setWindows(prev => ({
      ...prev,
      [windowKey]: { 
        ...prev[windowKey], 
        isOpen: true, 
        isMinimized: false 
      }
    })),
    close: () => setWindows(prev => ({
      ...prev,
      [windowKey]: { 
        ...prev[windowKey], 
        isOpen: false, 
        isMinimized: false 
      }
    })),
    minimize: () => setWindows(prev => ({
      ...prev,
      [windowKey]: { 
        ...prev[windowKey], 
        isMinimized: true 
      }
    })),
    restore: () => setWindows(prev => ({
      ...prev,
      [windowKey]: { 
        ...prev[windowKey], 
        isMinimized: false 
      }
    })),
    getState: () => windows[windowKey]
  });
  
  return {
    messageHelpers: createWindowStateHelpers('message'),
    notesHelpers: createWindowStateHelpers('notes'),
    photoAlbumHelpers: createWindowStateHelpers('photoAlbum'),
    lookoutHelpers: createWindowStateHelpers('lookout'),
    browserHelpers: createWindowStateHelpers('browser'),
    mediaPlayerHelpers: createWindowStateHelpers('mediaPlayer'),
    pdfViewerHelpers: createWindowStateHelpers('pdfViewer')
  };
};

const DesktopInterface = () => {
  // Use window manager for open/close/minimize state
  const { 
    messageHelpers, 
    notesHelpers, 
    photoAlbumHelpers, 
    lookoutHelpers,
    browserHelpers,
    mediaPlayerHelpers,
    pdfViewerHelpers
  } = useWindowManager();
  
  // NEW: Keep track of window order for rendering
  const [windowOrder, setWindowOrder] = useState([
    'message', 'notes', 'photoAlbum', 'lookout', 
    'browser', 'mediaPlayer', 'pdfViewer'
  ]);
  
  // NEW: Function to bring window to front by changing DOM order
  const bringToFront = (windowKey) => {
    console.log(`Bringing ${windowKey} to front via DOM order`);
    setWindowOrder(prevOrder => {
      // Remove the window from its current position
      const newOrder = prevOrder.filter(key => key !== windowKey);
      // Add it to the beginning (will be rendered last, thus on top)
      newOrder.unshift(windowKey);
      console.log('New window order:', newOrder);
      return newOrder;
    });
  };
  
  const [backgroundImage, setBackgroundImage] = useState('./Pictures/spirl.jpg');

  // Function to render windows in correct stacking order
  const renderWindows = () => {
    // Windows will be rendered in reverse order, so the first one in the array
    // will be rendered last (on top)
    const windowComponents = [];
    
    // Render windows in the order specified by windowOrder (reversed)
    [...windowOrder].reverse().forEach(windowKey => {
      switch(windowKey) {
        case 'message':
          if (messageHelpers.getState().isOpen) {
            windowComponents.push(
              e(MessageWindow, {
                key: 'message-window',
                onClose: messageHelpers.close,
                onMinimize: messageHelpers.minimize,
                isMinimized: messageHelpers.getState().isMinimized,
                onActivate: () => bringToFront('message')
              })
            );
          }
          break;
        case 'notes':
          if (notesHelpers.getState().isOpen) {
            windowComponents.push(
              e(NotesWindow, {
                key: 'notes-window',
                onClose: notesHelpers.close,
                onMinimize: notesHelpers.minimize,
                isMinimized: notesHelpers.getState().isMinimized,
                onActivate: () => bringToFront('notes')
              })
            );
          }
          break;
        case 'photoAlbum':
          if (photoAlbumHelpers.getState().isOpen) {
            windowComponents.push(
              e(PhotoAlbumWindow, {
                key: 'photoalbum-window',
                onClose: photoAlbumHelpers.close,
                onMinimize: photoAlbumHelpers.minimize,
                isMinimized: photoAlbumHelpers.getState().isMinimized,
                onActivate: () => bringToFront('photoAlbum')
              })
            );
          }
          break;
        case 'lookout':
          if (lookoutHelpers.getState().isOpen) {
            windowComponents.push(
              e(LookoutWindow, {
                key: 'lookout-window',
                onClose: lookoutHelpers.close,
                onMinimize: lookoutHelpers.minimize,
                isMinimized: lookoutHelpers.getState().isMinimized,
                onActivate: () => bringToFront('lookout')
              })
            );
          }
          break;
        case 'browser':
          if (browserHelpers.getState().isOpen) {
            windowComponents.push(
              e(BrowserWindow, {
                key: 'browser-window',
                onClose: browserHelpers.close,
                onMinimize: browserHelpers.minimize,
                isMinimized: browserHelpers.getState().isMinimized,
                onActivate: () => bringToFront('browser')
              })
            );
          }
          break;
        case 'mediaPlayer':
          if (mediaPlayerHelpers.getState().isOpen) {
            windowComponents.push(
              e(MediaPlayerWindow, {
                key: 'mediaplayer-window',
                onClose: mediaPlayerHelpers.close,
                onMinimize: mediaPlayerHelpers.minimize,
                isMinimized: mediaPlayerHelpers.getState().isMinimized,
                onActivate: () => bringToFront('mediaPlayer')
              })
            );
          }
          break;
        case 'pdfViewer':
          if (pdfViewerHelpers.getState().isOpen) {
            windowComponents.push(
              e(PDFViewerWindow, {
                key: 'pdfviewer-window',
                onClose: pdfViewerHelpers.close,
                onMinimize: pdfViewerHelpers.minimize,
                isMinimized: pdfViewerHelpers.getState().isMinimized,
                onActivate: () => bringToFront('pdfViewer')
              })
            );
          }
          break;
        }
      });
    
    return windowComponents;
  };

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
      className: 'absolute top-4 left-4 space-y-4 z-10'
    }, [
      // Messages Icon
      e('div', {
        key: 'messages-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => {
          messageHelpers.open();
          bringToFront('message');
        }
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(MessageIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-white group-hover:text-gray-200 bg-black bg-opacity-40 px-2 py-1 rounded'
        }, 'Messages')
      ]),
      // Notes Icon
      e('div', {
        key: 'notes-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => {
          notesHelpers.open();
          bringToFront('notes');
        }
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(NotesIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-white group-hover:text-gray-200 bg-black bg-opacity-40 px-2 py-1 rounded'
        }, 'Notes')
      ]),
      // Photo Album Icon
      e('div', {
        key: 'photoalbum-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => {
          photoAlbumHelpers.open();
          bringToFront('photoAlbum');
        }
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(PhotoIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-white group-hover:text-gray-200 bg-black bg-opacity-40 px-2 py-1 rounded'
        }, 'Photos')
      ]),
      // Lookout Icon
      e('div', {
        key: 'lookout-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => {
          lookoutHelpers.open();
          bringToFront('lookout');
        }
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(LookoutIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-white group-hover:text-gray-200 bg-black bg-opacity-40 px-2 py-1 rounded'
        }, 'Lookout')
      ]),
      // Browser Icon
      e('div', {
        key: 'browser-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => {
          browserHelpers.open();
          bringToFront('browser');
        }
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(BrowserIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-white group-hover:text-gray-200 bg-black bg-opacity-40 px-2 py-1 rounded'
        }, 'Browser')
      ]),
      // Media Player Icon
      e('div', {
        key: 'mediaplayer-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => {
          mediaPlayerHelpers.open();
          bringToFront('mediaPlayer');
        }
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(MusicIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-white group-hover:text-gray-200 bg-black bg-opacity-40 px-2 py-1 rounded'
        }, 'Media')
      ]),
      // PDF Viewer Icon
      e('div', {
        key: 'pdfviewer-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => {
          pdfViewerHelpers.open();
          bringToFront('pdfViewer');
        }
      }, [
        e('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, e(PDFIcon)),
        e('span', {
          className: 'mt-1 text-xs text-center text-white group-hover:text-gray-200 bg-black bg-opacity-40 px-2 py-1 rounded'
        }, 'Documents')
      ]),
    ]),

    // Windows - render in correct order for stacking
    ...renderWindows(),

    // Dock - always on top with high z-index
    e('div', {
      key: 'dock',
      className: 'absolute bottom-0 w-full bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200',
      style: { zIndex: 9999 }
    },
      e('div', {
        className: 'relative w-full px-4 py-2 flex items-center justify-center'
      }, [
        // Home Button (new) - positioned absolutely on the left
        e('div', {
          className: 'absolute left-4',
          style: { zIndex: 10000 }
        }, e(HomeButton, { key: 'home-button' })),
        
        e(DockIcon, {
          key: 'dock-messages',
          icon: MessageIcon,
          label: 'Messages',
          isOpen: messageHelpers.getState().isOpen,
          isMinimized: messageHelpers.getState().isMinimized,
          onClick: () => {
            if (messageHelpers.getState().isMinimized) {
              messageHelpers.restore();
              bringToFront('message');
            } else if (messageHelpers.getState().isOpen) {
              bringToFront('message');
            } else {
              messageHelpers.open();
              bringToFront('message');
            }
          }
        }),
        e(DockIcon, {
          key: 'dock-notes',
          icon: NotesIcon,
          label: 'Notes',
          isOpen: notesHelpers.getState().isOpen,
          isMinimized: notesHelpers.getState().isMinimized,
          onClick: () => {
            if (notesHelpers.getState().isMinimized) {
              notesHelpers.restore();
              bringToFront('notes');
            } else if (notesHelpers.getState().isOpen) {
              bringToFront('notes');
            } else {
              notesHelpers.open();
              bringToFront('notes');
            }
          }
        }),
        e(DockIcon, {
          key: 'dock-photoalbum',
          icon: PhotoIcon,
          label: 'Photos',
          isOpen: photoAlbumHelpers.getState().isOpen,
          isMinimized: photoAlbumHelpers.getState().isMinimized,
          onClick: () => {
            if (photoAlbumHelpers.getState().isMinimized) {
              photoAlbumHelpers.restore();
              bringToFront('photoAlbum');
            } else if (photoAlbumHelpers.getState().isOpen) {
              bringToFront('photoAlbum');
            } else {
              photoAlbumHelpers.open();
              bringToFront('photoAlbum');
            }
          }
        }),
        e(DockIcon, {
          key: 'dock-lookout',
          icon: LookoutIcon,
          label: 'Lookout',
          isOpen: lookoutHelpers.getState().isOpen,
          isMinimized: lookoutHelpers.getState().isMinimized,
          onClick: () => {
            if (lookoutHelpers.getState().isMinimized) {
              lookoutHelpers.restore();
              bringToFront('lookout');
            } else if (lookoutHelpers.getState().isOpen) {
              bringToFront('lookout');
            } else {
              lookoutHelpers.open();
              bringToFront('lookout');
            }
          }
        }),
        e(DockIcon, {
          key: 'dock-browser',
          icon: BrowserIcon,
          label: 'Browser',
          isOpen: browserHelpers.getState().isOpen,
          isMinimized: browserHelpers.getState().isMinimized,
          onClick: () => {
            if (browserHelpers.getState().isMinimized) {
              browserHelpers.restore();
              bringToFront('browser');
            } else if (browserHelpers.getState().isOpen) {
              bringToFront('browser');
            } else {
              browserHelpers.open();
              bringToFront('browser');
            }
          }
        }),
        e(DockIcon, {
          key: 'dock-mediaplayer',
          icon: MusicIcon,
          label: 'Media Player',
          isOpen: mediaPlayerHelpers.getState().isOpen,
          isMinimized: mediaPlayerHelpers.getState().isMinimized,
          onClick: () => {
            if (mediaPlayerHelpers.getState().isMinimized) {
              mediaPlayerHelpers.restore();
              bringToFront('mediaPlayer');
            } else if (mediaPlayerHelpers.getState().isOpen) {
              bringToFront('mediaPlayer');
            } else {
              mediaPlayerHelpers.open();
              bringToFront('mediaPlayer');
            }
          }
        }),
        e(DockIcon, {
          key: 'dock-pdfviewer',
          icon: PDFIcon,
          label: 'Documents',
          isOpen: pdfViewerHelpers.getState().isOpen,
          isMinimized: pdfViewerHelpers.getState().isMinimized,
          onClick: () => {
            if (pdfViewerHelpers.getState().isMinimized) {
              pdfViewerHelpers.restore();
              bringToFront('pdfViewer');
            } else if (pdfViewerHelpers.getState().isOpen) {
              bringToFront('pdfViewer');
            } else {
              pdfViewerHelpers.open();
              bringToFront('pdfViewer');
            }
          }
        })
      ])
    )
  ]);
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(DesktopInterface));