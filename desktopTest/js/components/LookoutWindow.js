// js/components/LookoutWindow.js
const { useState } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Enhanced mock email data with folder property
const initialEmails = [
  {
    id: 1,
    from: 'sanguisMD@kaiser.com',
    to: 'adampell@gmail.com',
    subject: 'Results',
    body: `Dear Mr. Pell,

You can review the report from your visit today in the health portal. 
Please let me know if you have any questions. Hope you have a good weekend and get some REST. 

Thanks,  
Dr. Sanguis, MD   
Kaiser Center`,
    date: '2024-01-11',
    folder: 'inbox',
    isRead: false
  },
  {
    id: 2,
    from: 'notifications@healthcare-portal.com',
    to: 'adampell@gmail.com',
    subject: 'Your Appointment Reminder',
    body: `Hello,

This is a reminder that you have an appointment scheduled with Dr. Sanguis tomorrow at 2:30 PM.

Please arrive 15 minutes early to complete any required paperwork.

Thank you,
Healthcare Portal Team`,
    date: '2024-01-09',
    folder: 'inbox',
    isRead: true
  },
  {
    id: 3,
    from: 'research@megacorp.com',
    to: 'adampell@gmail.com',
    subject: 'Product X Beta Program Update',
    body: `Dear Beta Tester,

Thank you for your continued participation in the Product X beta program. 

We've received your feedback reports and wanted to check in on your experience. Would you be available for a brief follow-up interview about your testing experience?

Best regards,
MegaCorp Research Team`,
    date: '2024-01-05',
    folder: 'inbox',
    isRead: true
  },
  {
    id: 4,
    from: 'adampell@gmail.com',
    to: 'jenroman@gladlaw.com',
    subject: 'Legal Questions about Product Testing',
    body: `Hi Jen,

Hope you're doing well. I wanted to follow up on our conversation about some legal questions regarding my participation in the Product X beta testing program.

I've been experiencing some concerning symptoms, but doctors aren't finding anything conclusive. Can we discuss my options?

Thanks,
Alex`,
    date: '2024-01-03',
    folder: 'sent',
    isRead: true
  },
  {
    id: 5,
    from: 'adampell@gmail.com',
    to: 'naomi@scorpioartcollective.org',
    subject: 'Weekend Retreat Preparations',
    body: `Hey Naomi,

Just starting to pack for this weekend's retreat. I'm really looking forward to it.

Is there anything specific I should bring besides the usual stuff? 
I made a bunch of edits to our new story btw. It's kind of in a crazed state right now, but would be fun for you, me, and Rob to workshop this over the weekend.

I'll print out a few copies before I leave. 

- Alex`,
    date: '2025-01-10',
    folder: 'drafts',
    isRead: true
  }
];

