// js/components/MediaPlayerWindow.js
const { useState, useRef, useEffect } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Mock music data for local files
const mockPlaylists = [
  { id: 'favorites', name: 'Favorites', count: 3 },
  { id: 'recent', name: 'Recently Played', count: 2 },
];

const mockTracks = [
  { 
    id: 1, 
    playlist: 'favorites', 
    title: 'Haunted Dreams', 
    artist: 'Ghost Notes', 
    album: 'Ethereal Whispers',
    coverArt: './Music/covers/haunted_dreams.jpg',
    source: './Music/haunted_dreams.mp3',
    duration: 183 // in seconds
  },
  { 
    id: 2, 
    playlist: 'favorites', 
    title: 'Silent Echo', 
    artist: 'Midnight Pulse', 
    album: 'Reverberations',
    coverArt: './Music/covers/silent_echo.jpg',
    source: './Music/silent_echo.mp3',
    duration: 214
  },
  { 
    id: 3, 
    playlist: 'favorites', 
    title: 'Digital Sunset', 
    artist: 'The Algorithm', 
    album: 'Binary Horizon',
    coverArt: './Music/covers/digital_sunset.jpg',
    source: './Music/digital_sunset.mp3',
    duration: 247
  },
  { 
    id: 4, 
    playlist: 'recent', 
    title: 'Last Transmission', 
    artist: 'Quantum Signal', 
    album: 'Lost Frequencies',
    coverArt: './Music/covers/last_transmission.jpg',
    source: './Music/last_transmission.mp3',
    duration: 192
  },
  { 
    id: 5, 
    playlist: 'recent', 
    title: 'Encrypted Memories', 
    artist: 'Neural Network', 
    album: 'Deep Learning',
    coverArt: './Music/covers/encrypted_memories.jpg',
    source: './Music/encrypted_memories.mp3',
    duration: 228
  }
];

// SoundCloud playlists data
const soundcloudPlaylists = [
  {
    id: 'sweet-dreams',
    name: 'Sweet Dreams',
    tracks: [
      {
        id: 'sd-1',
        title: 'Stardew Valley OST',
        artist: 'The_Professa',
        url: 'https://soundcloud.com/user-153780178/sets/stardew-valley-ost'
      },
      {
        id: 'sd-2',
        title: 'I Sing Myself 2 Sleep',
        artist: 'Elijah Scarlett',
        url: 'https://soundcloud.com/elijahscarlett/i-sing-myself-2-sleep'
      },
      {
        id: 'sd-3',
        title: 'Okay But This Is The Last Time',
        artist: 'Mt. Marcy',
        url: 'https://soundcloud.com/mt-marcy/okay-but-this-is-the-last-time'
      },
      {
        id: 'sd-4',
        title: 'Seasons Beattape',
        artist: 'Wun Two',
        url: 'https://soundcloud.com/wun-two/seasons-beattape'
      }
    ]
  },
  {
    id: 'upside-triangle',
    name: 'Upside Triangle',
    tracks: [
      {
        id: 'ut-1',
        title: 'Flickermood',
        artist: 'Forss',
        url: 'https://soundcloud.com/forss/flickermood'
      },
      {
        id: 'ut-2',
        title: 'Time is the Enemy',
        artist: 'Quantic',
        url: 'https://soundcloud.com/quantic/time-is-the-enemy'
      },
      {
        id: 'ut-3',
        title: 'Krystyna',
        artist: 'Ptaki',
        url: 'https://soundcloud.com/polishcutouts/ptaki-krystyna'
      },
      {
        id: 'ut-4',
        title: 'Beatroots Meets Brujos Bowl',
        artist: 'Brujos Bowl',
        url: 'https://soundcloud.com/brujosbowl/beatroots-meets-brujos-bowl'
      }
    ]
  }
];

