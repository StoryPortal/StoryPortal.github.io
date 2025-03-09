// js/components/MediaPlayerWindow.js
const { useState, useRef, useEffect } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

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
        url: 'https://soundcloud.com/user-153780178/sets/stardew-valley-ost',
        artworkUrl: './Music/covers/stardew.jpg',
        duration: 3720
      },
      {
        id: 'sd-2',
        title: 'I Sing Myself 2 Sleep',
        artist: 'Elijah Scarlett',
        url: 'https://soundcloud.com/elijahscarlett/i-sing-myself-2-sleep',
        artworkUrl: './Music/covers/sleep.jpg',
        duration: 178
      },
      {
        id: 'sd-3',
        title: 'Okay But This Is The Last Time',
        artist: 'Mt. Marcy',
        url: 'https://soundcloud.com/mt-marcy/okay-but-this-is-the-last-time',
        artworkUrl: './Music/covers/lasttime.jpg',
        duration: 154
      },
      {
        id: 'sd-4',
        title: 'Seasons Beattape',
        artist: 'Wun Two',
        url: 'https://soundcloud.com/wun-two/seasons-beattape',
        artworkUrl: './Music/covers/seasons.jpg',
        duration: 900
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
        url: 'https://soundcloud.com/forss/flickermood',
        artworkUrl: './Music/covers/flickermood.jpg',
        duration: 245
      },
      {
        id: 'ut-2',
        title: 'Time is the Enemy',
        artist: 'Quantic',
        url: 'https://soundcloud.com/quantic/time-is-the-enemy',
        artworkUrl: './Music/covers/time_enemy.jpg',
        duration: 212
      },
      {
        id: 'ut-3',
        title: 'Krystyna',
        artist: 'Ptaki',
        url: 'https://soundcloud.com/polishcutouts/ptaki-krystyna',
        artworkUrl: './Music/covers/krystyna.jpg',
        duration: 338
      },
      {
        id: 'ut-4',
        title: 'Beatroots Meets Brujos Bowl',
        artist: 'Brujos Bowl',
        url: 'https://soundcloud.com/brujosbowl/beatroots-meets-brujos-bowl',
        artworkUrl: './Music/covers/beatroots.jpg',
        duration: 256
      }
    ]
  },
  {
    id: 'late-night',
    name: 'Late Night',
    tracks: [
      {
        id: 'ln-1',
        title: 'Nocturnal',
        artist: 'Disclosure',
        url: 'https://soundcloud.com/disclosure/nocturnal',
        artworkUrl: './Music/covers/nocturnal.jpg',
        duration: 294
      },
      {
        id: 'ln-2',
        title: 'Out of My System',
        artist: 'Bonobo',
        url: 'https://soundcloud.com/bonobo/out-of-my-system',
        artworkUrl: './Music/covers/system.jpg',
        duration: 319
      },
      {
        id: 'ln-3',
        title: 'Midnight City',
        artist: 'M83',
        url: 'https://soundcloud.com/m83/midnight-city',
        artworkUrl: './Music/covers/midnight.jpg',
        duration: 241
      }
    ]
  }
];

