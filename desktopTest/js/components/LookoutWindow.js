const { useState } = React;
const { createElement: e } = React;

import { DraggableWindow } from './DraggableWindow.js';

// Mock email data
const initialEmails = [
  {
    id: 1,
    from: 'sanguisMD@kaiser.com',
    subject: 'Results',
    body: `Dear Mr. Pell, your bloodwork analysis is completed.  I've looked them over, and I think it's best for you to 
    come in for an in-person consultation.  Let's schedule that for as soon as possible -- maybe this Thursday?
    Thanks,
    Dr. Sanguis, MD
    Hematology
    Kaiser Hemostatic Center`,
    date: '2025-01-07',
  },
  // Add more sample emails...
];

// Separate TitleBar component (similar to MessageWindow)
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
      }, 'Lookout')
    ])
  );
};

export const LookoutWindow = ({ onClose, onMinimize, isMinimized, handleMaximize, isMaximized }) => {
  const [emails] = useState(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);

  return e(DraggableWindow, {
    onClose,
    onMinimize,
    isMinimized,
    initialPosition: { x: 250, y: 150 },
  }, [
    // Window Title Bar
    e(TitleBar, {
      key: 'titlebar',
      onClose,
      onMinimize,
      handleMaximize
    }),

    // Email List
    e('div', {
      key: 'email-list',
      className: `p-4 overflow-y-auto ${isMaximized ? 'h-[calc(100vh-48px)]' : 'h-96'}`
    },
      e('ul', {
        className: 'space-y-2',
      },
        emails.map((email) => (
          e('li', {
            key: email.id,
            className: 'p-2 border rounded cursor-pointer hover:bg-gray-100',
            onClick: () => setSelectedEmail(email),
          }, [
            e('div', {
              key: 'from',
              className: 'font-medium',
            }, email.from),
            e('div', {
              key: 'subject',
              className: 'text-sm',
            }, email.subject),
          ])
        )),
      ),
    ),

    // Email Details
    selectedEmail && e('div', {
      key: 'email-details',
      className: 'p-4 border-t',
    }, [
      e('h2', {
        key: 'subject',
        className: 'text-xl font-medium mb-2',
      }, selectedEmail.subject),
      e('p', {
        key: 'body',
        className: 'text-sm',
      }, selectedEmail.body),
    ]),
  ]);
}