// LookoutContent Component - Separated from window frame
const LookoutContent = ({ isMaximized, windowSize }) => {
  const [emails, setEmails] = useState(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [folderView, setFolderView] = useState('inbox');
  const [composeMode, setComposeMode] = useState(false);
  const [draftEmail, setDraftEmail] = useState(null);
  const [userEmail] = useState('you@example.com'); // User's email address

  // Folder structure for email organization with unread counts
  const folders = [
    { 
      id: 'inbox', 
      name: 'Inbox', 
      count: emails.filter(email => email.folder === 'inbox').length,
      unread: emails.filter(email => email.folder === 'inbox' && !email.isRead).length
    },
    { 
      id: 'sent', 
      name: 'Sent', 
      count: emails.filter(email => email.folder === 'sent').length 
    },
    { 
      id: 'drafts', 
      name: 'Drafts', 
      count: emails.filter(email => email.folder === 'drafts').length 
    },
    { 
      id: 'trash', 
      name: 'Trash', 
      count: emails.filter(email => email.folder === 'trash').length 
    }
  ];

  // Filter emails based on selected folder
  const filteredEmails = emails.filter(email => email.folder === folderView);
  
        // Mark an email as read when selected
  const markAsRead = (email) => {
    if (!email.isRead) {
      setEmails(emails.map(e => 
        e.id === email.id ? {...e, isRead: true} : e
      ));
    }
    setSelectedEmail(email);
  };
  
  // Toggle read/unread status
  const toggleReadStatus = (email, e) => {
    e.stopPropagation(); // Prevent triggering the row click
    setEmails(emails.map(e => 
      e.id === email.id ? {...e, isRead: !e.isRead} : e
    ));
  };

  // Create a new email draft
  const createNewEmail = () => {
    const newEmail = {
      id: Date.now(), // Use timestamp as ID
      from: userEmail,
      to: '',
      subject: '',
      body: '',
      date: new Date().toISOString().split('T')[0],
      folder: 'drafts',
      isRead: true
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
            e('div', {
              key: 'folder-info',
              className: 'flex items-center'
            }, [
              e('span', { 
                key: 'folder-icon',
                className: 'mr-2'
              }, 
                folder.id === 'inbox' ? '📥' : 
                folder.id === 'sent' ? '📤' : 
                folder.id === 'drafts' ? '📝' : 
                folder.id === 'trash' ? '🗑️' : '📁'
              ),
              e('span', { 
                key: 'name',
                className: folder.unread && folder.unread > 0 ? 'font-bold' : ''
              }, folder.name)
            ]),
            e('div', {
              key: 'count-container',
              className: 'flex items-center'
            }, [
              // Show unread count badge for inbox
              folder.unread && folder.unread > 0 && e('span', { 
                key: 'unread-count',
                className: 'bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-1 mr-1'
              }, folder.unread),
              
              // Show total count badge for all folders
              folder.count > 0 && e('span', { 
                key: 'count',
                className: `${
                  folderView === folder.id 
                    ? 'bg-blue-200 text-blue-800' 
                    : 'bg-gray-200 text-gray-700'
                } text-xs rounded-full px-2 py-1`
              }, folder.count)
            ])
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
                      onClick: () => markAsRead(email),
                    }, [
                      e('div', {
                        key: 'email-wrapper',
                        className: 'flex'
                      }, [
                        // Read/Unread indicator that can be toggled
                        e('div', {
                          key: 'read-indicator',
                          className: 'mr-2 pt-1',
                          onClick: (event) => toggleReadStatus(email, event),
                          title: email.isRead ? 'Mark as unread' : 'Mark as read'
                        }, !email.isRead ? 
                          e('div', {
                            className: 'w-3 h-3 rounded-full bg-blue-500 cursor-pointer hover:bg-blue-600'
                          }) :
                          e('div', {
                            className: 'w-3 h-3 rounded-full border border-gray-300 cursor-pointer hover:border-blue-500'
                          })
                        ),
                        
                        // Email content
                        e('div', {
                          key: 'email-content',
                          className: 'flex-1'
                        }, [
                          e('div', {
                            key: 'email-header',
                            className: 'flex justify-between items-baseline'
                          }, [
                            e('span', {
                              key: 'from',
                              className: `${!email.isRead ? 'font-bold' : 'font-medium'} text-sm`
                            }, folderView === 'sent' ? `To: ${email.to}` : `From: ${email.from}`),
                            e('span', {
                              key: 'date',
                              className: 'text-xs text-gray-500 ml-2 flex-shrink-0'
                            }, new Date(email.date).toLocaleDateString())
                          ]),
                          e('div', {
                            key: 'subject',
                            className: `${!email.isRead ? 'font-bold text-black' : 'font-medium text-gray-800'} text-sm mt-1`
                          }, email.subject),
                          e('div', {
                            key: 'preview',
                            className: `${!email.isRead ? 'text-gray-700' : 'text-gray-500'} text-xs mt-1 truncate`
                          }, email.body.substring(0, 50) + '...')
                        ])
                      ])
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