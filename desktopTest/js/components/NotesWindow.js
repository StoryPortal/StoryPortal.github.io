// js/components/NotesWindow.js
const { useState } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Notes Content Component - Separated from window frame
const NotesContent = ({ isMaximized, windowSize }) => {
  const [note, setNote] = useState('Write your note here...');
  
  return e('textarea', {
    className: `w-full h-full p-4 focus:outline-none resize-none`,
    value: note,
    onChange: (e) => setNote(e.target.value)
  });
};

// Main NotesWindow component using the WindowFrame
export const NotesWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for notes (yellow theme)
  const notesTheme = {
    titleBarBg: 'bg-yellow-50',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-orange-500 hover:bg-orange-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-yellow-200'
  };

  return e(WindowFrame, {
    title: 'Notes',
    initialPosition: { x: 150, y: 100 },
    initialSize: { width: 400, height: 300 },
    minSize: { width: 200, height: 150 },
    onClose,
    onMinimize,
    isMinimized,
    theme: notesTheme
  }, 
    e(NotesContent)
  );
};