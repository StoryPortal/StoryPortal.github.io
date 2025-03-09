// js/components/LookoutWindow.js
const { useState } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Email data with folder property
const initialEmails = [
  {
    id: 1,
    from: 'sanguisMD@kaiser.com',
    to: 'you@example.com',
    subject: 'Results',
    body: `Dear Mr. Pell,

Your bloodwork analysis is completed. You can review the report in the attachment I've provided here. 
Please let me know if you have any questions.

Thanks,  
Dr. Sanguis, MD  
Hematology  
Kaiser Hemostatic Center`,
    date: '2025-01-07',
    folder: 'inbox'
  },
  {
    id: 1,
    from: 'sanguisMD@kaiser.com',
    to: 'you@example.com',
    subject: 'Results',
    body: `Dear Mr. Pell,

Your bloodwork analysis is completed. You can review the report in the attachment I've provided here. 
Please let me know if you have any questions.

Thanks,  
Dr. Sanguis, MD  
Hematology  
Kaiser Hemostatic Center`,
    date: '2025-01-07',
    folder: 'sent'
  },
];

// LookoutContent Component - Separated from window frame
const LookoutContent = ({ isMaximized, windowSize }) => {
  const [emails, setEmails] = useState(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [folderView, setFolderView] = useState('inbox');
  const [composeMode, setComposeMode] = useState(false);
  const [draftEmail, setDraftEmail] = useState(null);
  const [userEmail] = useState('you@example.com'); // User's email address

  // Folder structure for email organization
  const folders = [
    { id: 'inbox', name: 'Inbox', count: emails.filter(email => email.folder === 'inbox').length },
    { id: 'sent', name: 'Sent', count: emails.filter(email => email.folder === 'sent').length },
    { id: 'drafts', name: 'Drafts', count: emails.filter(email => email.folder === 'drafts').length },
    { id: 'trash', name: 'Trash', count: emails.filter(email => email.folder === 'trash').length }
  ];

  // Filter emails based on selected folder
  const filteredEmails = emails.filter(email => email.folder === folderView);

  // Create a new email draft
  const createNewEmail = () => {
    const newEmail = {
      id: Date.now(), // Use timestamp as ID
      from: userEmail,
      to: '',
      subject: '',
      body: '',
      date: new Date().toISOString().split('T')[0],
      folder: 'drafts'
    };
    
    setDraftEmail(newEmail);
    setComposeMode(true);
    setSelectedEmail(null);
  };

  // Update draft email content
  const updateDraft = (field, value) => {
    setDraftEmail(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save the current draft
  const saveDraft = () => {
    if (!draftEmail) return;
    
    // Check if this is a new draft or an existing one
    const emailExists = emails.some(e => e.id === draftEmail.id);
    
    if (emailExists) {
      // Update existing email
      setEmails(emails.map(e => e.id === draftEmail.id ? {
        ...draftEmail,
        date: new Date().toISOString().split('T')[0]
      } : e));
    } else {
      // Add new email
      setEmails([...emails, {
        ...draftEmail,
        date: new Date().toISOString().split('T')[0]
      }]);
    }
    
    setComposeMode(false);
    setDraftEmail(null);
    setFolderView('drafts');
  };

  // Send the current email
  const sendEmail = () => {
    if (!draftEmail || !draftEmail.to || !draftEmail.subject) {
      alert('Please add a recipient and subject before sending.');
      return;
    }
    
    const sentEmail = {
      ...draftEmail,
      folder: 'sent',
      date: new Date().toISOString().split('T')[0]
    };
    
    // Check if this is a new email or an existing draft
    const emailExists = emails.some(e => e.id === draftEmail.id);
    
    if (emailExists) {
      // Update existing email
      setEmails(emails.map(e => e.id === draftEmail.id ? sentEmail : e));
    } else {
      // Add new email
      setEmails([...emails, sentEmail]);
    }
    
    setComposeMode(false);
    setDraftEmail(null);
    setFolderView('sent');
  };

  // Discard the current draft
  const discardDraft = () => {
    setComposeMode(false);
    setDraftEmail(null);
  };

  // Edit an existing email (draft or sent)
  const editEmail = (email) => {
    setDraftEmail({...email});
    setComposeMode(true);
    setSelectedEmail(null);
  };

  // Delete an email (move to trash)
  const deleteEmail = (email) => {
    setEmails(emails.map(e => 
      e.id === email.id ? {...e, folder: 'trash'} : e
    ));
    
    if (selectedEmail && selectedEmail.id === email.id) {
      setSelectedEmail(null);
    }
  };

  // Email Composer Component
  const EmailComposer = () => {
    return e('div', {
      className: 'flex-1 flex flex-col'
    }, [
      // Toolbar with actions
      e('div', {
        key: 'composer-toolbar',
        className: 'border-b border-gray-200 p-2 flex bg-gray-50'
      }, [
        e('button', {
          key: 'send-btn',
          onClick: sendEmail,
          className: 'px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2'
        }, 'Send'),
        e('button', {
          key: 'save-btn',
          onClick: saveDraft,
          className: 'px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-2'
        }, 'Save Draft'),
        e('button', {
          key: 'discard-btn',
          onClick: discardDraft,
          className: 'px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
        }, 'Discard')
      ]),
      
      // Recipient, Subject inputs
      e('div', {
        key: 'composer-fields',
        className: 'border-b border-gray-200 p-3'
      }, [
        e('div', {
          key: 'to-field',
          className: 'flex items-center mb-2'
        }, [
          e('span', {
            key: 'to-label',
            className: 'w-20 text-gray-600'
          }, 'To:'),
          e('input', {
            key: 'to-input',
            type: 'text',
            value: draftEmail?.to || '',
            onChange: (e) => updateDraft('to', e.target.value),
            className: 'flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          })
        ]),
        e('div', {
          key: 'subject-field',
          className: 'flex items-center'
        }, [
          e('span', {
            key: 'subject-label',
            className: 'w-20 text-gray-600'
          }, 'Subject:'),
          e('input', {
            key: 'subject-input',
            type: 'text',
            value: draftEmail?.subject || '',
            onChange: (e) => updateDraft('subject', e.target.value),
            className: 'flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          })
        ])
      ]),
      
      // Email body textarea
      e('textarea', {
        key: 'email-body',
        value: draftEmail?.body || '',
        onChange: (e) => updateDraft('body', e.target.value),
        className: 'flex-1 p-3 resize-none focus:outline-none'
      })
    ]);
  };

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
          onClick: createNewEmail
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
            onClick: () => {
              setFolderView(folder.id);
              setSelectedEmail(null);
              setComposeMode(false);
            }
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

    // Email Content Area (Lists and Detail Views)
    composeMode 
      ? e(EmailComposer)
      : e('div', {
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
                        }, folderView === 'sent' ? `To: ${email.to}` : `From: ${email.from}`),
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
                }, `No emails in ${folderView}`)
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
                    e('div', { key: 'from' }, folderView === 'sent' 
                      ? `To: ${selectedEmail.to}` 
                      : `From: ${selectedEmail.from}`),
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
                  folderView === 'inbox' && e('button', {
                    key: 'reply',
                    className: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200',
                    onClick: () => {
                      // Create a reply email
                      const replyEmail = {
                        id: Date.now(),
                        from: userEmail,
                        to: selectedEmail.from,
                        subject: `Re: ${selectedEmail.subject}`,
                        body: `\n\n----- Original Message -----\nFrom: ${selectedEmail.from}\nDate: ${new Date(selectedEmail.date).toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`,
                        date: new Date().toISOString().split('T')[0],
                        folder: 'drafts'
                      };
                      setDraftEmail(replyEmail);
                      setComposeMode(true);
                    }
                  }, 'Reply'),
                  folderView === 'inbox' && e('button', {
                    key: 'forward',
                    className: 'px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200',
                    onClick: () => {
                      // Create a forwarded email
                      const forwardEmail = {
                        id: Date.now(),
                        from: userEmail,
                        to: '',
                        subject: `Fwd: ${selectedEmail.subject}`,
                        body: `\n\n----- Forwarded Message -----\nFrom: ${selectedEmail.from}\nDate: ${new Date(selectedEmail.date).toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`,
                        date: new Date().toISOString().split('T')[0],
                        folder: 'drafts'
                      };
                      setDraftEmail(forwardEmail);
                      setComposeMode(true);
                    }
                  }, 'Forward'),
                  folderView === 'drafts' && e('button', {
                    key: 'edit',
                    className: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200',
                    onClick: () => editEmail(selectedEmail)
                  }, 'Edit'),
                  e('button', {
                    key: 'delete',
                    className: 'px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200',
                    onClick: () => deleteEmail(selectedEmail)
                  }, 'Delete')
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