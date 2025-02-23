const { useState } = React;
const { createElement: e } = React;

import { DraggableWindow } from './DraggableWindow.js';

// Mock conversation data
const initialConversations = [
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
];

const Message = ({ message }) => e('div', {
  className: `flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`
},
  e('div', {
    className: `max-w-xs rounded-lg p-3 ${
      message.sender === 'You' 
        ? 'bg-blue-500 text-white rounded-br-none' 
        : 'bg-gray-200 text-gray-900 rounded-bl-none'
    }`
  }, [
    e('div', { 
      className: 'text-sm font-medium mb-1',
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

const ConversationItem = ({ conversation, isSelected, onClick }) => e('div', {
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
      }, conversation.name[0])
    ),
    e('div', {
      key: 'info',
      className: 'flex-1 min-w-0'
    }, [
      e('div', {
        key: 'header',
        className: 'flex justify-between items-baseline'
      }, [
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
      }, conversation.lastMessage)
    ])
  ])
);

export const MessageWindow = ({ onClose }) => {
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
    initialPosition: { x: 100, y: 50 }
  }, [
    // Window Title Bar
    e('div', {
      key: 'titlebar',
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
            className: 'w-3 h-3 rounded-full bg-red-500',
            onClick: onClose
          }),
          e('div', {
            key: 'minimize',
            className: 'w-3 h-3 rounded-full bg-yellow-500'
          }),
          e('div', {
            key: 'maximize',
            className: 'w-3 h-3 rounded-full bg-green-500'
          })
        ]),
        e('span', {
          key: 'title',
          className: 'text-sm font-medium'
        }, 'Messages')
      ])
    ),
    
    // Main Content Area
    e('div', {
      key: 'content',
      className: 'flex h-96'
    }, [
      // Conversations Sidebar
      e('div', {
        key: 'sidebar',
        className: 'w-72 border-r border-gray-200 overflow-y-auto'
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
        className: 'flex-1 flex flex-col'
      }, [
        // Messages Container
        e('div', {
          key: 'messages',
          className: 'flex-1 p-4 overflow-y-auto'
        },
          selectedConversation.messages.map(message => 
            e(Message, {
              key: message.id,
              message
            })
          )
        ),
        
        // Input Area
        e('form', {
          key: 'input-form',
          className: 'p-4 border-t',
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
    ])
  ]);
};