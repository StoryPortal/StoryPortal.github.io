// js/components/MessageWindow.js
const { useState } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Mock conversation data to support group messaging
const initialConversations = [
  {
    id: 1,
    name: 'Naomi Rosalyn',
    participants: ['Naomi Rosalyn'],
    lastMessage: ':-)',
    messages: [
      { 
        id: 1, 
        sender: 'Naomi Rosalyn', 
        content: `Hello there! I am getting the farmhouse rooms sorted for our retreat this weekend.
         I'm giving you the special cupola room - great for star gazing. 
         Also, how did things go at the doctor? Sending good thoughts your way!`, 
        time: '8:30 PM' 
      },
      { 
        id: 2, 
        sender: 'Naomi Rosalyn', 
        content: ':-)', 
        time: '8:31 PM' 
      }
    ]
  },
  {
    id: 2,
    name: 'Rob Blanchett',
    participants: ['Rob Blanchett'],
    lastMessage: `im a doctor. just send me ur recs. im rushing 2 work. will respond when i can`,
    messages: [
      { 
        id: 1, 
        sender: 'You', 
        content: `Doctor said it's probably just stress. Psychosomatic? 
        Know anything about that? I really really think something is wrong.
        I'm gonna ask for another blood test. Or try someone else. Can you order something for me?`, 
        time: '6:00 PM' 
      },
      { 
        id: 2, 
        sender: 'Rob Blanchett', 
        content: `not my expertise but u can send me ur recrds for 2nd opinion.`, 
        time: '6:10 PM' 
      },
      { 
        id: 3, 
        sender: 'Rob Blanchett', 
        content: `i saw a crazy doc about psychosomatic disorder...
        patients come in all the time for stress stuff.`, 
        time: '6:10 PM' 
      },
      { 
        id: 4, 
        sender: 'Rob Blanchett', 
        content: `ur 2 young to be so stressed. 
        take soem time off work. get off the internet.`, 
        time: '6:10 PM' 
      },
      {
      id: 4, 
      sender: 'You', 
      content: `We're literally the same age....and you're the most stressed out person I know`, 
      time: '6:20 PM' 
      },
      { 
        id: 5, 
        sender: 'Rob Blanchett', 
        content: `im a doctor. just send me ur recs. im rushing 2 work. will respond when i can`, 
        time: '6:32 PM' 
      }
    ]
  },
  {
    id: 3,
    name: 'Banana Bonanza Bros',
    participants: ['Rob', 'Naomi Rosalyn'],
    lastMessage: `Ok!!! See you at 12.    ʕ·͡ᴥ·ʔ`,
    messages: [
      { 
        id: 1, 
        sender: 'You', 
        content: `Friends!! You know how we've been talking 
         about doing a friends getaway/artist's retreat/psyche bath thing?  
         Well…let's do it!! This weekend? Next weekend? Whenever you're all free…I'm
        thinking of taking some time off work so I can be pretty available. 
        And don't worry nothing's wrong I just have a toon of PTO saved that I need 
        to use by the end of the year. I can make time. For you. God, I haven't 
        taken a vacation in years. I really want to spend more quality time with 
        y'all and just get away from liiifee and chill. For the rest of my life 
        haha. I have so much to tell you.`, 
        time: '4:03 AM' 
      },
      { 
        id: 2, 
        sender: 'You', 
        content: `(ok I reread my texts and I'm panicking because I sound crazy.
         I swear I'm not drunk. Or on any drugs. Totally sober - unless you count Diet Coke.).`, 
        time: '4:10 AM' 
      },
      { 
        id: 3, 
        sender: 'You', 
        content: `A few ideas for our getaway trip....check your email.`, 
        time: '4:11 AM' 
      },
      { 
        id: 4, 
        sender: 'You', 
        content: `Sorry for all the texts I'm just so excited.
         I think it's best if we talk tomorrow in person about this.
          Are you free for coffee or lunch to discuss? 
          Zomg let's go to Sea Wolf… I would kill for a savory croissant right now. `, 
        time: '4:15 AM' 
      },
      { 
        id: 5, 
        sender: 'Rob', 
        content: 'jst got off work. im fred.', 
        time: '7:07 AM' 
      },
      { 
        id: 6, 
        sender: 'Rob', 
        content: 'fried.', 
        time: '7:07 AM' 
      },
      { 
        id: 7, 
        sender: 'Rob', 
        content: 'wtf????? ', 
        time: '7:30 AM' 
      },
      { 
        id: 8, 
        sender: 'Rob', 
        content: `lol i'm down `, 
        time: '7:31 AM' 
      },
      { 
        id: 9, 
        sender: 'Naomi Rosalyn', 
        content: `Hello friends! An artist's retreat sounds amazing. 
        I'm always in. The farmhouse is available this weekend. 
        We had a cancellation due to the ~bad weather~ haha. It's just a little drizzly!
        I could plan something amazing really quickly! 
        Oh well, their loss is our gain! 
        On a serious note...Alex are you okay??
        I'm in the studio all day, but why don't we meet grab coffee nearby at 12 and we can migrate to the studio if we need some privacy to chat. `, 
        time: '9:00 AM' 
      },
      { 
        id: 10, 
        sender: 'You', 
        content: `Ok!!! See you at 12.   ʕ·͡ᴥ·ʔ`, 
        time: '9:01 AM' 
      }
    ]
  }
];

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
  const avatarText = conversation.participants.length > 1
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
          conversation.participants.length > 1
            ? `${conversation.messages[conversation.messages.length - 1].sender}: ${conversation.lastMessage}`
            : conversation.lastMessage
        )
      ])
    ])
  );
};

// MessageContent Component - Separated from window frame
const MessageContent = ({ isMaximized, windowSize }) => {
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

  return e('div', {
    className: 'flex h-full'
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
            message,
            isGroup: selectedConversation.participants.length > 1
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

// Main MessageWindow component using the WindowFrame
export const MessageWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for messaging app
  const messageTheme = {
    titleBarBg: 'bg-blue-100',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-yellow-500 hover:bg-yellow-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-blue-300'
  };

  return e(WindowFrame, {
    title: 'Messages',
    initialPosition: { x: 100, y: 50 },
    initialSize: { width: 800, height: 500 },
    minSize: { width: 500, height: 300 },
    onClose,
    onMinimize,
    isMinimized,
    theme: messageTheme
  }, 
    e(MessageContent)
  );
};