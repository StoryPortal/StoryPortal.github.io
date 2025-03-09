// js/components/BrowserWindow.js
const { useState, useRef, useEffect } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// BrowserContent Component - Separated from window frame
const BrowserContent = ({ isMaximized, windowSize }) => {
  const initialUrl = 'https://www.wonder-tonic.com/geocitiesizer/';
  const [url, setUrl] = useState(initialUrl);
  const [history, setHistory] = useState([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState([
    { id: 2, title: 'Weather', url: 'https://weather.gov' },
    { id: 3, title: 'Sacred Sanguin', url: 'https://en.m.wikipedia.org/wiki/Sanguinaria' },
    { id: 4, title: 'i\'m spooked', url: 'https://www.dreamymonkey.com/art/quantum-entanglement' },
    { id: 5, title: 'What\'s in the box', url: 'https://stardewvalleywiki.com/Mystery_Box' },
    { id: 6, title: 'Storyportal 1', url: 'https://storyportal.github.io/about_storyportal_1.html'}
  ]);
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const iframeRef = useRef(null);

  // Effect to update the iframe when URL changes
  useEffect(() => {
    if (iframeRef.current) {
      console.log(`Browser: Setting iframe src to ${url}`);
      iframeRef.current.src = url;
    }
  }, [url]);

  // Navigation functions
  const navigateTo = (newUrl) => {
    // Don't add to history if it's the same URL
    if (newUrl === url) {
      console.log("Browser: URL is the same, not navigating");
      return;
    }
    
    console.log(`Browser: Navigating to ${newUrl}`);
    
    // Remove any entries after current index if we navigated back
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    
    setUrl(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    console.log(`Browser: History is now:`, newHistory);
    console.log(`Browser: History index is now: ${newHistory.length - 1}`);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      console.log(`Browser: Going back to index ${newIndex}: ${history[newIndex]}`);
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
    } else {
      console.log("Browser: Can't go back, at oldest history entry");
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      console.log(`Browser: Going forward to index ${newIndex}: ${history[newIndex]}`);
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
    } else {
      console.log("Browser: Can't go forward, at newest history entry");
    }
  };

  // Bookmark functions
  const addBookmark = () => {
    const title = newBookmarkTitle || new URL(url).hostname;
    const newBookmark = {
      id: Date.now(),
      title,
      url
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    setIsAddingBookmark(false);
    setNewBookmarkTitle('');
  };

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  // Handle URL input
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    
    // Add protocol if missing
    let processedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      processedUrl = 'https://' + url;
      setUrl(processedUrl);
    }
    
    // Check if this is actually a navigation to a new URL
    if (processedUrl !== history[historyIndex]) {
      navigateTo(processedUrl);
    }
  };

  return e('div', {
    className: 'flex flex-col h-full'
  }, [
    // Navigation bar
    e('div', {
      key: 'nav-bar',
      className: 'p-2 border-b border-gray-200 flex space-x-2 items-center bg-gray-50'
    }, [
      // Back button
      e('button', {
        key: 'back',
        onClick: goBack,
        disabled: historyIndex === 0,
        className: `p-1 rounded ${historyIndex === 0 ? 'text-gray-400' : 'hover:bg-gray-200'}`
      }, 
        e('svg', {
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }, e('path', { d: 'M19 12H5M12 19l-7-7 7-7' }))
      ),
      
      // Forward button
      e('button', {
        key: 'forward',
        onClick: goForward,
        disabled: historyIndex === history.length - 1,
        className: `p-1 rounded ${historyIndex === history.length - 1 ? 'text-gray-400' : 'hover:bg-gray-200'}`
      }, 
        e('svg', {
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }, e('path', { d: 'M5 12h14M12 5l7 7-7 7' }))
      ),
      
      // Refresh button
      e('button', {
        key: 'refresh',
        onClick: () => {
          // For refresh, we want to reload the current URL without adding to history
          if (iframeRef.current) {
            // Reload the iframe content
            iframeRef.current.src = url;
          }
        },
        className: 'p-1 rounded hover:bg-gray-200'
      }, 
        e('svg', {
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }, e('path', { d: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15' }))
      ),
      
      // URL input
      e('form', {
        key: 'url-form',
        className: 'flex-1',
        onSubmit: handleUrlSubmit
      }, 
        e('input', {
          type: 'text',
          value: url,
          onChange: (e) => setUrl(e.target.value),
          className: 'w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        })
      ),
      
      // Bookmark button
      e('button', {
        key: 'bookmark',
        onClick: () => setIsAddingBookmark(true),
        className: 'p-1 rounded hover:bg-gray-200'
      }, 
        e('svg', {
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }, e('path', { d: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z' }))
      )
    ]),
    
    // Bookmarks bar
    e('div', {
      key: 'bookmarks-bar',
      className: 'px-2 py-1 border-b border-gray-200 flex space-x-2 items-center bg-gray-50 overflow-x-auto'
    }, [
      // Bookmark items
      ...bookmarks.map(bookmark => 
        e('div', {
          key: `bookmark-${bookmark.id}`,
          className: 'group relative'
        }, [
          e('button', {
            onClick: () => navigateTo(bookmark.url),
            className: 'px-3 py-1 text-sm rounded hover:bg-gray-200 truncate max-w-xs'
          }, bookmark.title),
          // Remove button (shows on hover)
          e('button', {
            className: 'absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center',
            onClick: (e) => {
              e.stopPropagation();
              removeBookmark(bookmark.id);
            }
          }, '×')
        ])
      ),
      
      // Add bookmark form (conditionally rendered)
      isAddingBookmark && e('div', {
        className: 'flex items-center space-x-2 ml-2'
      }, [
        e('input', {
          key: 'bookmark-title',
          type: 'text',
          placeholder: 'Title',
          value: newBookmarkTitle,
          onChange: (e) => setNewBookmarkTitle(e.target.value),
          className: 'px-2 py-1 text-sm border rounded'
        }),
        e('button', {
          key: 'save-bookmark',
          onClick: addBookmark,
          className: 'px-2 py-1 text-xs bg-blue-500 text-white rounded'
        }, 'Save'),
        e('button', {
          key: 'cancel-bookmark',
          onClick: () => setIsAddingBookmark(false),
          className: 'px-2 py-1 text-xs bg-gray-300 rounded'
        }, 'Cancel')
      ])
    ]),
    
    // Browser content (iframe)
    e('div', {
      key: 'browser-content',
      className: 'flex-1'
    }, 
      e('iframe', {
        ref: iframeRef,
        src: url,
        className: 'w-full h-full border-none',
        sandbox: 'allow-same-origin allow-scripts allow-forms',
        title: 'Browser Content',
        onLoad: () => {
          // When the iframe loads, make sure the URL state is in sync
          // This helps with redirects or final URLs after navigation
          if (iframeRef.current && iframeRef.current.contentWindow) {
            // Update if needed, but don't do this in production without security considerations
            // For the simulation, this is fine
          }
        }
      })
    )
  ]);
};

// Main BrowserWindow component using the WindowFrame
export const BrowserWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for browser
  const browserTheme = {
    titleBarBg: 'bg-indigo-50',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-yellow-500 hover:bg-yellow-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-indigo-200'
  };

  return e(WindowFrame, {
    title: 'Web Browser',
    initialPosition: { x: 300, y: 100 },
    initialSize: { width: 900, height: 600 },
    minSize: { width: 400, height: 300 },
    onClose,
    onMinimize,
    isMinimized,
    theme: browserTheme
  }, 
    e(BrowserContent)
  );
};