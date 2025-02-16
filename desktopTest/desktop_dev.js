// Message Window Component
const MessageWindow = ({ thread, onClose }) => {
    const [messages, setMessages] = useState(thread.messages);
  
    const Message = ({ message }) => (
      React.createElement('div', {
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
      )
    );
  
    return React.createElement(DraggableWindow, {
      onClose,
      initialPosition: { x: 100, y: 50 }
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
          }, thread.name)
        ])
      ),
      
      React.createElement('div', {
        key: 'content',
        className: 'p-4'
      },
        React.createElement('div', {
          className: 'space-y-4'
        }, [
          React.createElement('div', {
            key: 'messages',
            className: 'h-96 overflow-y-auto'
          },
            messages.map(message => 
              React.createElement(Message, {
                key: message.id,
                message: message
              })
            )
          ),
          React.createElement('div', {
            key: 'input',
            className: 'flex items-center space-x-2 border-t pt-4'
          }, [
            React.createElement('input', {
              key: 'textinput',
              type: 'text',
              placeholder: 'Type a message...',
              className: 'flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            }),
            React.createElement('button', {
              key: 'send',
              className: 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }, 'Send')
          ])
        ])
      )
    ]);
  };
  
  // Main Desktop Interface Component
  const DesktopInterface = () => {
    const [threads, setThreads] = useState([
      {
        id: 1,
        name: 'Alex',
        messages: [
          { id: 1, sender: 'Alex', content: 'Hey, did you see that weird email?', time: '2:45 PM' },
          { id: 2, sender: 'You', content: 'No, what email?', time: '2:46 PM' },
          { id: 3, sender: 'Alex', content: 'Check your inbox...', time: '2:46 PM' },
          { id: 4, sender: 'You', content: 'https://www.google.com', time: '1:50 PM' }
        ]
      },
      {
        id: 2,
        name: 'John',
        messages: [
          { id: 1, sender: 'John', content: 'How was your day?', time: '3:15 PM' },
          { id: 2, sender: 'You', content: 'It was great!', time: '3:16 PM' }
        ]
      }
    ]);
  
    const [activeThread, setActiveThread] = useState(null);
  
    const openThread = (thread) => {
      setActiveThread(thread);
    };
  
    return React.createElement('div', {
      className: 'relative w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100'
    }, [
      React.createElement('div', {
        key: 'icons',
        className: 'absolute top-4 left-4 space-y-4'
      }, threads.map(thread => (
        React.createElement('div', {
          key: thread.id,
          className: 'flex flex-col items-center w-20 group cursor-pointer',
          onClick: () => openThread(thread)
        }, [
          React.createElement('div', {
            className: 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'
          }, React.createElement(MessageIcon)),
          React.createElement('span', {
            className: 'mt-1 text-xs text-center text-gray-700 group-hover:text-gray-900'
          }, thread.name)
        ])
      ))),
  
      activeThread && React.createElement(MessageWindow, {
        key: 'message-window',
        thread: activeThread,
        onClose: () => setActiveThread(null)
      }),
  
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
            onClick: () => openThread(threads[0])
          }, React.createElement(MessageIcon))
        ])
      )
    ]);
  };
  
  // Render the app
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(DesktopInterface)
  );
  
