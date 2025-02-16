import React, { useState } from 'react';

const DesktopInterface = () => {
  const [isMessageOpen, setIsMessageOpen] = useState(true);
  const [messages] = useState([
    { id: 1, sender: 'Alex', content: 'Hey, did you see that weird email?', time: '2:45 PM' },
    { id: 2, sender: 'You', content: 'No, what email?', time: '2:46 PM' },
    { id: 3, sender: 'Alex', content: 'Check your inbox...', time: '2:46 PM' }
  ]);   

  // Window Component
  const Window = ({ title, children, onClose }) => (
    <div className="absolute top-10 left-1/4 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded-t-lg border-b">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <button 
              className="w-3 h-3 rounded-full bg-red-500"
              onClick={onClose}
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
      {/* Window Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );

  // Message Component
  const Message = ({ message }) => (
    <div className={`flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs rounded-lg p-3 ${
        message.sender === 'You' 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-900 rounded-bl-none'
      }`}>
        <div className="text-sm font-medium mb-1">{message.sender}</div>
        <div className="text-sm">{message.content}</div>
        <div className={`text-xs mt-1 ${message.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`}>
          {message.time}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 space-y-4">
        <div className="flex flex-col items-center w-20 group cursor-pointer">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span className="mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900">
            Messages
          </span>
        </div>
      </div>

      {/* Message Window */}
      {isMessageOpen && (
        <Window title="Messages" onClose={() => setIsMessageOpen(false)}>
          <div className="space-y-4">
            {/* Messages Container */}
            <div className="h-96 overflow-y-auto">
              {messages.map(message => (
                <Message key={message.id} message={message} />
              ))}
            </div>
            {/* Input Area */}
            <div className="flex items-center space-x-2 border-t pt-4">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Send
              </button>
            </div>
          </div>
        </Window>
      )}

      {/* Dock/Taskbar */}
      <div className="absolute bottom-0 w-full bg-white bg-opacity-80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-screen-lg mx-auto p-2 flex items-center justify-center space-x-2">
          <button 
            className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
            onClick={() => setIsMessageOpen(true)}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopInterface;