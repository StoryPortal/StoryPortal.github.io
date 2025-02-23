// js/components/LookoutWindow.js
const { useState } = React;
const { createElement: e } = React;

import { DraggableWindow } from './DraggableWindow.js';

// Mock email data
const initialEmails = [
  {
    id: 1,
    from: 'john@example.com',
    subject: 'Meeting Reminder',
    body: 'Don\'t forget about the meeting tomorrow at 10 AM.',
    date: '2024-02-24',
  },
  // Add more sample emails...
];

export const LookoutWindow = ({ onClose }) => {
  const [emails] = useState(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);

  return e(DraggableWindow, {
    onClose,
    initialPosition: { x: 250, y: 150 },
  }, [
    // Window Title Bar
    e('div', {
      key: 'titlebar',
      className: 'window-titlebar flex items-center justify-between bg-gray-100 p-2 rounded-t-lg border-b',
    },
      e('div', {
        className: 'flex items-center space-x-2',
      }, [
        e('div', {
          key: 'buttons',
          className: 'flex space-x-2',
        }, [
          e('button', {
            key: 'close',
            className: 'w-3 h-3 rounded-full bg-red-500',
            onClick: onClose,
          }),
          // Add minimize and maximize buttons...
        ]),
        e('span', {
          key: 'title',
          className: 'text-sm font-medium',
        }, 'Lookout'),
      ]),
    ),

    // Email List
    e('div', {
      key: 'email-list',
      className: 'p-4 overflow-y-auto h-96',
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
};