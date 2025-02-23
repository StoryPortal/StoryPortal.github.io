const DraggableWindow = ({ children, initialPosition = { x: 100, y: 50 }, onClose }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // New state for window management
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [originalSize, setOriginalSize] = useState({ width: 800, height: 400 });

  const handleMouseDown = (e) => {
    if (!e.target.closest('.window-titlebar')) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Maximize functionality
  const handleMaximize = () => {
    if (isMaximized) {
      // Restore to original size
      setPosition(initialPosition);
      setIsMaximized(false);
    } else {
      // Store current size before maximizing
      setOriginalSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Maximize to full screen
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
  };

  // Minimize functionality
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // If minimized, don't render the window content
  if (isMinimized) {
    return null;
  }

  return e('div', {
    style: {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      cursor: isDragging ? 'grabbing' : 'default',
      width: isMaximized ? '100%' : '800px',
      height: isMaximized ? '100%' : 'auto',
      zIndex: 10 // Ensure window is above other elements
    },
    onMouseDown: handleMouseDown,
    className: 'bg-white rounded-lg shadow-xl border border-gray-200'
  }, children);
};