// Helper to format time (seconds to MM:SS)
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Media Player Content Component
const MediaPlayerContent = ({ isMaximized, windowSize }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState('favorites');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showSoundcloud, setShowSoundcloud] = useState(false);
  const [soundcloudUrl, setSoundcloudUrl] = useState('');
  const [selectedSoundcloudPlaylist, setSelectedSoundcloudPlaylist] = useState('sweet-dreams');
  const [loadedSoundcloudTracks, setLoadedSoundcloudTracks] = useState([]);
  const [currentSoundcloudTrack, setCurrentSoundcloudTrack] = useState(null);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const iframeRef = useRef(null);

  // Filter tracks by selected playlist
  const filteredTracks = mockTracks.filter(track => track.playlist === selectedPlaylist);
  
  // Get tracks for the selected SoundCloud playlist
  const soundcloudTracks = soundcloudPlaylists.find(p => p.id === selectedSoundcloudPlaylist)?.tracks || [];

  useEffect(() => {
    // Set up audio element event listeners
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const timeUpdateHandler = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const endedHandler = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        // Auto play next track
        if (currentTrack) {
          const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
          if (currentIndex < filteredTracks.length - 1) {
            const nextTrack = filteredTracks[currentIndex + 1];
            handleTrackSelect(nextTrack);
          }
        }
      };
      
      audio.addEventListener('timeupdate', timeUpdateHandler);
      audio.addEventListener('ended', endedHandler);
      
      return () => {
        audio.removeEventListener('timeupdate', timeUpdateHandler);
        audio.removeEventListener('ended', endedHandler);
      };
    }
  }, [currentTrack, filteredTracks]);

  // Handle track selection
  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
    
    // Need to wait for state to update and for the audio element to be ready
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error('Playback error:', err);
          setIsPlaying(false);
        });
      }
    }, 0);
  };

  // Play/pause toggle
  const togglePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Playback error:', err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!currentTrack || !audioRef.current) return;
    
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * currentTrack.duration;
    
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Load Soundcloud URL
  const handleSoundcloudSubmit = (e) => {
    e.preventDefault();
    
    if (!soundcloudUrl) return;
    
    // Check if URL is already in history
    const existingTrack = loadedSoundcloudTracks.find(track => track.url === soundcloudUrl);
    
    if (!existingTrack) {
      // Extract title from URL (simplified for demo)
      const urlParts = soundcloudUrl.split('/');
      const title = urlParts[urlParts.length - 1].replace(/-/g, ' ');
      const artist = urlParts[urlParts.length - 2];
      
      const newTrack = {
        id: `custom-${Date.now()}`,
        title: title,
        artist: artist,
        url: soundcloudUrl,
        timestamp: new Date().toISOString()
      };
      
      setLoadedSoundcloudTracks(prev => [newTrack, ...prev]);
      setCurrentSoundcloudTrack(newTrack);
    } else {
      setCurrentSoundcloudTrack(existingTrack);
    }
    
    setSoundcloudUrl('');
  };

  // Load a SoundCloud track from playlist or history
  const handleSoundcloudTrackSelect = (track) => {
    // If it's not already in history, add it
    if (!loadedSoundcloudTracks.some(t => t.url === track.url)) {
      setLoadedSoundcloudTracks(prev => [
        {
          ...track,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }
    
    setCurrentSoundcloudTrack(track);
  };

  return e('div', {
    className: 'flex h-full bg-gray-900 text-white'
  }, [
    // Sidebar with playlists
    e('div', {
      key: 'sidebar',
      className: 'w-56 border-r border-gray-800 p-4 overflow-y-auto'
    }, [
      // Toggle between local and Soundcloud
      e('div', {
        key: 'source-toggle',
        className: 'mb-4 flex justify-center'
      }, [
        e('button', {
          key: 'local-btn',
          className: `px-3 py-1 rounded-l ${!showSoundcloud ? 'bg-blue-600' : 'bg-gray-700'}`,
          onClick: () => setShowSoundcloud(false)
        }, 'Local'),
        e('button', {
          key: 'soundcloud-btn',
          className: `px-3 py-1 rounded-r ${showSoundcloud ? 'bg-blue-600' : 'bg-gray-700'}`,
          onClick: () => setShowSoundcloud(true)
        }, 'SoundCloud')
      ]),
      
      // If Soundcloud view, show playlists + URL input
      showSoundcloud ? [
        e('form', {
          key: 'soundcloud-form',
          className: 'mb-4',
          onSubmit: handleSoundcloudSubmit
        }, [
          e('input', {
            key: 'soundcloud-input',
            type: 'text',
            placeholder: 'Paste Soundcloud URL',
            value: soundcloudUrl,
            onChange: (e) => setSoundcloudUrl(e.target.value),
            className: 'w-full p-2 bg-gray-800 rounded mb-2 text-sm'
          }),
          e('button', {
            key: 'soundcloud-submit',
            type: 'submit',
            className: 'w-full bg-orange-600 py-1 rounded text-sm'
          }, 'Load Track')
        ]),
        
        // SoundCloud Playlists
        e('h3', {
          key: 'sc-playlists-title',
          className: 'font-medium mb-2 text-gray-400 text-sm uppercase'
        }, 'Playlists'),
        
        e('div', {
          key: 'sc-playlists',
          className: 'space-y-1 mb-4'
        }, soundcloudPlaylists.map(playlist => 
          e('button', {
            key: playlist.id,
            onClick: () => setSelectedSoundcloudPlaylist(playlist.id),
            className: `w-full text-left px-3 py-2 rounded ${
              selectedSoundcloudPlaylist === playlist.id 
                ? 'bg-blue-800 text-white' 
                : 'hover:bg-gray-800'
            }`
          }, [
            e('span', {
              key: 'name',
              className: 'block font-medium text-sm'
            }, playlist.name),
            e('span', {
              key: 'count',
              className: `text-xs ${selectedSoundcloudPlaylist === playlist.id ? 'text-blue-200' : 'text-gray-500'}`
            }, `${playlist.tracks.length} tracks`)
          ])
        )),
        
        // Recently loaded tracks
        loadedSoundcloudTracks.length > 0 && e('div', {
          key: 'recent-sc-tracks',
          className: 'mt-4'
        }, [
          e('h3', {
            key: 'recent-title',
            className: 'font-medium mb-2 text-gray-400 text-sm uppercase'
          }, 'Recently Loaded'),
          e('div', {
            key: 'recent-list',
            className: 'space-y-1'
          }, loadedSoundcloudTracks.slice(0, 5).map(track => 
            e('button', {
              key: track.id,
              onClick: () => handleSoundcloudTrackSelect(track),
              className: `w-full text-left px-3 py-2 rounded text-sm ${
                currentSoundcloudTrack && currentSoundcloudTrack.url === track.url 
                  ? 'bg-blue-800 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`
            }, [
              e('div', { className: 'font-medium truncate', key: 'title' }, track.title),
              e('div', { className: 'text-xs text-gray-400 truncate', key: 'artist' }, track.artist)
            ])
          ))
        ])
      ] : [
        // Local music playlists
        e('h3', {
          key: 'playlists-title',
          className: 'font-medium mb-2 text-gray-400 text-sm uppercase'
        }, 'Playlists'),
        e('div', {
          key: 'playlists',
          className: 'space-y-1'
        }, mockPlaylists.map(playlist => 
          e('button', {
            key: playlist.id,
            onClick: () => setSelectedPlaylist(playlist.id),
            className: `w-full text-left px-3 py-2 rounded ${
              selectedPlaylist === playlist.id 
                ? 'bg-blue-800 text-white' 
                : 'hover:bg-gray-800'
            }`
          }, [
            e('span', {
              key: 'name',
              className: 'block font-medium text-sm'
            }, playlist.name),
            e('span', {
              key: 'count',
              className: `text-xs ${selectedPlaylist === playlist.id ? 'text-blue-200' : 'text-gray-500'}`
            }, `${playlist.count} tracks`)
          ])
        ))
      ]
    ]),
    
    // Main content area
    e('div', {
      key: 'main-content',
      className: 'flex-1 flex flex-col'
    }, [
      // Current track info (only if playing local music)
      !showSoundcloud && currentTrack && e('div', {
        key: 'now-playing',
        className: 'p-4 border-b border-gray-800 flex items-center'
      }, [
        // Album art
        e('div', {
          key: 'cover-art',
          className: 'w-16 h-16 bg-gray-800 rounded mr-4 flex-shrink-0 overflow-hidden'
        }, 
          e('img', {
            src: currentTrack.coverArt,
            alt: `${currentTrack.album} cover`,
            className: 'w-full h-full object-cover'
          })
        ),
        // Track info
        e('div', {
          key: 'track-info',
          className: 'flex-1'
        }, [
          e('div', {
            key: 'title',
            className: 'font-medium text-lg'
          }, currentTrack.title),
          e('div', {
            key: 'artist-album',
            className: 'text-sm text-gray-400'
          }, `${currentTrack.artist} • ${currentTrack.album}`)
        ])
      ]),
      
      // Song list or SoundCloud playlist view
      showSoundcloud ? 
        // SoundCloud content - split view with player at bottom and list above
        e('div', {
          key: 'soundcloud-container',
          className: 'flex-1 flex flex-col'
        }, [
          // Playlist header and tracks - flex-1 to take remaining space
          e('div', {
            key: 'soundcloud-list',
            className: 'flex-1 overflow-y-auto'
          }, [
            e('div', {
              key: 'playlist-header',
              className: 'p-4 border-b border-gray-800'
            }, [
              e('h2', {
                className: 'text-xl font-medium'
              }, soundcloudPlaylists.find(p => p.id === selectedSoundcloudPlaylist)?.name || 'Playlist'),
              e('p', {
                className: 'text-sm text-gray-400'
              }, `${soundcloudTracks.length} tracks`)
            ]),
            e('div', {
              key: 'track-list',
              className: 'divide-y divide-gray-800'
            }, soundcloudTracks.map((track, index) => 
              e('div', {
                key: track.id,
                className: `p-4 hover:bg-gray-800 cursor-pointer ${
                  currentSoundcloudTrack && currentSoundcloudTrack.url === track.url ? 'bg-gray-800' : ''
                }`,
                onClick: () => handleSoundcloudTrackSelect(track)
              }, [
                e('div', {
                  key: 'track-number',
                  className: 'flex items-center'
                }, [
                  e('span', {
                    className: 'w-6 text-gray-500'
                  }, index + 1),
                  e('div', {
                    className: 'ml-2'
                  }, [
                    e('div', {
                      key: 'track-title',
                      className: 'font-medium'
                    }, track.title),
                    e('div', {
                      key: 'track-artist',
                      className: 'text-sm text-gray-400'
                    }, track.artist)
                  ])
                ])
              ])
            ))
          ]),
          
          // SoundCloud player fixed at bottom - only shown when a track is selected
          currentSoundcloudTrack && e('div', {
            key: 'soundcloud-player',
            className: 'h-28 border-t border-gray-800'
          }, [
            // Now playing info bar
            e('div', {
              key: 'sc-now-playing',
              className: 'px-4 py-2 bg-gray-800 flex justify-between items-center'
            }, [
              e('div', {
                key: 'track-info',
                className: 'flex-1'
              }, [
                e('div', {
                  key: 'now-playing-label',
                  className: 'text-xs text-gray-400'
                }, 'NOW PLAYING'),
                e('div', {
                  key: 'track-title',
                  className: 'font-medium truncate'
                }, currentSoundcloudTrack.title),
                e('div', {
                  key: 'track-artist',
                  className: 'text-sm text-gray-400'
                }, currentSoundcloudTrack.artist)
              ])
            ]),
            
            // Embedded player - hidden but functional
            e('div', {
              key: 'player-container',
              className: 'relative h-14' // Reduced height
            }, [
              e('iframe', {
                ref: iframeRef,
                width: '100%',
                height: '100%',
                scrolling: 'no',
                frameBorder: 'no',
                allow: 'autoplay',
                src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(currentSoundcloudTrack.url)}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
                className: 'absolute inset-0'
              })
            ])
          ])
        ])
      : 
        // Local Music Tracks List
        e('div', {
          key: 'tracks-list',
          className: 'flex-1 overflow-y-auto'
        }, 
          e('table', {
            className: 'w-full border-collapse'
          }, [
            e('thead', {
              key: 'table-header',
              className: 'text-left text-sm text-gray-400 border-b border-gray-800'
            }, 
              e('tr', {}, [
                e('th', { key: 'header-num', className: 'p-4 w-12' }, '#'),
                e('th', { key: 'header-title', className: 'p-4' }, 'Title'),
                e('th', { key: 'header-artist', className: 'p-4' }, 'Artist'),
                e('th', { key: 'header-album', className: 'p-4' }, 'Album'),
                e('th', { key: 'header-duration', className: 'p-4 text-right w-24' }, 'Duration')
              ])
            ),
            e('tbody', {
              key: 'table-body'
            }, filteredTracks.map((track, index) => 
              e('tr', {
                key: track.id,
                className: `hover:bg-gray-800 cursor-pointer ${currentTrack && currentTrack.id === track.id ? 'bg-gray-800' : ''}`,
                onClick: () => handleTrackSelect(track)
              }, [
                e('td', { 
                  key: 'cell-num', 
                  className: 'p-4 text-gray-400'
                }, index + 1),
                e('td', { 
                  key: 'cell-title', 
                  className: 'p-4 font-medium'
                }, track.title),
                e('td', { 
                  key: 'cell-artist', 
                  className: 'p-4 text-gray-300'
                }, track.artist),
                e('td', { 
                  key: 'cell-album', 
                  className: 'p-4 text-gray-300'
                }, track.album),
                e('td', { 
                  key: 'cell-duration', 
                  className: 'p-4 text-right text-gray-400'
                }, formatTime(track.duration))
              ])
            ))
          ])
        ),
      
      // Player controls (only for local music)
      !showSoundcloud && e('div', {
        key: 'player-controls',
        className: 'p-4 border-t border-gray-800'
      }, [
        // Progress bar
        e('div', {
          key: 'progress',
          className: 'mb-2 relative h-1 bg-gray-800 rounded cursor-pointer',
          ref: progressRef,
          onClick: handleProgressClick
        }, 
          currentTrack && e('div', {
            className: 'absolute top-0 left-0 h-full bg-blue-600 rounded',
            style: { width: `${currentTrack ? (currentTime / currentTrack.duration) * 100 : 0}%` }
          })
        ),
        
        // Time indicators
        e('div', {
          key: 'time-indicators',
          className: 'flex justify-between text-xs text-gray-400 mb-4'
        }, [
          e('span', { key: 'current-time' }, formatTime(currentTime)),
          e('span', { key: 'total-time' }, currentTrack ? formatTime(currentTrack.duration) : '0:00')
        ]),
        
        // Control buttons
        e('div', {
          key: 'controls',
          className: 'flex items-center justify-between'
        }, [
          // Left controls (previous)
          e('button', {
            key: 'prev-button',
            className: 'text-gray-400 hover:text-white p-2',
            onClick: () => {
              if (!currentTrack) return;
              const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
              if (currentIndex > 0) {
                handleTrackSelect(filteredTracks[currentIndex - 1]);
              }
            }
          }, 
            e('svg', {
              width: '24',
              height: '24',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            }, [
              e('path', { key: 'path1', d: 'M19 20L9 12l10-8v16z' }),
              e('path', { key: 'path2', d: 'M5 19V5' })
            ])
          ),
          
          // Center controls (play/pause)
          e('button', {
            key: 'play-pause-button',
            className: 'bg-blue-600 hover:bg-blue-700 rounded-full p-3 mx-4',
            onClick: togglePlayPause,
            disabled: !currentTrack
          }, 
            isPlaying ? 
              // Pause icon
              e('svg', {
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              }, [
                e('rect', { key: 'rect1', x: '6', y: '4', width: '4', height: '16' }),
                e('rect', { key: 'rect2', x: '14', y: '4', width: '4', height: '16' })
              ])
            : 
              // Play icon
              e('svg', {
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                e('polygon', { points: '5 3 19 12 5 21 5 3' })
              )
          ),
          
          // Right controls (next)
          e('button', {
            key: 'next-button',
            className: 'text-gray-400 hover:text-white p-2',
            onClick: () => {
              if (!currentTrack) return;
              const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
              if (currentIndex < filteredTracks.length - 1) {
                handleTrackSelect(filteredTracks[currentIndex + 1]);
              }
            }
          }, 
            e('svg', {
              width: '24',
              height: '24',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            }, [
              e('path', { key: 'path1', d: 'M5 4l10 8-10 8V4z' }),
              e('path', { key: 'path2', d: 'M19 5v14' })
            ])
          ),
          
          // Volume control
          e('div', {
            key: 'volume-control',
            className: 'flex items-center ml-6'
          }, [
            e('svg', {
              key: 'volume-icon',
              width: '20',
              height: '20',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              className: 'text-gray-400 mr-2'
            }, [
              e('polygon', { key: 'poly', points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' }),
              volume > 0 && e('path', { key: 'path1', d: 'M15.54 8.46a5 5 0 0 1 0 7.07' }),
              volume > 0.5 && e('path', { key: 'path2', d: 'M19.07 4.93a10 10 0 0 1 0 14.14' })
            ]),
            e('input', {
              key: 'volume-slider',
              type: 'range',
              min: 0,
              max: 1,
              step: 0.01,
              value: volume,
              onChange: handleVolumeChange,
              className: 'w-20'
            })
          ])
        ])
      ]),
      
      // Hidden audio element
      e('audio', {
        key: 'audio-element',
        ref: audioRef,
        src: currentTrack ? currentTrack.source : '',
        className: 'hidden'
      })
    ])
  ]);
};

// Main MediaPlayerWindow component using the WindowFrame
export const MediaPlayerWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for media player
  const mediaPlayerTheme = {
    titleBarBg: 'bg-gradient-to-r from-purple-900 to-blue-900',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-yellow-500 hover:bg-yellow-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-purple-900'
  };

  return e(WindowFrame, {
    title: 'Media Player',
    initialPosition: { x: 350, y: 150 },
    initialSize: { width: 900, height: 550 },
    minSize: { width: 400, height: 300 },
    onClose,
    onMinimize,
    isMinimized,
    theme: mediaPlayerTheme
  }, 
    e(MediaPlayerContent)
  );
};