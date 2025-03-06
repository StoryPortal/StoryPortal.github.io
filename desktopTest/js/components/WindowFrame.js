// js/components/WindowFrame.js
const { useState, useEffect, useRef } = React;
const { createElement: e } = React;

export const WindowFrame = ({ 
  children,
  title = "Window",
  initialPosition = { x: 100, y: 50 },
  initialSize = { width: 800, height: 500 },
  minSize = { width: 300, height: 200 },
  onClose,
  onMinimize,
  isMinimized,
  onActivate,
  style = {},
  zIndex = 10, // Add zIndex as a prop
  theme = {
    titleBarBg: 'bg-gray-100',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-yellow-500 hover:bg-yellow-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-gray-200'
  }
}) => {
  // Window position and state
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState({ position: initialPosition, size: initialSize });
  
  const windowRef = useRef(null);

  // Handle click to bring window to front
  const handleWindowClick = () => {
    if (onActivate) {
      onActivate();
    }
  };

  // Handle window drag
  const handleTitleMouseDown = (e) => {
    if (isMaximized) return;
    
    if (!e.target.closest('.window-controls')) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  const handleDrag = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  // Handle window resize
  const handleResizeMouseDown = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    
    // Store initial positions for more accurate resizing
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.width,
      y: e.clientY - rect.height
    });
  };
  
  const handleResize = (e) => {
    if (!isResizing) return;
    
    const newSize = { ...size };
    const newPosition = { ...position };
    
    switch(resizeDirection) {
      case 'e': // Right edge
        newSize.width = Math.max(minSize.width, e.clientX - position.x);
        break;
      case 's': // Bottom edge
        newSize.height = Math.max(minSize.height, e.clientY - position.y);
        break;
      case 'se': // Bottom-right corner
        newSize.width = Math.max(minSize.width, e.clientX - position.x);
        newSize.height = Math.max(minSize.height, e.clientY - position.y);
        break;
      case 'w': // Left edge
        const newWidth = Math.max(minSize.width, size.width + (position.x - e.clientX));
        newPosition.x = e.clientX;
        newSize.width = newWidth;
        break;
      case 'n': // Top edge
        const newHeight = Math.max(minSize.height, size.height + (position.y - e.clientY));
        newPosition.y = e.clientY;
        newSize.height = newHeight;
        break;
      case 'sw': // Bottom-left corner
        newSize.height = Math.max(minSize.height, e.clientY - position.y);
        const swWidth = Math.max(minSize.width, size.width + (position.x - e.clientX));
        newPosition.x = e.clientX;
        newSize.width = swWidth;
        break;
      case 'ne': // Top-right corner
        const neHeight = Math.max(minSize.height, size.height + (position.y - e.clientY));
        newPosition.y = e.clientY;
        newSize.height = neHeight;
        newSize.width = Math.max(minSize.width, e.clientX - position.x);
        break;
      case 'nw': // Top-left corner
        const nwHeight = Math.max(minSize.height, size.height + (position.y - e.clientY));
        newPosition.y = e.clientY;
        newSize.height = nwHeight;
        const nwWidth = Math.max(minSize.width, size.width + (position.x - e.clientX));
        newPosition.x = e.clientX;
        newSize.width = nwWidth;
        break;
      default:
        break;
    }
    
    setPosition(newPosition);
    setSize(newSize);
  };
  
  // Handle mouse up for both dragging and resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };
  
  // Handle maximize/restore
  const handleMaximize = () => {
    if (isMaximized) {
      // Restore previous state
      setPosition(previousState.position);
      setSize(previousState.size);
    } else {
      // Store current state for restore
      setPreviousState({
        position: position,
        size: size
      });
      
      // Maximize
      setPosition({ x: 0, y: 0 });
      setSize({ 
        width: window.innerWidth, 
        height: window.innerHeight - 48 // Account for dock
      });
    }
    
    setIsMaximized(!isMaximized);
  };

  useEffect(() => {
    // Directly set the z-index on the DOM element when it changes in props
    if (windowRef.current && style && typeof style.zIndex !== 'undefined') {
      // Use direct DOM manipulation to set z-index
      windowRef.current.style.zIndex = style.zIndex;
      console.log(`Directly set z-index to ${style.zIndex} for ${title} window`);
    }
  }, [style.zIndex, title]);
  
  // Activate window on mousedown
  useEffect(() => {
    const handleClick = () => {
      if (onActivate) {
        onActivate();
      }
    };
    
    const currentRef = windowRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousedown', handleClick);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousedown', handleClick);
      }
    };
  }, [onActivate]);
  
  // Add/remove event listeners for drag and resize
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', isDragging ? handleDrag : handleResize);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection]);
  
  // Hide window when minimized
  if (isMinimized) {
    return null;
  }
  
  // TitleBar component integrated into the WindowFrame
  const TitleBar = () => {
    return e('div', {
      className: `window-titlebar flex items-center justify-between ${theme.titleBarBg} p-2 rounded-t-lg border-b cursor-move`,
      onMouseDown: handleTitleMouseDown,
    }, 
      e('div', {
        className: 'flex items-center space-x-2'
      }, [
        e('div', {
          key: 'buttons',
          className: 'flex space-x-3 window-controls' // Increased space between buttons
        }, [
          e('button', {
            key: 'close',
            className: `w-5 h-5 p-2 rounded-full ${theme.closeButton} transition-colors flex items-center justify-center`, // Increased size and added padding
            onClick: (e) => {
              e.stopPropagation();
              onClose();
            },
            title: 'Close'
          }),
          e('button', {
            key: 'minimize',
            className: `w-5 h-5 p-2 rounded-full ${theme.minimizeButton} transition-colors flex items-center justify-center`, // Increased size and added padding
            onClick: (e) => {
              e.stopPropagation();
              onMinimize();
            },
            title: 'Minimize'
          }),
          e('button', {
            key: 'maximize',
            className: `w-5 h-5 p-2 rounded-full ${theme.maximizeButton} transition-colors flex items-center justify-center`, // Increased size and added padding
            onClick: (e) => {
              e.stopPropagation();
              handleMaximize();
            },
            title: isMaximized ? 'Restore' : 'Maximize'
          })
        ]),
      ])
    );
  };
  
  // Resize handles
  const ResizeHandles = () => {
    if (isMaximized) return null;
    
    const directions = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
    const handleStyles = {
      n: 'top-0 left-0 right-0 h-2 cursor-ns-resize',
      e: 'top-0 right-0 bottom-0 w-2 cursor-ew-resize',
      s: 'bottom-0 left-0 right-0 h-2 cursor-ns-resize',
      w: 'top-0 left-0 bottom-0 w-2 cursor-ew-resize',
      ne: 'top-0 right-0 w-4 h-4 cursor-ne-resize',
      nw: 'top-0 left-0 w-4 h-4 cursor-nw-resize',
      se: 'bottom-0 right-0 w-4 h-4 cursor-se-resize',
      sw: 'bottom-0 left-0 w-4 h-4 cursor-sw-resize'
    };
    
    return directions.map(dir => 
      e('div', {
        key: `resize-${dir}`,
        className: `absolute z-20 ${handleStyles[dir]}`,
        onMouseDown: (e) => handleResizeMouseDown(e, dir)
      })
    );
  };
  
  // Create childrenWithProps by passing necessary props to children
  const childrenWithProps = React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }
    
    return React.cloneElement(child, { 
      isMaximized,
      windowSize: size
    });
  });
  
  
  
  return e('div', {
    ref: windowRef,
    style: {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      cursor: isDragging ? 'grabbing' : 'default',
      zIndex: zIndex, // Use the direct prop here
      transition: isDragging || isResizing ? 'none' : 'all 0.3s ease',
      ...style
    },
    onClick: handleWindowClick,
    className: `bg-white rounded-lg shadow-xl border ${theme.windowBorder}`
  }, [
    e(TitleBar, { key: 'titlebar' }),
    e('div', { 
      key: 'content-container',
      className: 'relative h-[calc(100%-40px)] overflow-auto'
    }, childrenWithProps),
    e(ResizeHandles, { key: 'resize-handles' })
  ]);
};