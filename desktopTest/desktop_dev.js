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

// Conversation Item Component
const ConversationItem = ({ conversation, onSelect }) => {
  return React.createElement('div', {
    className: 'cursor-pointer p-2 hover:bg-gray-200',
    onClick: () => onSelect(conversation)
  }, [
    React.createElement('div', {
      className: 'font-medium text-sm'
    }, conversation.name),
    React.createElement('div', {
      className: 'text-xs text-gray-500'
    }, conversation.lastMessage)
  ]);
};

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
      name: 'Naomi, Robert',
      lastMessage: 'Ok! See you at 12 ʕ·͡ᴥ·ʔ',
      messages: [
        { id: 1, sender: 'You', content: 'Friends!! You know how weve been talking about doing a friends getaway/artist\'s retreat/psyche bath thing? Well…let\'s do it!! This weekend? Next weekend? Whenever you\'re all free…I'm thinking of taking some time off work so I can be pretty available. And don\'t worry nothing\'s wrong I just have a toon of PTO saved that I need to use by the end of the year. I can make time. For you. God, I haven\'t taken a vacation in years. I really want to spend more quality time with yall and just get away from liiifee and chill. For the rest of my life haha. I have so much to tell you. ', time: '4:03 AM' },
        { id: 2, sender: 'You', content: '(ok I reread my texts and I\'m panicking because I sound crazy. I swear I\'m not drunk. Or on any drugs. Totally sober... unless you count Cherry Coke Zero.)', time: '4:10 AM' },
        { id: 3, sender: 'You', content: 'Sorry for all the texts I\'m just so excited. I think it\'s best if we talk tomorrow in person about this. Are you free for coffee or lunch to discuss? Zomg let\'s go to Sea Wolf… I would kill for a savory croissant right now.', time: '4:15 AM' },
        { id: 4, sender: 'Robert', content: 'just gt off work. im frd. fried.', time: '7:07 AM'},
        { id: 5, sender: 'Robert', content: 'wtf????', time: '7:30 AM' },
        { id: 6, sender: 'Robert', content: 'im down', time: '7:32 AM' },
        { id: 7, sender: 'Naomi', content: 'Hello friends! An artist\'s retreat sounds amazing. I\'m always in. The farmhouse is available this weekend. We had a cancellation due to the “bad weather.” Hehe. I could plan something amazing really quickly! On a serious note…Alex are you doing okay? I\'m in the studio all day, but why don\'t we meet at the cafe nearby at 12?', time: '9:00 AM' },
        { id: 8, sender: 'You', content: 'Ok! See you at 12 ʕ·͡ᴥ·ʔ', time: '9:05 AM' }
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
            conversation,
            onSelect: setSelectedConversation
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
          className: 'w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center'
        }, React.createElement(NotesIcon)),
        React.createElement('span', {
          className: 'mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900'
        }, 'Notes')
      ])
    ])
  ]);
};

// Render the Desktop Interface component to the root element
ReactDOM.render(
  React.createElement(DesktopInterface),
  document.getElementById('root')
);
