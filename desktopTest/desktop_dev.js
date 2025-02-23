// Get React hooks from the global React object
const { useState, useEffect } = React;

// Message Icon Component
const MessageIcon = () => React.createElement('svg', {
  className: 'w-8 h-8 text-white',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, 
  React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
  })
);

// Notes Icon Component
const NotesIcon = () => React.createElement('svg', {
  className: 'w-8 h-8 text-white',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, 
  React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  })
);

// Draggable Window Component
const DraggableWindow = ({ children, initialPosition = { x: 100, y: 50 }, onClose }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
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

  return React.createElement('div', {
    style: {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      cursor: isDragging ? 'grabbing' : 'default',
      width: '800px'
    },
    onMouseDown: handleMouseDown,
    className: 'bg-white rounded-lg shadow-xl border border-gray-200'
  }, children);
};

// Message Window Component
const MessageWindow = ({ onClose }) => {
  const [conversations] = useState([
    {
      id: 1,
      name: 'Alex Smith',
      lastMessage: 'Check your inbox...',
      messages: [
        { id: 1, sender: 'Alex Smith', content: 'Hey, did you see that weird email?', time: '2:45 PM' },
        { id: 2, sender: 'You', content: 'No, what email?', time: '2:46 PM' },
        { id: 3, sender: 'Alex Smith', content: 'Check your inbox...', time: '2:46 PM' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      lastMessage: 'See you tomorrow!',
      messages: [
        { id: 1, sender: 'Sarah Johnson', content: 'Are we still on for coffee?', time: '1:30 PM' },
        { id: 2, sender: 'You', content: 'Yes, 10am works for me', time: '1:35 PM' },
        { id: 3, sender: 'Sarah Johnson', content: 'See you tomorrow!', time: '1:36 PM' }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const Message = ({ message }) => React.createElement('div', {
    className: `flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`
  },
    React.createElement('div', {
      className: `max-w-xs rounded-lg p-3 ${
        message.sender === 'You' 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-900 rounded-bl-none'
      }`
    }, [
      React.createElement('div', { 
        className: 'text-sm font-medium mb-1',
        key: 'sender'
      }, message.sender),
      React.createElement('div', { 
        className: 'text-sm',
        key: 'content'
      }, message.content),
      React.createElement('div', { 
        className: `text-xs mt-1 ${message.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`,
        key: 'time'
      }, message.time)
    ])
  );

  const ConversationItem = ({ conversation }) => React.createElement('div', {
    className: `p-3 cursor-pointer hover:bg-gray-100 ${
      selectedConversation.id === conversation.id ? 'bg-gray-100' : ''
    }`,
    onClick: () => setSelectedConversation(conversation)
  },
    React.createElement('div', {
      className: 'flex items-center space-x-3'
    }, [
      React.createElement('div', {
        key: 'avatar',
        className: 'w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'
      },
        React.createElement('span', {
          className: 'text-white text-lg'
        }, conversation.name[0])
      ),
      React.createElement('div', {
        key: 'info',
        className: 'flex-1 min-w-0'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'flex justify-between items-baseline'
        }, [
          React.createElement('h3', {
            key: 'name',
            className: 'text-sm font-medium truncate'
          }, conversation.name),
          React.createElement('span', {
            key: 'time',
            className: 'text-xs text-gray-500'
          }, conversation.messages[conversation.messages.length - 1].time)
        ]),
        React.createElement('p', {
          key: 'preview',
          className: 'text-sm text-gray-500 truncate'
        }, conversation.lastMessage)
      ])
    ])
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const updatedConversation = {
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        {
          id: selectedConversation.messages.length + 1,
          sender: 'You',
          content: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      lastMessage: newMessage
    };

    setSelectedConversation(updatedConversation);
    setNewMessage('');
  };

  return React.createElement(DraggableWindow, {
    onClose,
    initialPosition: { x: 100, y: 50 }
  }, [
    // Window Title Bar
    React.createElement('div', {
      key: 'titlebar',
      className: 'window-titlebar flex items-center justify-between bg-gray-100 p-2 rounded-t-lg border-b'
    }, 
      React.createElement('div', {
        className: 'flex items-center space-x-2'
      }, [
        React.createElement('div', {
          key: 'buttons',
          className: 'flex space-x-2'
        }, [
          React.createElement('button', {
            key: 'close',
            className: 'w-3 h-3 rounded-full bg-red-500',
            onClick: onClose
          }),
          React.createElement('div', {
            key: 'minimize',
            className: 'w-3 h-3 rounded-full bg-yellow-500'
          }),
          React.createElement('div', {
            key: 'maximize',
            className: 'w-3 h-3 rounded-full bg-green-500'
          })
        ]),
        React.createElement('span', {
          key: 'title',
          className: 'text-sm font-medium'
        }, 'Messages')
      ])
    ),
    
    // Main Content Area
    React.createElement('div', {
      key: 'content',
      className: 'flex h-96'
    }, [
      // Conversations Sidebar
      React.createElement('div', {
        key: 'sidebar',
        className: 'w-72 border-r border-gray-200 overflow-y-auto'
      },
        conversations.map(conversation => 
          React.createElement(ConversationItem, {
            key: conversation.id,
            conversation
          })
        )
      ),
      
      // Chat Area
      React.createElement('div', {
        key: 'chat',
        className: 'flex-1 flex flex-col'
      }, [
        // Messages Container
        React.createElement('div', {
          key: 'messages',
          className: 'flex-1 p-4 overflow-y-auto'
        },
          selectedConversation.messages.map(message => 
            React.createElement(Message, {
              key: message.id,
              message
            })
          )
        ),
        
        // Input Area
        React.createElement('form', {
          key: 'input-form',
          className: 'p-4 border-t',
          onSubmit: handleSendMessage
        },
          React.createElement('div', {
            className: 'flex items-center space-x-2'
          }, [
            React.createElement('input', {
              key: 'text-input',
              type: 'text',
              value: newMessage,
              onChange: (e) => setNewMessage(e.target.value),
              placeholder: 'Type a message...',
              className: 'flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            }),
            React.createElement('button', {
              key: 'send-button',
              type: 'submit',
              className: 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }, 'Send')
          ])
        )
      ])
    ])
  ]);
};

// Notes Window Component
const NotesWindow = ({ onClose }) => {
  const [note, setNote] = useState('Write your note here...');
  
  return React.createElement(DraggableWindow, {
    onClose,
    initialPosition: { x: 150, y: 100 }
  }, [
    React.createElement('div', {
      key: 'titlebar',
      className: 'window-titlebar flex items-center justify-between bg-gray-100 p-2 rounded-t-lg border-b'
    }, 
      React.createElement('div', {
        className: 'flex items-center space-x-2'
      }, [
        React.createElement('div', {
          key: 'buttons',
          className: 'flex space-x-2'
        }, [
          React.createElement('button', {
            key: 'close',
            className: 'w-3 h-3 rounded-full bg-red-500',
            onClick: onClose
          }),
          React.createElement('div', {
            key: 'minimize',
            className: 'w-3 h-3 rounded-full bg-yellow-500'
          }),
          React.createElement('div', {
            key: 'maximize',
            className: 'w-3 h-3 rounded-full bg-green-500'
          })
        ]),
        React.createElement('span', {
          key: 'title',
          className: 'text-sm font-medium'
        }, 'Notes')
      ])
    ),
    
    React.createElement('textarea', {
      key: 'content',
      className: 'w-96 h-64 p-4 focus:outline-none resize-none',
      value: note,
      onChange: (e) => setNote(e.target.value)
    })
  ]);
};

// Main Desktop Interface Component
const DesktopInterface = () => {
  const [isMessageOpen, setIsMessageOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isPhotoAlbumOpen, setIsPhotoAlbumOpen] = useState(false);

  return React.createElement('div', {
    className: 'relative w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100'
  }, [
    // Desktop Icons
    React.createElement('div', {
      key: 'icons',
      className: 'absolute top-4 left-4 space-y-4'
    }, [
      // Messages Icon
      React.createElement('div', {
        key: 'messages-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => setIsMessageOpen(true)
      }, [
        React.createElement('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, React.createElement(MessageIcon)),
        React.createElement('span', {
          className: 'mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900'
        }, 'Messages')
      ]),
      // Notes Icon
      React.createElement('div', {
        key: 'notes-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => setIsNotesOpen(true)
      }, [
        React.createElement('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, React.createElement(NotesIcon)),
        React.createElement('span', {
          className: 'mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900'
        }, 'Notes')
      ])
      React.createElement('div', {
        key: 'photo-album-icon',
        className: 'flex flex-col items-center w-20 group cursor-pointer',
        onClick: () => setIsPhotoAlbumOpen(true)
      }, [
        React.createElement('div', {
          className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
        }, React.createElement(PhotoIcon)),
        React.createElement('span', {
          className: 'mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900'
        }, 'Photos')
      ])
    ]),

    // Windows
    isMessageOpen && React.createElement(MessageWindow, {
      key: 'message-window',
      onClose: () => setIsMessageOpen(false)
    }),
    
    isNotesOpen && React.createElement(NotesWindow, {
      key: 'notes-window',
      onClose: () => setIsNotesOpen(false)
    }),

    isPhotoAlbumOpen && React.createElement(PhotoAlbumWindow, {
     key: 'photo-album-window',
     onClose: () => setIsPhotoAlbumOpen(false)
    })

    // Dock/Taskbar
    React.createElement('div', {
      key: 'dock',
      className: 'absolute bottom-0 w-full bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200'
    },
      React.createElement('div', {
        className: 'max-w-screen-lg mx-auto p-2 flex items-center justify-center space-x-2'
      }, [
        React.createElement('button', {
          key: 'dock-messages',
          className: 'w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors',
          onClick: () => setIsMessageOpen(true)
        }, React.createElement(MessageIcon)),
        React.createElement('button', {
          key: 'dock-notes',
          className: 'w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors',
          onClick: () => setIsNotesOpen(true)
        }, React.createElement(NotesIcon))
        React.createElement('button', {
          key: 'dock-photos',
          className: 'w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors',
          onClick: () => setIsPhotoAlbumOpen(true)
        }, React.createElement(PhotoIcon))
      ])
    )
  ]);
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(DesktopInterface));