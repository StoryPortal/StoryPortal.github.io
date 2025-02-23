const { useState, useEffect } = React;
const { createElement: e } = React;

export const DraggableWindow = ({ 
  children, 
  initialPosition = { x: 100, y: 50 }, 
  onClose,
  onMinimize,
  isMinimized 
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousPosition, setPreviousPosition] = useState(initialPosition);

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
    if (!isDragging || isMaximized) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setPosition(previousPosition);
    } else {
      setPreviousPosition(position);
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
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

  if (isMinimized) {
    return null;
  }

  // Create childrenWithProps by mapping over array children or handling single child
  const childrenWithProps = React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }
    
    if (child.key === 'titlebar') {
      return React.cloneElement(child, {
        handleMaximize,
        isMaximized,  // Pass isMaximized state
        onClose,
        onMinimize
      });
    }
    return React.cloneElement(child, { isMaximized });  // Pass isMaximized to all children
  });

  return e('div', {
    style: {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      cursor: isDragging ? 'grabbing' : 'default',
      width: isMaximized ? '100vw' : '800px',
      height: isMaximized ? '100vh' : 'auto',
      zIndex: 10,
      transition: isDragging ? 'none' : 'all 0.3s ease'
    },
    onMouseDown: handleMouseDown,
    className: 'bg-white rounded-lg shadow-xl border border-gray-200'
  }, childrenWithProps);
};