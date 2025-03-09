// js/components/NotesWindow.js
const { useState } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Mock notes data
const initialNotes = [
  {
    id: 1,
    title: 'Symptoms',
    content: `*Spoke with lawyer on Oct. 17, 2023*
Lawyer suggested documenting health-related issues, so here goes:

Oct 21:

Symptoms started months ago, but have progressively worsened to where it has become
difficult to perform day to day tasks. Symptoms include:
- Pain in hands and wrist
- Chest pain
- Chest palpitations
- Impaired vision
- 
- Extended periods of typing are difficult due to pain in my hands and wrists (interrupts work related to job as software dev)
- Difficulty concentrating on most tasks due to chronic brain fog and anxiety, possibly induced by chest palpitations
- `,
    createdAt: '2023-10-21T14:32:00',
    updatedAt: '2023-10-21T15:12:00'
  },
  {
    id: 2,
    title: 'Product X Observations',
    content: `Started testing MegaCorp's Product X today as part of the beta program.
    
Initial impressions:
- Interface is sleek but I'm having trouble focusing on the text
- Had to take a break after 20 minutes due to headache
- Strange tingling sensation in my fingers while using the handheld controller

Will continue testing tomorrow. Need to document everything for the feedback submission.`,
    createdAt: '2023-09-15T10:45:00',
    updatedAt: '2023-09-15T11:30:00'
  },
  {
    id: 3,
    title: 'Doctor Visit Notes',
    content: `Doctor's appointment - Sept 28

Dr. Ramsay said my blood work "looks normal" again. Suggested it could be psychosomatic.
Asked if I've been under stress at work. Recommended therapy and reducing screen time.

I told him about the chest pain and wrist issues, and how they seem to flare up when using Product X.
He didn't seem interested in the connection. Just prescribed more anti-inflammatories.

Need to get a second opinion. This is getting worse, not better.`,
    createdAt: '2023-09-28T16:20:00',
    updatedAt: '2023-09-28T17:15:00'
  },
  {
    id: 4,
    title: 'Legal Questions',
    content: `Questions for cousin Jen (the lawyer):

1. If a product causes health issues that doctors can't diagnose, what kind of evidence do I need?
2. Is it worth pursuing a case if medical tests show "normal" results?
3. Can I request internal testing data from MegaCorp about Product X?
4. What's the statute of limitations on this kind of case?
5. Should I stop using the product completely? (beta contract says I need to use it 3x weekly)

Call her next Tuesday.`,
    createdAt: '2023-10-18T20:14:00',
    updatedAt: '2023-10-19T08:22:00'
  },
  {
    id: 5,
    title: 'Weekend Plans',
    content: `Retreat with friends this weekend:
- Pack light - Naomi said the farmhouse has everything
- No tech! Going to leave all devices behind (except emergency phone)
- Might be good to reset and see if symptoms improve without Product X nearby
- Remember to bring Rob's hiking boots I borrowed`,
    createdAt: '2024-01-08T22:37:00',
    updatedAt: '2024-01-08T22:41:00'
  }
];

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Get today and yesterday for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if the date is today or yesterday
  if (date.getTime() >= today.getTime()) {
    return 'Today';
  } else if (date.getTime() >= yesterday.getTime()) {
    return 'Yesterday';
  } else {
    // Return formatted date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Format time for display
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  });
};

