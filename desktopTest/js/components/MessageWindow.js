const { useState } = React;
const { createElement: e } = React;

import { DraggableWindow } from './DraggableWindow.js';

// Mock conversation data to support group messaging
const initialConversations = [
  {
    id: 1,
    name: 'Banana Bonanza Bros',
    participants: ['Rob Blanchettey', 'Naomi Rosalyn', 'Bilbo Baggins'],
    lastMessage: `lol i'm down`,
    messages: [
      { 
        id: 4123214, 
        sender: 'You', 
        content: `Friends!! You know how we’ve been talking 
         'about doing a friends getaway/artist’s retreat/psyche bath thing?  
         Well…let’s do it!! This weekend? Next weekend? Whenever you’re all free…I’m
        thinking of taking some time off work so I can be pretty available. 
        And don’t worry nothing’s wrong I just have a toon of PTO saved that I need 
        to use by the end of the year. I can make time. For you. God, I haven’t 
        taken a vacation in years. I really want to spend more quality time with 
        y’all and just get away from liiifee and chill. For the rest of my life 
        haha. I have so much to tell you.`, 
        time: '7:27 PM' 
      },
      { 
        id: 132532, 
        sender: 'Rob', 
        content: 'jst off wrk. im fred.', 
        time: '7:27 PM' 
      },
      { 
        id: 1122, 
        sender: 'Rob', 
        content: 'fried ', 
        time: '7:28 PM' 
      },
      { 
        id: 424242, 
        sender: 'Naomi Rosalyn', 
        content: 'wtf????? ', 
        time: '7:30 PM' 
      },
      { 
        id: 12421, 
        sender: 'Rob', 
        content: `lol i'm down`, 
        time: '12:00 AM' 
      }
      
    ]
  },
  {
    id: 2,
    name: 'Family Chat',
    participants: ['Mom', 'Dad', 'Sister', 'Brother'],
    lastMessage: 'shut up',
    messages: [
      { 
        id: 1, 
        sender: 'Mom', 
        content: 'Who\'s cooking tonight?', 
        time: '1:30 PM' 
      },
      { 
        id: 2, 
        sender: 'Sister', 
        content: 'I can order pizza', 
        time: '1:35 PM' 
      },
      { 
        id: 3, 
        sender: 'Dad', 
        content: 'Whooaaa', 
        time: '1:36 PM' 
      }
    ]
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    participants: ['Sarah Johnson'],
    lastMessage: 'See you tomorrow!',
    messages: [
      { 
        id: 1, 
        sender: 'Sarah Johnson', 
        content: 'Are we still on for coffee?', 
        time: '1:30 PM' 
      },
      { 
        id: 2, 
        sender: 'You', 
        content: 'Yes, 10am works for me', 
        time: '1:35 PM' 
      },
      { 
        id: 3, 
        sender: 'Sarah Johnson', 
        content: 'See you tomorrow!', 
        time: '1:36 PM' 
      }
    ]
  }
];

const TitleBar = ({ onClose, onMinimize, handleMaximize }) => {
  return e('div', {
    className: 'window-titlebar flex items-center justify-between bg-gray-100 p-2 rounded-t-lg border-b'
  }, 
    e('div', {
      className: 'flex items-center space-x-2'
    }, [
      e('div', {
        key: 'buttons',
        className: 'flex space-x-2'
      }, [
        e('button', {
          key: 'close',
          className: 'w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors',
          onClick: (e) => {
            e.stopPropagation();
            onClose();
          },
          title: 'Close'
        }),
        e('button', {
          key: 'minimize',
          className: 'w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors',
          onClick: (e) => {
            e.stopPropagation();
            onMinimize();
          },
          title: 'Minimize'
        }),
        e('button', {
          key: 'maximize',
          className: 'w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors',
          onClick: (e) => {
            e.stopPropagation();
            if (typeof handleMaximize === 'function') {
              handleMaximize();
            }
          },
          title: 'Maximize'
        })
      ]),
      e('span', {
        key: 'title',
        className: 'text-sm font-medium ml-2'
      }, 'Messages')
    ])
  );
};

