// js/components/PhotoAlbumWindow.js
const { useState } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';
import { PhotoIcon } from '../icons/PhotoIcon.js';

// Mock data - replace with your story's photos
const albums = [
  { id: 'unexplainable phenomenon', name: 'unexplainable phenomenon', count: 4 },
  { id: 'retreat', name: 'retreat', count: 13 },
  { id: 'summer', name: 'summer', count: 3 },
  //{ id: 'all', name: 'All Photos', count: 6 }
];

const photos = [
  { id: 1, album: 'unexplainable phenomenon', src: './Pictures/richarscarry.jpg', caption: '', date: '2024-10-27' },
  { id: 2, album : 'unexplainable phenomenon', src: './Pictures/bedraggled.jpg', caption: '', date: '2024-09-25' },
  { id: 3, album: 'unexplainable phenomenon', src: './Pictures/redOrbGetTogether.jpg', caption: 'femininomenon', date: '2022-01-01' },
  { id: 4, album: 'unexplainable phenomenon', src: './Pictures/angel.jpg', caption: '', date: '2022-01-01' },
  { id: 5, album: 'retreat', src: './Pictures/snowy_day.jpg', caption: '', date: '2024-01-13' },
  { id: 6, album: 'retreat', src: './Pictures/snowy_walk.jpg', caption: '', date: '2024-01-13' }, 
  { id: 7, album: 'retreat', src: './Pictures/steak_dinner.jpg', caption: '', date: '2024-01-13' },
  { id: 8, album: 'retreat', src: './Pictures/cremebrulee.jpg', caption: '', date: '2024-01-13' },
  { id: 9, album: 'retreat', src: './Pictures/bird_snow_tracks2.jpg', caption: '', date: '2024-01-14' },
  { id: 10, album: 'retreat', src: './Pictures/bird_snow_zoom.jpg', caption: '', date: '2024-01-14' },
  { id: 11, album: 'retreat', src: './Pictures/death_mushrooms.jpg', caption: '', date: '2024-01-14' },
  { id: 12, album: 'retreat', src: './Pictures/ruth_asawa.jpg', caption: '', date: '2024-01-14' },
  { id: 13, album: 'retreat', src: './Pictures/milo.jpg', caption: '', date: '2024-01-14' },
  { id: 14, album: 'retreat', src: './Pictures/coffee.jpg', caption: '', date: '2024-01-14' },
  { id: 15, album: 'retreat', src: './Pictures/pork_roast.jpg', caption: '', date: '2024-01-14' },
  { id: 16, album: 'retreat', src: './Pictures/red_dessert.jpg', caption: '', date: '2024-01-14' },
  { id: 17, album: 'retreat', src: './Pictures/snowboard.jpg', caption: '', date: '2024-01-14' },
  { id: 17, album: 'summer', src: './Pictures/shadowpeople.jpg', caption: '', date: '2024-07-24' },
  { id: 18, album: 'summer', src: './Pictures/myaloha.jpg', caption: '', date: '2024-08-01' },
  { id: 19, album: 'summer', src: './Pictures/birdsintree.jpg', caption: '', date: '2024-08-02' }
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

// Photo Album Content Component - Separated from window frame
const PhotoAlbumContent = ({ isMaximized, windowSize }) => {
  const [selectedAlbum, setSelectedAlbum] = useState('All Photos');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos = selectedAlbum === 'All Photos' 
    ? photos 
    : photos.filter(photo => photo.album === selectedAlbum.toLowerCase());

  return e('div', {
    className: 'flex h-full'
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
    ),

    // Photo Modal
    selectedPhoto && e(PhotoModal, {
      photo: selectedPhoto,
      onClose: () => setSelectedPhoto(null)
    })
  ]);
};

// Main PhotoAlbumWindow component using the WindowFrame
export const PhotoAlbumWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for photo album (optional)
  const photoAlbumTheme = {
    titleBarBg: 'bg-blue-50',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-yellow-500 hover:bg-yellow-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-blue-200'
  };

  return e(WindowFrame, {
    title: 'Photo Album',
    initialPosition: { x: 200, y: 50 },
    initialSize: { width: 800, height: 500 },
    minSize: { width: 400, height: 300 },
    onClose,
    onMinimize,
    isMinimized,
    theme: photoAlbumTheme
  }, 
    e(PhotoAlbumContent)
  );
};