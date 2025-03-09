// js/components/NotesWindow.js
const { useState } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Notes Content Component - Separated from window frame
const NotesContent = ({ isMaximized, windowSize }) => {
  const [note, setNote] = useState(

//~~~ Megacorp product X beta tested by character, simultaneously character develops (or has worsened?) symptoms related to chest pain, head/sensory issues, and joint pain in hands/wrist
  //  >> character documents symptoms
  //  >> Why the character pursued product x in the first place (general tech interest)

//Character believes there might be a tie between symptoms and Megacorp product X, A: wants help from a doctor & B: wants compensation from Megacorp.  
//Reasons for compensation might be inability to perform at job

//Notes document interactions with lawyer relative to megacorp product and health (character documents symptoms); tie-in with separate conversations between character and doctor, where doctor is telling the character that
//symptoms are psychosomatic ~~~

//~~~ Meta: notes are written short form/personal to add color to character & demonstrate personality, note dates add timeline/progression to story  ~~~~

   ` *Spoke with lawyer on Oct. 17, 2023*
    Lawyer suggested documenting health-related issues, so here goes:

    Oct 21:




    Symptoms started months ago, but have progressively worsened to where it has become
    difficult to perform day to day tasks.  Symptoms include:
    -  Pain in hands and wrist
    -  Chest pain
    -  Chest palpitations
    -  Impaired vision
    -  
    -  Extended periods of typing are difficult due to pain in my hands and wrists (interrupts work related to job as software dev)
    -  Difficulty concentrating on most tasks due to chronic brain fog and anxiety, possibly induced by chest palpitations
    -  
    `);
  
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