// Updated Message component to show sender in group chats
const Message = ({ message, isGroup }) => {
  return e('div', {
    className: `flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`
  },
    e('div', {
      className: `max-w-xs rounded-lg p-3 ${
        message.sender === 'You' 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-900 rounded-bl-none'
      }`
    }, [
      // Show sender name only in group chats
      isGroup && message.sender !== 'You' && e('div', { 
        className: 'text-xs font-medium mb-1 text-gray-700',
        key: 'sender'
      }, message.sender),
      e('div', { 
        className: 'text-sm',
        key: 'content'
      }, message.content),
      e('div', { 
        className: `text-xs mt-1 ${message.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`,
        key: 'time'
      }, message.time)
    ])
  );
};

// Updated ConversationItem to show participants in group chats
const ConversationItem = ({ conversation, isSelected, onClick }) => {
  // Generate avatar based on first letters of participants or first participant
  const avatarText = conversation.participants.length > 2 
    ? conversation.participants.slice(0, 2).map(p => p[0]).join('')
    : conversation.participants[0][0];

  return e('div', {
    className: `p-3 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-gray-100' : ''}`,
    onClick: onClick
  },
    e('div', {
      className: 'flex items-center space-x-3'
    }, [
      e('div', {
        key: 'avatar',
        className: 'w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'
      },
        e('span', {
          className: 'text-white text-lg'
        }, avatarText)
      ),
      e('div', {
        key: 'info',
        className: 'flex-1 min-w-0'
      }, [
        e('div', {
          key: 'header',
          className: 'flex justify-between items-baseline'
        }, [
          // Show group name and participants
          e('h3', {
            key: 'name',
            className: 'text-sm font-medium truncate'
          }, conversation.name),
          e('span', {
            key: 'time',
            className: 'text-xs text-gray-500'
          }, conversation.messages[conversation.messages.length - 1].time)
        ]),
        e('p', {
          key: 'preview',
          className: 'text-sm text-gray-500 truncate'
        }, 
          conversation.participants.length > 2 
            ? `${conversation.messages[conversation.messages.length - 1].sender}: ${conversation.lastMessage}`
            : conversation.lastMessage
        )
      ])
    ])
  );
};

// MessageWindowContent with group messaging support
const MessageWindowContent = ({ 
  isMaximized, 
  conversations, 
  selectedConversation, 
  setSelectedConversation, 
  newMessage, 
  setNewMessage, 
  handleSendMessage 
}) => {
  return e('div', {
    key: 'content',
    className: `flex ${isMaximized ? 'h-[calc(100vh-48px)]' : 'h-96'}`
  }, [
    // Conversations Sidebar
    e('div', {
      key: 'sidebar',
      className: `w-72 border-r border-gray-200 overflow-y-auto ${isMaximized ? 'h-full' : ''}`
    },
      conversations.map(conversation => 
        e(ConversationItem, {
          key: conversation.id,
          conversation,
          isSelected: selectedConversation.id === conversation.id,
          onClick: () => setSelectedConversation(conversation)
        })
      )
    ),
    
    // Chat Area
    e('div', {
      key: 'chat',
      className: `flex-1 flex flex-col ${isMaximized ? 'h-full' : ''}`
    }, [
      // Messages Container
      e('div', {
        key: 'messages',
        className: 'flex-1 p-4 overflow-y-auto'
      },
        selectedConversation.messages.map(message => 
          e(Message, {
            key: message.id,
            message,
            isGroup: selectedConversation.participants.length > 2
          })
        )
      ),
      
      // Input Area
      e('form', {
        key: 'input-form',
        className: 'p-4 border-t bg-white',
        onSubmit: handleSendMessage
      },
        e('div', {
          className: 'flex items-center space-x-2'
        }, [
          e('input', {
            key: 'text-input',
            type: 'text',
            value: newMessage,
            onChange: (e) => setNewMessage(e.target.value),
            placeholder: 'Type a message...',
            className: 'flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          }),
          e('button', {
            key: 'send-button',
            type: 'submit',
            className: 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }, 'Send')
        ])
      )
    ])
  ]);
};

export const MessageWindow = ({ onClose, onMinimize, isMinimized, handleMaximize, isMaximized }) => {
  const [conversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

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

  return e(DraggableWindow, {
    onClose,
    onMinimize,
    isMinimized,
    initialPosition: { x: 100, y: 50 }
  }, [
    e(TitleBar, {
      key: 'titlebar',
      onClose,
      onMinimize,
      handleMaximize
    }),
    e(MessageWindowContent, {
      key: 'window-content',
      isMaximized: false, // Will be filled in by DraggableWindow
      conversations,
      selectedConversation,
      setSelectedConversation,
      newMessage,
      setNewMessage,
      handleSendMessage
    })
  ]);
};