// Helper to format time (seconds to MM:SS)
const formatTime = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Visualizer Component
const Visualizer = ({ isPlaying, currentTime }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastBarsRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const bars = 16; // Number of bars
    const gap = 2; // Gap between bars
    const barWidth = (canvas.width - (bars - 1) * gap) / bars;
    
    // Initialize lastBars if not set
    if (!lastBarsRef.current) {
      lastBarsRef.current = Array(bars).fill(0.1);
    }
    
    const drawVisualizer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (isPlaying) {
        // Generate bars heights with a mix of time-based and random values
        const newBars = [];
        
        for (let i = 0; i < bars; i++) {
          // Different formulas for each group of bars to create varied movement
          let nextHeight;
          
          if (i % 4 === 0) {
            // Bass frequencies - more dramatic, slower changes
            nextHeight = Math.abs(Math.sin(currentTime * 2.1 + i * 0.3)) * 0.7 + 0.2;
            // Add random spike occasionally for bass beat simulation
            if (Math.random() < 0.03) nextHeight = 0.9;
          } else if (i % 3 === 0) {
            // Mid frequencies - moderate changes
            nextHeight = Math.abs(Math.sin(currentTime * 3.3 + i * 0.5)) * 0.6 + 0.3;
            if (Math.random() < 0.05) nextHeight *= 1.3;
          } else if (i % 2 === 0) {
            // High-mid frequencies
            nextHeight = Math.abs(Math.cos(currentTime * 4.2 + i * 0.7)) * 0.5 + 0.3;
            if (Math.random() < 0.08) nextHeight *= 1.2;
          } else {
            // High frequencies - more rapid changes
            nextHeight = Math.abs(Math.sin(currentTime * 5.5 + i * 1.1)) * 0.4 + 0.2;
            if (Math.random() < 0.1) nextHeight *= 1.4;
          }
          
          // Add some random spikes for more natural look
          if (Math.random() < 0.02) {
            nextHeight = Math.min(0.9, nextHeight * (1.5 + Math.random()));
          }
          
          // Smooth transition from previous state (inertia effect)
          const lastHeight = lastBarsRef.current[i];
          const smoothingFactor = 0.3; // Lower = smoother transition
          const smoothedHeight = lastHeight + smoothingFactor * (nextHeight - lastHeight);
          
          newBars.push(smoothedHeight);
          
          // Draw the bar
          const height = smoothedHeight * canvas.height;
          
          // Gradient coloring based on height
          const greenIntensity = Math.floor(170 + smoothedHeight * 85);
          ctx.fillStyle = `rgb(0, ${greenIntensity}, 0)`;
          
          ctx.fillRect(
            i * (barWidth + gap),
            canvas.height - height,
            barWidth,
            height
          );
        }
        
        // Save the current bars for the next frame
        lastBarsRef.current = newBars;
      } else {
        // Static low bars when not playing, with gentle movement
        for (let i = 0; i < bars; i++) {
          // Gentle idle animation
          const time = Date.now() / 1000;
          const height = (Math.sin(time * 0.5 + i * 0.4) * 0.05 + 0.1) * canvas.height;
          ctx.fillStyle = i % 2 === 0 ? '#1a5c1a' : '#0d3d0d';
          ctx.fillRect(
            i * (barWidth + gap),
            canvas.height - height,
            barWidth,
            height
          );
        }
      }
      
      animationRef.current = requestAnimationFrame(drawVisualizer);
    };
    
    drawVisualizer();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime]);
  
  return e('canvas', {
    ref: canvasRef,
    width: 250,
    height: 50,
    className: 'border border-gray-800'
  });
};

