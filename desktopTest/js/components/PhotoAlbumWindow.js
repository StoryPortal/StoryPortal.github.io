const { useState } = React;
const { createElement: e } = React;

import { DraggableWindow } from './DraggableWindow.js';
import { PhotoIcon } from '../icons/PhotoIcon.js';

// Mock data - replace with your story's photos
const albums = [
  { id: 'all', name: 'All Photos', count: 6 },
  { id: 'family', name: 'Family', count: 2 },
  { id: 'vacation', name: 'Vacation', count: 2 },
  { id: 'work', name: 'Work', count: 2 }
];

const photos = [
  { id: 1, album: 'family', src: './Pictures/bottomsUpForest.jpg', caption: 'Family Dinner', date: '2024-01-15' },
  { id: 2, album: 'family', src: '/api/placeholder/400/300', caption: 'Birthday Party', date: '2024-02-01' },
  { id: 3, album: 'vacation', src: '/api/placeholder/400/300', caption: 'Beach sunset', date: '2024-02-15' },
  { id: 4, album: 'vacation', src: '/api/placeholder/400/300', caption: 'Mountain hike', date: '2024-02-16' },
  { id: 5, album: 'work', src: '/api/placeholder/400/300', caption: 'Office meeting', date: '2024-02-20' },
  { id: 6, album: 'work', src: '/api/placeholder/400/300', caption: 'Team lunch', date: '2024-02-21' }
];

const PhotoModal = ({ photo, onClose }) => {
  if (!photo) return null;
  
  return e('div', {
    className: 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50',
    onClick: onClose
  },
    e('div', {
      className: 'bg-white p-4 rounded-lg max-w-2xl',
      onClick: e => e.stopPropagation()
    }, [
      e('img', {
        key: 'modal-image',
        src: photo.src,
        alt: photo.caption,
        className: 'w-full h-auto rounded'
      }),
      e('div', {
        key: 'modal-info',
        className: 'mt-4'
      }, [
        e('h3', {
          key: 'modal-caption',
          className: 'text-lg font-medium'
        }, photo.caption),
        e('p', {
          key: 'modal-date',
          className: 'text-sm text-gray-500'
        }, new Date(photo.date).toLocaleDateString())
      ])
    ])
  );
};

export const PhotoAlbumWindow = ({ onClose }) => {
  const [selectedAlbum, setSelectedAlbum] = useState('All Photos');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos = selectedAlbum === 'All Photos' 
    ? photos 
    : photos.filter(photo => photo.album === selectedAlbum.toLowerCase());

  return e(DraggableWindow, {
    onClose,
    initialPosition: { x: 200, y: 50 }
  }, [
    // Window Title Bar
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
        }, 'Photo Album')
      ])
    ),
    
    // Main Content Area
    e('div', {
      key: 'content',
      className: 'flex h-96'
    }, [
      // Albums Sidebar
      e('div', {
        key: 'sidebar',
        className: 'w-48 border-r border-gray-200 p-4 overflow-y-auto'
      },
        e('div', {
          className: 'space-y-2'
        },
          albums.map(album => 
            e('button', {
              key: album.id,
              onClick: () => setSelectedAlbum(album.name),
              className: `w-full text-left px-3 py-2 rounded ${
                selectedAlbum === album.name 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-100'
              }`
            }, [
              e('span', {
                key: 'name',
                className: 'block font-medium'
              }, album.name),
              e('span', {
                key: 'count',
                className: `text-sm ${selectedAlbum === album.name ? 'text-blue-100' : 'text-gray-500'}`
              }, `${album.count} photos`)
            ])
          )
        )
      ),
      
      // Photos Grid
      e('div', {
        key: 'photos-grid',
        className: 'flex-1 p-4 overflow-y-auto'
      },
        e('div', {
          className: 'grid grid-cols-3 gap-4'
        },
          filteredPhotos.map(photo => 
            e('div', {
              key: photo.id,
              className: 'relative group cursor-pointer',
              onClick: () => setSelectedPhoto(photo)
            }, [
              e('img', {
                key: 'image',
                src: photo.src,
                alt: photo.caption,
                className: 'w-full h-32 object-cover rounded-lg'
              }),
              e('div', {
                key: 'overlay',
                className: 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition-opacity rounded-lg'
              }),
              e('div', {
                key: 'caption',
                className: 'absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity'
              },
                e('span', {
                  className: 'text-white text-sm'
                }, photo.caption)
              )
            ])
          )
        )
      )
    ]),

    // Photo Modal
    selectedPhoto && e(PhotoModal, {
      photo: selectedPhoto,
      onClose: () => setSelectedPhoto(null)
    })
  ]);
};