// Notes Content Component - Separated from window frame
const NotesContent = ({ isMaximized, windowSize }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState(initialNotes[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Find the currently selected note
  const selectedNote = notes.find(note => note.id === selectedNoteId) || notes[0];
  
  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle note updates
  const updateNoteContent = (content) => {
    const updatedNotes = notes.map(note => 
      note.id === selectedNoteId 
        ? { 
            ...note, 
            content,
            updatedAt: new Date().toISOString()
          }
        : note
    );
    setNotes(updatedNotes);
  };
  
  // Create new note
  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };
  
  // Delete selected note
  const deleteSelectedNote = () => {
    if (notes.length <= 1) return; // Don't delete the last note
    
    const updatedNotes = notes.filter(note => note.id !== selectedNoteId);
    setNotes(updatedNotes);
    setSelectedNoteId(updatedNotes[0].id);
  };
  
  // Update note title
  const updateNoteTitle = (title) => {
    const updatedNotes = notes.map(note => 
      note.id === selectedNoteId 
        ? { 
            ...note, 
            title,
            updatedAt: new Date().toISOString()
          }
        : note
    );
    setNotes(updatedNotes);
  };
  
  return e('div', {
    className: 'flex h-full bg-yellow-50'
  }, [
    // Notes list sidebar
    e('div', {
      key: 'sidebar',
      className: 'w-64 border-r border-yellow-200 flex flex-col'
    }, [
      // Search and New Note Bar
      e('div', {
        key: 'search-bar',
        className: 'p-2 border-b border-yellow-200 bg-yellow-100 flex items-center'
      }, [
        e('input', {
          type: 'text',
          placeholder: 'Search',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: 'flex-1 px-3 py-1 text-sm border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500'
        }),
        e('button', {
          onClick: createNewNote,
          className: 'ml-2 p-1 text-yellow-800 hover:bg-yellow-200 rounded',
          title: 'New Note'
        }, 
          e('svg', {
            width: '20',
            height: '20',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2'
          }, [
            e('path', { d: 'M12 5v14', key: 'v' }),
            e('path', { d: 'M5 12h14', key: 'h' })
          ])
        )
      ]),
      
      // Notes List
      e('div', {
        key: 'notes-list',
        className: 'flex-1 overflow-y-auto'
      },
        filteredNotes.length > 0 ? 
          e('div', {
            className: 'divide-y divide-yellow-200'
          },
            filteredNotes.map(note => 
              e('div', {
                key: note.id,
                onClick: () => setSelectedNoteId(note.id),
                className: `p-3 cursor-pointer hover:bg-yellow-100 ${
                  selectedNoteId === note.id ? 'bg-yellow-200' : ''
                }`
              }, [
                e('div', {
                  key: 'note-title',
                  className: 'font-medium truncate'
                }, note.title),
                e('div', {
                  key: 'note-preview',
                  className: 'text-sm text-gray-600 truncate'
                }, note.content.slice(0, 60).replace(/\n/g, ' ')),
                e('div', {
                  key: 'note-date',
                  className: 'text-xs text-gray-500 mt-1'
                }, `${formatDate(note.updatedAt)} ${formatTime(note.updatedAt)}`)
              ])
            )
          ) : 
          e('div', {
            className: 'p-4 text-center text-gray-500'
          }, 'No notes found')
      )
    ]),
    
    // Note Editor
    e('div', {
      key: 'editor',
      className: 'flex-1 flex flex-col'
    }, [
      // Note Title and Controls
      e('div', {
        key: 'note-header',
        className: 'p-3 border-b border-yellow-200 bg-yellow-100 flex items-center'
      }, [
        e('input', {
          type: 'text',
          value: selectedNote?.title || '',
          onChange: (e) => updateNoteTitle(e.target.value),
          className: 'flex-1 bg-transparent font-medium focus:outline-none'
        }),
        e('button', {
          onClick: deleteSelectedNote,
          className: 'p-1 text-yellow-800 hover:bg-yellow-200 rounded',
          title: 'Delete Note',
          disabled: notes.length <= 1
        }, 
          e('svg', {
            width: '20',
            height: '20',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2'
          }, 
            e('path', { d: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6' })
          )
        )
      ]),
      
      // Last Edited Timestamp
      e('div', {
        key: 'note-timestamp',
        className: 'px-3 py-1 text-xs text-gray-500 border-b border-yellow-200'
      }, `Last edited on ${new Date(selectedNote?.updatedAt).toLocaleDateString()} at ${new Date(selectedNote?.updatedAt).toLocaleTimeString()}`),
      
      // Note Content Editor
      e('textarea', {
        key: 'note-content',
        className: 'flex-1 p-3 focus:outline-none resize-none bg-yellow-50',
        value: selectedNote?.content || '',
        onChange: (e) => updateNoteContent(e.target.value)
      })
    ])
  ]);
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
    initialSize: { width: 650, height: 500 },
    minSize: { width: 400, height: 300 },
    onClose,
    onMinimize,
    isMinimized,
    theme: notesTheme
  }, 
    e(NotesContent)
  );
};