// Equalizer Component with animated sliders
const Equalizer = ({ isPlaying, currentTime }) => {
  const [eqValues, setEqValues] = useState({
    preamp: 50,
    band1: 50,
    band2: 60,
    band3: 70,
    band4: 55,
    band5: 45,
    band6: 60,
    band7: 65,
    band8: 45,
    band9: 50,
    band10: 40
  });
  
  // Animated values for auto-EQ mode
  const lastValuesRef = useRef(null);
  
  useEffect(() => {
    // Initialize last values if not set
    if (!lastValuesRef.current) {
      lastValuesRef.current = { ...eqValues };
    }
    
    if (!isPlaying) return;
    
    // Animation frame to update EQ values
    const animateEQ = () => {
      // New target values based on various rhythmic patterns
      const newTargets = {};
      
      // Different patterns for each frequency band
      newTargets.band1 = 40 + Math.abs(Math.sin(currentTime * 0.8)) * 40; // Bass - slow rhythm
      newTargets.band2 = 30 + Math.abs(Math.sin(currentTime * 1.1 + 0.5)) * 50; // Bass
      newTargets.band3 = 40 + Math.abs(Math.sin(currentTime * 1.4 + 1.0)) * 35; // Low mid
      newTargets.band4 = 35 + Math.abs(Math.sin(currentTime * 1.7 + 1.5)) * 40; // Low mid
      newTargets.band5 = 45 + Math.abs(Math.sin(currentTime * 2.0 + 2.0)) * 30; // Mid
      newTargets.band6 = 50 + Math.abs(Math.sin(currentTime * 2.3 + 2.5)) * 25; // Mid
      newTargets.band7 = 40 + Math.abs(Math.sin(currentTime * 2.6 + 3.0)) * 35; // High mid
      newTargets.band8 = 35 + Math.abs(Math.sin(currentTime * 2.9 + 3.5)) * 40; // High mid
      newTargets.band9 = 30 + Math.abs(Math.sin(currentTime * 3.2 + 4.0)) * 30; // High
      newTargets.band10 = 25 + Math.abs(Math.sin(currentTime * 3.5 + 4.5)) * 40; // High
      
      // Add occasional randomized spikes to make it look more responsive
      const randomBand = 'band' + Math.floor(Math.random() * 10 + 1);
      if (Math.random() < 0.05) {
        newTargets[randomBand] = Math.min(90, newTargets[randomBand] * 1.5);
      }
      
      // Smooth transition to targets
      const smoothedValues = { ...eqValues };
      const smoothingFactor = 0.15; // Lower = smoother
      
      for (const band in newTargets) {
        if (eqValues.hasOwnProperty(band)) {
          smoothedValues[band] = Math.round(
            lastValuesRef.current[band] + 
            smoothingFactor * (newTargets[band] - lastValuesRef.current[band])
          );
        }
      }
      
      // Keep preamp mostly stable
      smoothedValues.preamp = 50 + Math.sin(currentTime * 0.3) * 5;
      
      // Update last values
      lastValuesRef.current = smoothedValues;
      
      // Update state
      setEqValues(smoothedValues);
    };
    
    // Update values periodically when playing
    const interval = setInterval(animateEQ, 50);
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, eqValues]);
  
  const handleEqChange = (band, value) => {
    setEqValues(prev => ({
      ...prev,
      [band]: parseInt(value)
    }));
    
    // Update last values reference too
    lastValuesRef.current = {
      ...lastValuesRef.current,
      [band]: parseInt(value)
    };
  };
  
  return e('div', {
    className: 'flex flex-col bg-gray-800 border border-gray-700 p-2 rounded'
  }, [
    e('div', {
      key: 'eq-title',
      className: 'text-green-400 font-bold text-xs border-b border-gray-700 pb-1 mb-2'
    }, 'EQUALIZER'),
    e('div', {
      key: 'eq-sliders',
      className: 'flex justify-between items-end'
    }, [
      // Preamp slider
      e('div', {
        key: 'preamp',
        className: 'flex flex-col items-center'
      }, [
        e('div', {
          className: 'h-16 w-6 bg-gray-900 relative',
          style: { borderRadius: '2px' }
        }, [
          e('div', {
            className: 'absolute bottom-0 left-0 right-0 bg-green-500',
            style: { 
              height: `${eqValues.preamp}%`,
              borderRadius: '2px',
              transition: 'height 0.1s ease-out'
            }
          }),
          e('input', {
            type: 'range',
            min: 0,
            max: 100,
            value: eqValues.preamp,
            onChange: (evt) => handleEqChange('preamp', evt.target.value),
            className: 'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
            style: { 
              WebkitAppearance: 'slider-vertical',
              writingMode: 'bt-lr'
            }
          })
        ]),
        e('div', {
          className: 'text-green-400 text-xs mt-1'
        }, 'PRE')
      ]),
      
      // EQ bands
      e('div', {
        key: 'bands',
        className: 'flex'
      }, [
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(band => 
          e('div', {
            key: `band${band}`,
            className: 'flex flex-col items-center mx-1'
          }, [
            e('div', {
              className: 'h-16 w-3 bg-gray-900 relative',
              style: { borderRadius: '2px' }
            }, [
              e('div', {
                className: 'absolute bottom-0 left-0 right-0 bg-green-500',
                style: { 
                  height: `${eqValues[`band${band}`]}%`,
                  borderRadius: '2px',
                  transition: 'height 0.1s ease-out'
                }
              }),
              e('input', {
                type: 'range',
                min: 0,
                max: 100,
                value: eqValues[`band${band}`],
                onChange: (evt) => handleEqChange(`band${band}`, evt.target.value),
                className: 'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
                style: { 
                  WebkitAppearance: 'slider-vertical',
                  writingMode: 'bt-lr'
                }
              })
            ]),
            e('div', {
              className: 'text-green-400 text-xs mt-1'
            }, band)
          ])
        )
      ])
    ])
  ])
};

