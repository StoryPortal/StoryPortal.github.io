// js/components/LookoutWindow.js
const { useState } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Mock email data
const initialEmails = [
  {
    id: 1,
    from: 'sanguisMD@kaiser.com',
    subject: 'Results',
    body: `Dear Mr. Pell,

Your bloodwork analysis is completed. You can review the report in the attachment I've provided here. 
Please let me know if you have any questions.

Thanks,  
Dr. Sanguis, MD  
Hematology  
Kaiser Hemostatic Center`,
    date: '2025-01-07',
  },
  // Add more sample emails as needed
];

// LookoutContent Component - Separated from window frame
const LookoutContent = ({ isMaximized, windowSize }) => {
  const [emails] = useState(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [folderView, setFolderView] = useState('inbox');

  // Folder structure for email organization
  const folders = [
    { id: 'inbox', name: 'Inbox', count: 1 },
    { id: 'sent', name: 'Sent', count: 0 },
    { id: 'drafts', name: 'Drafts', count: 0 },
    { id: 'trash', name: 'Trash', count: 0 }
  ];

  // Filter emails based on selected folder
  const filteredEmails = emails.filter(email => {
    // In a real app, each email would have a folder property
    // For now, all emails are in the inbox
    return folderView === 'inbox';
  });

  return e('div', {
    className: 'flex h-full'
  }, [
    // Folders Sidebar
    e('div', {
      key: 'folders',
      className: 'w-48 bg-gray-50 border-r border-gray-200 p-2'
    },
      e('div', {
        className: 'space-y-1'
      }, [
        // New Email Button
        e('button', {
          key: 'new-email',
          className: 'w-full py-2 px-3 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors',
          onClick: () => {/* Add new email functionality */}
        }, 'New Email'),
        
        // Folders List
        ...folders.map(folder => 
          e('button', {
            key: folder.id,
            className: `w-full text-left py-2 px-3 rounded flex justify-between items-center ${
              folderView === folder.id 
                ? 'bg-blue-100 text-blue-800' 
                : 'hover:bg-gray-200'
            }`,
            onClick: () => setFolderView(folder.id)
          }, [
            e('span', { key: 'name' }, folder.name),
            folder.count > 0 && e('span', { 
              key: 'count',
              className: 'bg-blue-500 text-white text-xs rounded-full px-2 py-1'
            }, folder.count)
          ])
        )
      ])
    ),

    // Email List and Preview Panel
    e('div', {
      key: 'main-content',
      className: 'flex-1 flex flex-col'
    }, [
      // Toolbar with search
      e('div', {
        key: 'toolbar',
        className: 'border-b border-gray-200 p-2 flex'
      }, 
        e('input', {
          type: 'text',
          placeholder: 'Search emails...',
          className: 'flex-1 px-3 py-1 border rounded-lg'
        })
      ),
      
      // Email content area (split view)
      e('div', {
        key: 'email-content',
        className: 'flex-1 flex'
      }, [
        // Email List
        e('div', {
          key: 'email-list',
          className: 'w-1/3 border-r border-gray-200 overflow-y-auto'
        },
          filteredEmails.length > 0 ? 
            e('ul', {
              className: 'divide-y divide-gray-200',
            },
              filteredEmails.map((email) => (
                e('li', {
                  key: email.id,
                  className: `p-3 cursor-pointer hover:bg-gray-100 ${selectedEmail && selectedEmail.id === email.id ? 'bg-blue-50' : ''}`,
                  onClick: () => setSelectedEmail(email),
                }, [
                  e('div', {
                    key: 'email-header',
                    className: 'flex justify-between'
                  }, [
                    e('span', {
                      key: 'from',
                      className: 'font-medium text-sm'
                    }, email.from),
                    e('span', {
                      key: 'date',
                      className: 'text-xs text-gray-500'
                    }, new Date(email.date).toLocaleDateString())
                  ]),
                  e('div', {
                    key: 'subject',
                    className: 'font-medium text-sm mt-1'
                  }, email.subject),
                  e('div', {
                    key: 'preview',
                    className: 'text-xs text-gray-500 mt-1 truncate'
                  }, email.body.substring(0, 50) + '...')
                ])
              ))
            ) : 
            e('div', {
              className: 'flex items-center justify-center h-full text-gray-500 p-4'
            }, 'No emails in this folder')
        ),
        
        // Email Detail View
        e('div', {
          key: 'email-detail',
          className: 'flex-1 p-4 overflow-y-auto'
        },
          selectedEmail ? [
            e('div', {
              key: 'detail-header',
              className: 'border-b border-gray-200 pb-3 mb-3'
            }, [
              e('h2', {
                key: 'subject',
                className: 'text-xl font-medium'
              }, selectedEmail.subject),
              e('div', {
                key: 'meta',
                className: 'flex justify-between text-sm text-gray-600 mt-2'
              }, [
                e('div', { key: 'from' }, `From: ${selectedEmail.from}`),
                e('div', { key: 'date' }, new Date(selectedEmail.date).toLocaleString())
              ])
            ]),
            e('div', {
              key: 'body',
              className: 'whitespace-pre-line text-sm'
            }, selectedEmail.body),
            e('div', {
              key: 'actions',
              className: 'mt-4 pt-3 border-t border-gray-200 flex space-x-2'
            }, [
              e('button', {
                key: 'reply',
                className: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200'
              }, 'Reply'),
              e('button', {
                key: 'forward',
                className: 'px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
              }, 'Forward')
            ])
          ] : 
          e('div', {
            className: 'flex items-center justify-center h-full text-gray-500'
          }, 'Select an email to read')
        )
      ])
    ])
  ]);
};

// Main LookoutWindow component using the WindowFrame
export const LookoutWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for email client
  const lookoutTheme = {
    titleBarBg: 'bg-purple-50',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-yellow-500 hover:bg-yellow-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-purple-200'
  };

  return e(WindowFrame, {
    title: 'Lookout',
    initialPosition: { x: 250, y: 150 },
    initialSize: { width: 900, height: 600 },
    minSize: { width: 500, height: 300 },
    onClose,
    onMinimize,
    isMinimized,
    theme: lookoutTheme
  }, 
    e(LookoutContent)
  );
};