// WinampStyleMediaPlayer Content Component
const WinampStyleMediaPlayer = ({ isMaximized, windowSize }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState('sweet-dreams');
  const [soundcloudUrl, setSoundcloudUrl] = useState('');
  const [loadedTracks, setLoadedTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [widgetApi, setWidgetApi] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  
  const iframeRef = useRef(null);
  const progressRef = useRef(null);
  
  // Get tracks for the selected SoundCloud playlist
  const playlistTracks = soundcloudPlaylists.find(p => p.id === selectedPlaylist)?.tracks || [];

  // Load the SoundCloud Widget API
  useEffect(() => {
    // Check if script already exists to avoid duplicates
    const existingScript = document.querySelector('script[src="https://w.soundcloud.com/player/api.js"]');
    
    if (!existingScript) {
      // Create and append the script if it doesn't exist
      const script = document.createElement('script');
      script.src = 'https://w.soundcloud.com/player/api.js';
      script.async = true;
      document.body.appendChild(script);
      
      // No need to remove it on cleanup as it's a global resource
      return () => {};
    }
  }, []);

  // Setup SoundCloud Widget API connection
  useEffect(() => {
    if (!currentTrack || !iframeRef.current) return;
    
    let widget = null;
    let interval = null;
    
    // Function to initialize the widget once the API is loaded
    const initializeWidget = () => {
      if (window.SC && window.SC.Widget) {
        try {
          // API is loaded, create widget
          widget = window.SC.Widget(iframeRef.current);
          
          widget.bind(window.SC.Widget.Events.READY, () => {
            console.log('SoundCloud widget is ready');
            setWidgetApi(widget);
            
            // Set initial volume
            widget.setVolume(volume * 100);
            
            // Make sure it plays
            setTimeout(() => {
              widget.play();
            }, 500);
            
            // Bind events
            widget.bind(window.SC.Widget.Events.PLAY, () => {
              console.log('SoundCloud playback started');
              setIsPlaying(true);
            });
            
            widget.bind(window.SC.Widget.Events.PAUSE, () => {
              console.log('SoundCloud playback paused');
              setIsPlaying(false);
            });
            
            widget.bind(window.SC.Widget.Events.FINISH, () => {
              console.log('SoundCloud playback finished');
              setIsPlaying(false);
              playNextTrack();
            });
            
            widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data) => {
              setCurrentTime(data.currentPosition / 1000); // Convert to seconds
            });
          });
          
          // Clear the check interval
          if (checkInterval) {
            clearInterval(checkInterval);
          }
        } catch (error) {
          console.error('Error initializing SoundCloud widget:', error);
        }
      }
    };
    
    // Check periodically if SC API is loaded
    let checkInterval = setInterval(() => {
      if (window.SC && window.SC.Widget) {
        initializeWidget();
      }
    }, 100);
    
    // Set up periodic position updates
    interval = setInterval(() => {
      if (isPlaying && widget) {
        try {
          widget.getPosition((position) => {
            setCurrentTime(position / 1000); // Convert to seconds
          });
        } catch (error) {
          console.error('Error getting position:', error);
        }
      }
    }, 1000);
    
    // Initial attempt to initialize widget
    if (window.SC && window.SC.Widget) {
      initializeWidget();
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(checkInterval);
      
      // Unbind events if widget exists
      if (widget) {
        try {
          widget.unbind(window.SC.Widget.Events.PLAY);
          widget.unbind(window.SC.Widget.Events.PAUSE);
          widget.unbind(window.SC.Widget.Events.FINISH);
          widget.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
        } catch (error) {
          console.error('Error unbinding events:', error);
        }
      }
    };
  }, [currentTrack, volume]);

  // Handle volume changes
  useEffect(() => {
    if (widgetApi) {
      widgetApi.setVolume(volume * 100); // SoundCloud volume is 0-100
    }
  }, [volume, widgetApi]);

  // Load a SoundCloud track
  const handleTrackSelect = (track) => {
    if (!loadedTracks.some(t => t.url === track.url)) {
      setLoadedTracks(prev => [
        {
          ...track,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }
    
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Load SoundCloud URL from input
  const handleSoundcloudSubmit = (e) => {
    e.preventDefault();
    
    if (!soundcloudUrl) return;
    
    // Check if URL is already in history
    const existingTrack = loadedTracks.find(track => track.url === soundcloudUrl);
    
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
        artworkUrl: './Music/covers/default.jpg', // Default artwork
        duration: 180, // Default duration
        timestamp: new Date().toISOString()
      };
      
      setLoadedTracks(prev => [newTrack, ...prev]);
      setCurrentTrack(newTrack);
    } else {
      setCurrentTrack(existingTrack);
    }
    
    setSoundcloudUrl('');
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!currentTrack || !widgetApi) {
      console.log('Cannot toggle play/pause - widget not ready');
      return;
    }
    
    console.log('Toggling play/pause. Current state:', isPlaying ? 'playing' : 'paused');
    
    if (isPlaying) {
      widgetApi.pause();
    } else {
      widgetApi.play();
    }
  };

  // Handle progress bar click for seeking
  const handleProgressClick = (e) => {
    if (!currentTrack || !widgetApi) return;
    
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * (currentTrack.duration || 180);
    
    widgetApi.seekTo(seekTime * 1000); // Convert to milliseconds
  };

  // Play next track
  const playNextTrack = () => {
    if (!currentTrack) return;
    
    if (isShuffleOn) {
      // Play random track from playlist
      const randomIndex = Math.floor(Math.random() * playlistTracks.length);
      handleTrackSelect(playlistTracks[randomIndex]);
      return;
    }
    
    // Find the current track in the playlist
    const currentPlaylist = playlistTracks;
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    
    // If found and not the last track, play the next one
    if (currentIndex !== -1 && currentIndex < currentPlaylist.length - 1) {
      handleTrackSelect(currentPlaylist[currentIndex + 1]);
    } else if (isRepeatOn) {
      // If repeat is on, go back to first track
      handleTrackSelect(currentPlaylist[0]);
    } else if (loadedTracks.length > 0) {
      // Otherwise, try to play from loaded tracks history
      const historyIndex = loadedTracks.findIndex(track => track.id === currentTrack.id);
      if (historyIndex !== -1 && historyIndex < loadedTracks.length - 1) {
        handleTrackSelect(loadedTracks[historyIndex + 1]);
      }
    }
  };

  // Play previous track
  const playPreviousTrack = () => {
    if (!currentTrack) return;
    
    // If we're more than 3 seconds into the song, restart it instead of going to previous
    if (currentTime > 3) {
      widgetApi.seekTo(0);
      return;
    }
    
    // Find the current track in the playlist
    const currentPlaylist = playlistTracks;
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    
    // If found and not the first track, play the previous one
    if (currentIndex > 0) {
      handleTrackSelect(currentPlaylist[currentIndex - 1]);
    } else if (isRepeatOn) {
      // If repeat is on, go to last track
      handleTrackSelect(currentPlaylist[currentPlaylist.length - 1]);
    } else if (loadedTracks.length > 0) {
      // Otherwise, try to play from loaded tracks history
      const historyIndex = loadedTracks.findIndex(track => track.id === currentTrack.id);
      if (historyIndex > 0) {
        handleTrackSelect(loadedTracks[historyIndex - 1]);
      }
    }
  };

  return e('div', {
    className: 'flex flex-col h-full bg-gray-900'
  }, [
    // Main player (Winamp style)
    e('div', {
      key: 'winamp-player',
      className: 'flex flex-col bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-gray-600 rounded-md shadow-md p-2'
    }, [
      // Top section with title bar and menu buttons
      e('div', {
        key: 'player-top',
        className: 'flex justify-between items-center mb-2'
      }, [
        // Logo and title
        e('div', {
          key: 'player-logo',
          className: 'flex items-center'
        }, [
          e('div', {
            className: 'bg-gradient-to-r from-green-400 to-green-600 text-black font-bold text-xs px-2 py-1 rounded mr-2'
          }, 'WINAMP'),
          e('div', {
            className: 'text-green-400 text-xs'
          }, 'SoundCloud Edition')
        ]),
        
        // Control buttons
        e('div', {
          key: 'control-buttons',
          className: 'flex space-x-1'
        }, [
          e('button', {
            key: 'eq-button',
            onClick: () => setShowEqualizer(!showEqualizer),
            className: `w-6 h-6 flex items-center justify-center rounded ${showEqualizer ? 'bg-green-600' : 'bg-gray-600'} text-xs text-white hover:bg-green-500`
          }, 'EQ'),
          e('button', {
            key: 'pl-button',
            onClick: () => setShowPlaylist(!showPlaylist),
            className: `w-6 h-6 flex items-center justify-center rounded ${showPlaylist ? 'bg-green-600' : 'bg-gray-600'} text-xs text-white hover:bg-green-500`
          }, 'PL')
        ])
      ]),
      
      // Main player interface
      e('div', {
        key: 'player-main',
        className: 'flex bg-gray-900 border border-gray-700 rounded p-2 mb-2'
      }, [
        // Left section: album art
        e('div', {
          key: 'left-section',
          className: 'mr-3 w-24 h-24 border border-gray-800 bg-black flex-shrink-0'
        }, currentTrack?.artworkUrl && e('img', {
          src: currentTrack.artworkUrl,
          alt: currentTrack.title,
          className: 'w-full h-full object-cover'
        })),
        
        // Middle section: track info and controls
        e('div', {
          key: 'middle-section',
          className: 'flex-1 flex flex-col justify-between'
        }, [
          // Track info with scrolling effect
          e('div', {
            key: 'track-info',
            className: 'bg-black border border-gray-800 p-1 mb-1 truncate overflow-hidden'
          }, [
            e('div', {
              key: 'title-artist',
              className: 'text-green-400 text-xs whitespace-nowrap',
              style: {
                animation: currentTrack ? 'marquee 10s linear infinite' : 'none'
              }
            }, currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : 'No track loaded')
          ]),
          
          // Time and bitrate display
          e('div', {
            key: 'time-display',
            className: 'flex justify-between text-xs text-green-400 mb-1'
          }, [
            e('div', {
              key: 'time',
              className: 'bg-black border border-gray-800 px-2 py-1'
            }, formatTime(currentTime)),
            e('div', {
              key: 'duration',
              className: 'bg-black border border-gray-800 px-2 py-1'
            }, currentTrack ? formatTime(currentTrack.duration) : '0:00'),
            e('div', {
              key: 'bitrate',
              className: 'bg-black border border-gray-800 px-2 py-1'
            }, '320kbps')
          ]),
          
          // Progress bar
          e('div', {
            key: 'progress-container',
            className: 'bg-black border border-gray-800 h-3 mb-2',
            ref: progressRef,
            onClick: handleProgressClick
          }, 
            e('div', {
              className: 'bg-green-500 h-full',
              style: { 
                width: `${
                  currentTrack && currentTrack.duration 
                    ? (currentTime / currentTrack.duration) * 100 
                    : 0
                }%` 
              }
            })
          ),
          
          // Playback controls
          e('div', {
            key: 'playback-controls',
            className: 'flex justify-between px-1'
          }, [
            // Control buttons
            e('div', {
              key: 'controls',
              className: 'flex items-center space-x-1'
            }, [
              // Previous
              e('button', {
                key: 'prev',
                onClick: playPreviousTrack,
                className: 'bg-gray-700 hover:bg-gray-600 rounded w-6 h-6 flex items-center justify-center text-green-400'
              }, '⏮'),
              
              // Play/Pause
              e('button', {
                key: 'play-pause',
                onClick: togglePlayPause,
                className: 'bg-gray-700 hover:bg-gray-600 rounded w-7 h-6 flex items-center justify-center text-green-400'
              }, isPlaying ? '⏸' : '▶'),
              
              // Stop
              e('button', {
                key: 'stop',
                onClick: () => {
                  if (widgetApi) {
                    widgetApi.pause();
                    widgetApi.seekTo(0);
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }
                },
                className: 'bg-gray-700 hover:bg-gray-600 rounded w-6 h-6 flex items-center justify-center text-green-400'
              }, '⏹'),
              
              // Next
              e('button', {
                key: 'next',
                onClick: playNextTrack,
                className: 'bg-gray-700 hover:bg-gray-600 rounded w-6 h-6 flex items-center justify-center text-green-400'
              }, '⏭')
            ]),
            
            // Extra controls
            e('div', {
              key: 'extra-controls',
              className: 'flex items-center space-x-1'
            }, [
              // Shuffle
              e('button', {
                key: 'shuffle',
                onClick: () => setIsShuffleOn(!isShuffleOn),
                className: `bg-gray-700 hover:bg-gray-600 rounded w-6 h-6 flex items-center justify-center ${isShuffleOn ? 'text-green-400' : 'text-gray-400'}`
              }, '🔀'),
              
              // Repeat
              e('button', {
                key: 'repeat',
                onClick: () => setIsRepeatOn(!isRepeatOn),
                className: `bg-gray-700 hover:bg-gray-600 rounded w-6 h-6 flex items-center justify-center ${isRepeatOn ? 'text-green-400' : 'text-gray-400'}`
              }, '🔁')
            ])
          ])
        ]),
        
        // Right section: volume and balance controls
        e('div', {
          key: 'right-section',
          className: 'ml-3 w-16 flex flex-col'
        }, [
          // Volume slider
          e('div', {
            key: 'volume-control',
            className: 'flex flex-col items-center mb-2'
          }, [
            e('label', {
              className: 'text-green-400 text-xs mb-1',
            }, 'VOL'),
            e('div', {
              className: 'bg-gray-800 border border-gray-700 rounded h-16 w-4 relative'
            }, [
              e('div', {
                className: 'absolute bottom-0 left-0 right-0 bg-green-500',
                style: { height: `${volume * 100}%` }
              }),
              e('input', {
                type: 'range',
                min: 0,
                max: 1,
                step: 0.01,
                value: volume,
                onChange: (e) => setVolume(parseFloat(e.target.value)),
                className: 'absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              })
            ])
          ]),
          
          // Balance control
          e('div', {
            key: 'balance-control',
            className: 'flex flex-col items-center'
          }, [
            e('label', {
              className: 'text-green-400 text-xs mb-1',
            }, 'BAL'),
            e('div', {
              className: 'bg-gray-800 border border-gray-700 rounded h-2 w-full mt-1'
            }, [
              e('div', {
                className: 'bg-green-500 h-full w-1/2'
              })
            ])
          ])
        ])
      ]),
      
      // Visualizer section
      e('div', {
        key: 'visualizer',
        className: 'bg-black border border-gray-700 rounded p-1'
      }, e(Visualizer, { isPlaying, currentTime })),
      
      // Equalizer (collapsible)
      showEqualizer && e('div', {
        key: 'equalizer',
        className: 'mt-2'
      }, e(Equalizer, { isPlaying, currentTime })),
      
      // URL input form in Winamp style
      e('form', {
        key: 'url-form',
        className: 'mt-2 bg-gray-800 border border-gray-700 rounded p-2 flex',
        onSubmit: handleSoundcloudSubmit
      }, [
        e('input', {
          key: 'url-input',
          type: 'text',
          placeholder: 'Enter SoundCloud URL...',
          value: soundcloudUrl,
          onChange: (e) => setSoundcloudUrl(e.target.value),
          className: 'flex-1 bg-black text-green-400 border border-gray-700 rounded px-2 py-1 text-xs'
        }),
        e('button', {
          key: 'load-button',
          type: 'submit',
          className: 'bg-gray-700 hover:bg-gray-600 text-green-400 px-2 py-1 rounded ml-2 text-xs'
        }, 'LOAD')
      ])
    ]),
    
    // Playlist section (collapsible)
    showPlaylist && e('div', {
      key: 'playlist-section',
      className: 'flex-1 mt-2 bg-gray-900 border-2 border-gray-600 rounded-md shadow-md overflow-hidden flex flex-col'
    }, [
      // Playlist header with tabs
      e('div', {
        key: 'playlist-header',
        className: 'bg-gradient-to-r from-gray-700 to-gray-800 border-b border-gray-600 p-2 flex justify-between'
      }, [
        // Playlist name
        e('div', {
          key: 'playlist-title',
          className: 'text-green-400 font-bold text-sm'
        }, 'PLAYLIST EDITOR'),
        
        // Playlist controls
        e('div', {
          key: 'playlist-controls',
          className: 'flex space-x-1'
        }, [
          e('button', {
            key: 'minimize-playlist',
            onClick: () => setShowPlaylist(false),
            className: 'bg-gray-700 hover:bg-gray-600 text-green-400 w-6 h-6 flex items-center justify-center rounded text-xs'
          }, '−')
        ])
      ]),
      
      // Playlist tabs
      e('div', {
        key: 'playlist-tabs',
        className: 'flex bg-gray-800 border-b border-gray-600'
      }, soundcloudPlaylists.map(playlist => 
        e('button', {
          key: playlist.id,
          onClick: () => setSelectedPlaylist(playlist.id),
          className: `px-3 py-1 text-xs ${
            selectedPlaylist === playlist.id 
              ? 'bg-gray-900 text-green-400 font-bold border-t-2 border-green-400' 
              : 'text-gray-400 hover:bg-gray-700'
          }`
        }, playlist.name)
      )),
      
      // Playlist tracks
      e('div', {
        key: 'playlist-tracks',
        className: 'flex-1 bg-gray-900 overflow-y-auto'
      }, 
        e('table', {
          className: 'w-full text-xs'
        }, [
          e('thead', {
            key: 'playlist-header',
            className: 'sticky top-0 bg-gray-800 text-green-400 text-left'
          }, 
            e('tr', {}, [
              e('th', { key: 'track-num', className: 'p-2 w-10' }, '#'),
              e('th', { key: 'track-title', className: 'p-2' }, 'TITLE'),
              e('th', { key: 'track-artist', className: 'p-2' }, 'ARTIST'),
              e('th', { key: 'track-duration', className: 'p-2 text-right w-16' }, 'TIME')
            ])
          ),
                        e('tbody', {
            key: 'playlist-body',
            className: 'text-gray-300 divide-y divide-gray-800'
          }, playlistTracks.map((track, index) => 
            e('tr', {
              key: track.id,
              className: `hover:bg-gray-800 cursor-pointer ${currentTrack && currentTrack.id === track.id ? 'bg-gray-700' : ''}`,
              onClick: () => handleTrackSelect(track) // Changed from onDoubleClick to onClick for better responsiveness
            }, [
              e('td', { 
                key: 'track-num', 
                className: 'p-2 text-gray-500'
              }, 
                currentTrack && currentTrack.id === track.id && isPlaying ? 
                  e('span', { className: 'text-green-400' }, '▶') :
                  index + 1
              ),
              e('td', { 
                key: 'track-title', 
                className: `p-2 ${currentTrack && currentTrack.id === track.id ? 'text-green-400' : ''}`
              }, track.title),
              e('td', { 
                key: 'track-artist', 
                className: 'p-2'
              }, track.artist),
              e('td', { 
                key: 'track-duration', 
                className: 'p-2 text-right'
              }, formatTime(track.duration))
            ])
          ))
        ])
      ),
      
      // Recently played tracks
      loadedTracks.length > 0 && e('div', {
        key: 'recent-tracks',
        className: 'border-t border-gray-700 p-2'
      }, [
        e('div', {
          key: 'recent-title',
          className: 'text-green-400 text-xs font-bold mb-1'
        }, 'RECENTLY PLAYED'),
        e('div', {
          key: 'recent-list',
          className: 'max-h-32 overflow-y-auto'
        }, loadedTracks.slice(0, 5).map(track => 
          e('div', {
            key: track.id,
            className: `p-1 text-xs cursor-pointer hover:bg-gray-800 ${currentTrack && currentTrack.id === track.id ? 'text-green-400' : 'text-gray-400'}`,
            onClick: () => handleTrackSelect(track)
          }, `${track.artist} - ${track.title}`)
        ))
      ])
    ]),
    
    // SoundCloud iframe container (hidden but functional)
    e('div', {
      key: 'soundcloud-iframe-container',
      style: { 
        position: 'absolute', 
        visibility: 'hidden',
        pointerEvents: 'none',
        width: '100%',
        height: '166px'
      }
    }, 
      currentTrack && e('iframe', {
        ref: iframeRef,
        id: 'soundcloud-widget-iframe',
        width: '100%',
        height: '166',
        scrolling: 'no',
        frameBorder: 'no',
        allow: 'autoplay',
        src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(currentTrack.url)}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&debug=true`
      })
    )
  ]);
};

// Main MediaPlayerWindow component using the WindowFrame
export const MediaPlayerWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for Winamp-inspired media player
  const mediaPlayerTheme = {
    titleBarBg: 'bg-gray-800',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-yellow-500 hover:bg-yellow-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-gray-700'
  };

  return e(WindowFrame, {
    title: 'Winamp Media Player',
    initialPosition: { x: 350, y: 150 },
    initialSize: { width: 800, height: 550 },
    minSize: { width: 400, height: 300 },
    onClose,
    onMinimize,
    isMinimized,
    theme: mediaPlayerTheme
  }, 
    e(WinampStyleMediaPlayer)
  );
};