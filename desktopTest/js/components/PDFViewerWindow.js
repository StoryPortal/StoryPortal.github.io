// js/components/PDFViewerWindow.js
const { useState, useRef, useEffect } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Mock PDF data
const mockPDFs = [
  { id: 1, title: 'Mythical Man', path: './js/Documents/MythicalManMonth.pdf' },
  { id: 2, title: 'Origin of Species', path: './js/Documents/Origin_of_Species.pdf' },
  { id: 3, title: 'Volleyball Schedule', path: './js/Documents/volleyball_sched.pdf' },
  { id: 4, title: 'Story Draft', path: './js/Documents/storyDraftV2.pdf' }, 
  { id: 5, title: 'Data Structures', path: './js/Documents/JAVA3elatest.pdf' }, 
];

// Thumbnail component for page previews
const PageThumbnail = ({ pdf, page, currentPage, onClick }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!pdf || !window.pdfjsLib || !canvasRef.current) return;
    
    const renderThumbnail = async () => {
      try {
        const pdfPage = await pdf.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 0.2 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await pdfPage.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      } catch (error) {
        console.error('Error rendering thumbnail:', error);
      }
    };
    
    renderThumbnail();
  }, [pdf, page]);
  
  return e('div', {
    className: `cursor-pointer p-1 border-2 rounded ${currentPage === page ? 'border-blue-500' : 'border-transparent'}`,
    onClick: () => onClick(page)
  }, 
    e('canvas', {
      ref: canvasRef,
      className: 'shadow-sm'
    })
  );
};

// PDFViewerContent Component
const PDFViewerContent = ({ isMaximized, windowSize }) => {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [thumbnailsPosition, setThumbnailsPosition] = useState('bottom'); // 'left', 'right', 'bottom'
  const [zoomMode, setZoomMode] = useState('custom'); // 'fit-width', 'fit-page', 'custom'
  const [jumpToPage, setJumpToPage] = useState('');
  const [outlines, setOutlines] = useState([]);
  const [showOutlines, setShowOutlines] = useState(false);
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Load PDF.js script
  useEffect(() => {
    // Check if script is already loaded
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      return;
    }
    
    // Add PDF.js from CDN
    const scriptPdf = document.createElement('script');
    scriptPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    scriptPdf.async = true;
    
    scriptPdf.onload = () => {
      // Set worker source after main script is loaded
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    };
    
    document.body.appendChild(scriptPdf);
  }, []);
  
  // Load selected PDF
  useEffect(() => {
    if (!selectedPDF || !window.pdfjsLib) return;
    
    const loadPDF = async () => {
      try {
        const loadingTask = window.pdfjsLib.getDocument(selectedPDF.path);
        const pdf = await loadingTask.promise;
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        setOutlines([]); // Reset outlines when loading new PDF
        
        // Get document outline (bookmarks/TOC)
        try {
          const outline = await pdf.getOutline();
          if (outline && outline.length > 0) {
            const formattedOutlines = [];
            
            const processOutlineItem = (item, level = 0) => {
              // Extract the destination page number
              const dest = item.dest;
              let pageNumber = null;
              
              if (dest) {
                // Handle different destination formats
                if (typeof dest === 'string') {
                  // Named destination, need to resolve it
                  try {
                    pdf.getDestination(dest).then(destArray => {
                      if (destArray && destArray.length >= 1) {
                        pdf.getPageIndex(destArray[0]).then(index => {
                          pageNumber = index + 1;
                        });
                      }
                    });
                  } catch (e) {
                    console.error('Error resolving named destination:', e);
                  }
                } else if (Array.isArray(dest) && dest.length >= 1) {
                  // Direct destination
                  try {
                    // Get page number from reference
                    pdf.getPageIndex(dest[0]).then(index => {
                      pageNumber = index + 1;
                    });
                  } catch (e) {
                    console.error('Error resolving destination:', e);
                  }
                }
              }
              
              const outlineItem = {
                title: item.title,
                level,
                pageNumber,
                children: []
              };
              
              // Process any child items
              if (item.items && item.items.length > 0) {
                item.items.forEach(childItem => {
                  outlineItem.children.push(processOutlineItem(childItem, level + 1));
                });
              }
              
              return outlineItem;
            };
            
            // Process all top-level outline items
            outline.forEach(item => {
              formattedOutlines.push(processOutlineItem(item));
            });
            
            setOutlines(formattedOutlines);
          } else {
            // No outline found
            setOutlines([]);
            // If outline tab was active, switch back to document list
            if (showOutlines) {
              setShowOutlines(false);
            }
          }
        } catch (error) {
          console.log('No outline available:', error);
          setOutlines([]);
          // If outline tab was active, switch back to document list
          if (showOutlines) {
            setShowOutlines(false);
          }
        }
        
        // Apply zoom mode when PDF loads
        updateZoomMode(zoomMode, pdf);
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Failed to load PDF. Please check the file path and try again.');
      }
    };
    
    loadPDF();
  }, [selectedPDF]);
  
  // Handle page changes
  useEffect(() => {
    if (!pdfDocument) return;
    renderCurrentPage();
  }, [currentPage, scale, pdfDocument]);
  
  // Handle zoom mode changes
  useEffect(() => {
    if (!pdfDocument) return;
    updateZoomMode(zoomMode, pdfDocument);
  }, [zoomMode, windowSize]);
  
  // Function to apply zoom modes
  const updateZoomMode = async (mode, pdf) => {
    if (!pdf || !containerRef.current) return;
    
    try {
      const page = await pdf.getPage(currentPage);
      let newScale = scale;
      
      switch (mode) {
        case 'fit-width':
          const containerWidth = containerRef.current.clientWidth - 40; // account for padding
          const viewport = page.getViewport({ scale: 1.0 });
          newScale = containerWidth / viewport.width;
          break;
        case 'fit-page':
          const containerHeight = containerRef.current.clientHeight - 40;
          const containerWidth2 = containerRef.current.clientWidth - 40;
          const viewport2 = page.getViewport({ scale: 1.0 });
          
          // Calculate scales for both dimensions
          const scaleWidth = containerWidth2 / viewport2.width;
          const scaleHeight = containerHeight / viewport2.height;
          
          // Use the smaller scale to ensure the page fits both ways
          newScale = Math.min(scaleWidth, scaleHeight);
          break;
        default:
          // 'custom' mode - keep current scale
          break;
      }
      
      setScale(newScale);
    } catch (error) {
      console.error('Error updating zoom mode:', error);
    }
  };
  
  // Render current page
  const renderCurrentPage = async () => {
    if (!pdfDocument || !canvasRef.current) return;
    
    try {
      const page = await pdfDocument.getPage(currentPage);
      
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };
  
  // Handle manual page jump
  const handlePageJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage('');
  };
  
  // Navigate between pages
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };
  
  // Change zoom level
  const changeZoom = (zoomChange) => {
    // Switch to custom mode when manually changing zoom
    setZoomMode('custom');
    
    const newScale = scale + zoomChange;
    if (newScale < 0.25 || newScale > 5) return;
    setScale(newScale);
  };
  
  // Set specific zoom level
  const setZoomLevel = (level) => {
    setZoomMode('custom');
    setScale(level);
  };
  
  // Generate array of pages for thumbnails
  const thumbnailPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  // Generate thumbnail layout based on position
  const getThumbnailsLayout = () => {
    switch (thumbnailsPosition) {
      case 'left':
        return {
          container: 'flex-row',
          thumbnails: 'w-32 overflow-y-auto flex-col'
        };
      case 'right':
        return {
          container: 'flex-row-reverse',
          thumbnails: 'w-32 overflow-y-auto flex-col'
        };
      case 'bottom':
      default:
        return {
          container: 'flex-col',
          thumbnails: 'h-32 overflow-x-auto flex-row'
        };
    }
  };
  
  const thumbnailLayout = getThumbnailsLayout();
  
  // Navigate to first, previous, next, or last page
  const navigateToFirstPage = () => changePage(1);
  const navigateToPreviousPage = () => changePage(currentPage - 1);
  const navigateToNextPage = () => changePage(currentPage + 1);
  const navigateToLastPage = () => changePage(totalPages);
  
  // Render outline items recursively
  const renderOutlineItems = (items) => {
    return items.map((item, index) => 
      e('div', {
        key: `outline-${index}`,
        className: 'mb-1'
      }, [
        e('div', {
          className: `pl-${item.level * 4} flex items-center text-sm cursor-pointer hover:bg-gray-100 rounded p-1`,
          onClick: () => item.pageNumber && changePage(item.pageNumber)
        }, [
          item.pageNumber && e('span', {
            className: 'text-xs text-gray-500 mr-2 w-8'
          }, `p. ${item.pageNumber}`),
          e('span', {
            className: 'flex-1 truncate'
          }, item.title || 'Untitled')
        ]),
        item.children && item.children.length > 0 && renderOutlineItems(item.children)
      ])
    );
  };
  
  return e('div', {
    className: 'flex h-full bg-gray-100'
  }, [
    // PDF list & outlines sidebar
    e('div', {
      key: 'sidebar',
      className: 'w-56 bg-gray-200 p-4 border-r border-gray-300 overflow-y-auto'
    }, [
      // Sidebar tabs (Documents & Outline)
      e('div', {
        key: 'sidebar-tabs',
        className: 'flex border-b border-gray-300 mb-4'
      }, [
        e('button', {
          key: 'docs-tab',
          className: `py-2 px-4 text-sm font-medium ${!showOutlines ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-gray-800'}`,
          onClick: () => setShowOutlines(false)
        }, 'Documents'),
        
        e('button', {
          key: 'outline-tab',
          className: `py-2 px-4 text-sm font-medium ${showOutlines ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-gray-800'}`,
          onClick: () => {
            if (pdfDocument) {
              setShowOutlines(true);
            } else {
              alert('Please select a document first to view its outline.');
            }
          },
          disabled: !pdfDocument
        }, 'Outline')
      ]),
      
      // Document list (shown when showOutlines is false)
      !showOutlines && e('div', {
        key: 'document-list'
      }, [
        e('h3', {
          className: 'font-medium mb-3 text-gray-700'
        }, 'Documents'),
        e('div', {
          className: 'space-y-2'
        }, mockPDFs.map(pdf => 
          e('button', {
            key: pdf.id,
            onClick: () => setSelectedPDF(pdf),
            className: `w-full text-left px-3 py-2 rounded flex items-center ${
              selectedPDF && selectedPDF.id === pdf.id 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100'
            }`
          }, [
            // PDF icon (simplified)
            e('svg', {
              key: 'icon',
              width: 20,
              height: 20,
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              className: 'mr-2 text-red-500',
              strokeWidth: 2
            }, e('path', { d: 'M14 3v4a1 1 0 001 1h4M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z' })),
            e('span', {
              key: 'title',
              className: 'truncate'
            }, pdf.title)
          ])
        ))
      ]),
      
      // Document outline (shown when showOutlines is true)
      showOutlines && e('div', {
        key: 'document-outline'
      }, [
        e('h3', {
          className: 'font-medium mb-3 text-gray-700 flex items-center'
        }, [
          e('span', { className: 'flex-1' }, 'Table of Contents'),
          e('button', {
            className: 'text-xs text-gray-500 hover:text-gray-700',
            onClick: () => setShowOutlines(false)
          }, '← Back')
        ]),
        
        outlines.length > 0 ? 
          e('div', {
            className: 'space-y-1'
          }, renderOutlineItems(outlines)) :
          e('div', {
            className: 'text-sm text-gray-500 italic'
          }, 'No outline available for this document')
      ])
    ]),
    
    // PDF viewer
    e('div', {
      key: 'viewer',
      className: 'flex-1 flex flex-col'
    }, selectedPDF ? [
      // Enhanced toolbar
      e('div', {
        key: 'toolbar',
        className: 'border-b border-gray-300 p-2 flex items-center justify-between bg-white'
      }, [
        // Navigation controls
        e('div', {
          key: 'navigation',
          className: 'flex items-center space-x-1'
        }, [
          // First page
          e('button', {
            key: 'first',
            onClick: navigateToFirstPage,
            disabled: currentPage <= 1,
            className: `p-1 rounded ${currentPage <= 1 ? 'text-gray-400' : 'hover:bg-gray-200'}`,
            title: 'First Page'
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, [
            e('path', { d: 'M19 12H5', key: 'line' }),
            e('path', { d: 'M12 19l-7-7 7-7', key: 'arrow' })
          ])),
          
          // Previous page
          e('button', {
            key: 'prev',
            onClick: navigateToPreviousPage,
            disabled: currentPage <= 1,
            className: `p-1 rounded ${currentPage <= 1 ? 'text-gray-400' : 'hover:bg-gray-200'}`,
            title: 'Previous Page'
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, e('path', { d: 'M15 18l-6-6 6-6' }))),
          
          // Page input and total
          e('div', {
            key: 'page-info',
            className: 'flex items-center bg-white border rounded px-2 py-0.5 mx-1'
          }, [
            e('form', {
              className: 'flex items-center',
              onSubmit: handlePageJump
            }, [
              e('input', {
                type: 'text',
                value: jumpToPage,
                onChange: (e) => setJumpToPage(e.target.value),
                className: 'w-12 text-center text-sm focus:outline-none',
                placeholder: currentPage.toString()
              }),
              e('span', { className: 'text-gray-400 mx-1' }, '/'),
              e('span', { className: 'text-sm' }, totalPages),
              e('button', {
                type: 'submit',
                className: 'sr-only'
              }, 'Go')
            ])
          ]),
          
          // Next page
          e('button', {
            key: 'next',
            onClick: navigateToNextPage,
            disabled: currentPage >= totalPages,
            className: `p-1 rounded ${currentPage >= totalPages ? 'text-gray-400' : 'hover:bg-gray-200'}`,
            title: 'Next Page'
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, e('path', { d: 'M9 18l6-6-6-6' }))),
          
          // Last page
          e('button', {
            key: 'last',
            onClick: navigateToLastPage,
            disabled: currentPage >= totalPages,
            className: `p-1 rounded ${currentPage >= totalPages ? 'text-gray-400' : 'hover:bg-gray-200'}`,
            title: 'Last Page'
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, [
            e('path', { d: 'M5 12h14', key: 'line' }),
            e('path', { d: 'M12 5l7 7-7 7', key: 'arrow' })
          ]))
        ]),
        
        // Middle section - thumbnails toggle
        e('div', {
          key: 'view-options',
          className: 'flex items-center'
        }, [
          // Thumbnails toggle
          e('button', {
            key: 'thumbnails-toggle',
            onClick: () => setShowThumbnails(!showThumbnails),
            className: `px-2 py-1 text-xs rounded flex items-center ${showThumbnails ? 'bg-blue-100 text-blue-700' : 'border hover:bg-gray-100'}`
          }, [
            e('svg', {
              key: 'thumbnails-icon',
              className: 'w-4 h-4 mr-1',
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24'
            }, e('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M4 6h16M4 12h16m-7 6h7'
            })),
            showThumbnails ? 'Hide Thumbnails' : 'Show Thumbnails'
          ]),
          
          // Thumbnail position dropdown (only shown when thumbnails are visible)
          showThumbnails && e('div', {
            key: 'position-selector',
            className: 'relative ml-2'
          }, [
            e('select', {
              value: thumbnailsPosition,
              onChange: (e) => setThumbnailsPosition(e.target.value),
              className: 'text-xs border rounded px-1 py-1'
            }, [
              e('option', { value: 'bottom' }, 'Bottom'),
              e('option', { value: 'left' }, 'Left'),
              e('option', { value: 'right' }, 'Right')
            ])
          ])
        ]),
        
        // Zoom controls
        e('div', {
          key: 'zoom',
          className: 'flex items-center space-x-2'
        }, [
          // Zoom mode selector
          e('select', {
            key: 'zoom-mode',
            value: zoomMode,
            onChange: (e) => setZoomMode(e.target.value),
            className: 'text-xs border rounded p-1 mr-2'
          }, [
            e('option', { value: 'custom' }, 'Custom'),
            e('option', { value: 'fit-width' }, 'Fit Width'),
            e('option', { value: 'fit-page' }, 'Fit Page')
          ]),
          
          // Zoom out button
          e('button', {
            key: 'zoom-out',
            onClick: () => changeZoom(-0.1),
            className: 'p-1 rounded hover:bg-gray-200',
            title: 'Zoom Out'
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, e('path', { d: 'M5 12h14' }))),
          
          // Zoom preset dropdown
          e('div', {
            key: 'zoom-presets',
            className: 'relative'
          }, [
            e('button', {
              className: 'px-2 py-1 border rounded text-sm',
              onClick: (e) => {
                const dropdown = e.currentTarget.nextElementSibling;
                dropdown.classList.toggle('hidden');
              }
            }, `${Math.round(scale * 100)}%`),
            
            e('div', {
              className: 'absolute z-10 hidden mt-1 w-20 bg-white border rounded shadow-lg'
            }, [50, 75, 100, 125, 150, 200].map(percent => 
              e('button', {
                key: `zoom-${percent}`,
                className: 'block w-full text-left px-3 py-1 text-sm hover:bg-gray-100',
                onClick: () => {
                  setZoomLevel(percent / 100);
                  e.currentTarget.parentElement.classList.add('hidden');
                }
              }, `${percent}%`)
            ))
          ]),
          
          // Zoom in button
          e('button', {
            key: 'zoom-in',
            onClick: () => changeZoom(0.1),
            className: 'p-1 rounded hover:bg-gray-200',
            title: 'Zoom In'
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, [
            e('path', { d: 'M5 12h14', key: 'h' }),
            e('path', { d: 'M12 5v14', key: 'v' })
          ]))
        ])
      ]),
      
      // Main content area with PDF render and thumbnails
      e('div', {
        key: 'content',
        className: `flex-1 flex ${showThumbnails ? thumbnailLayout.container : ''}`
      }, [
        // PDF render area
        e('div', {
          key: 'render-area',
          ref: containerRef,
          className: 'flex-1 overflow-auto flex items-center justify-center bg-gray-500 relative'
        }, [
          // Canvas for rendering PDF
          e('canvas', {
            ref: canvasRef,
            className: 'shadow-lg'
          }),
          
          // Page number overlay
          e('div', {
            className: 'absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm'
          }, `${currentPage} / ${totalPages}`)
        ]),
        
        // Thumbnails area (conditional)
        showThumbnails && e('div', {
          key: 'thumbnails',
          className: `flex ${thumbnailLayout.thumbnails} bg-gray-800 p-2 gap-2 relative`
        }, [
          // Always visible close button for thumbnails
          e('button', {
            className: 'absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1 z-10',
            onClick: () => setShowThumbnails(false),
            title: 'Hide Thumbnails'
          }, 
            e('svg', {
              width: 16,
              height: 16,
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 2
            }, e('path', { d: 'M18 6L6 18M6 6l12 12' }))
          ),
          
          // Thumbnail pages
          thumbnailPages().length <= 100 ? 
            thumbnailPages().map(page => 
              e(PageThumbnail, {
                key: `thumb-${page}`,
                pdf: pdfDocument,
                page,
                currentPage,
                onClick: (pageNum) => changePage(pageNum)
              })
            ) : 
            e('div', {
              className: 'flex items-center justify-center w-full text-white p-4'
            }, [
              e('div', {
                className: 'text-center'
              }, [
                e('p', { className: 'mb-2' }, `This document has ${totalPages} pages.`),
                e('p', { className: 'mb-4' }, 'Generating thumbnails for all pages might impact performance.'),
                e('div', {
                  className: 'flex justify-center space-x-2'
                }, [
                  // Jump to page input for large documents
                  e('form', {
                    className: 'flex',
                    onSubmit: (e) => {
                      e.preventDefault();
                      const pageNum = parseInt(jumpToPage);
                      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                        setCurrentPage(pageNum);
                      }
                    }
                  }, [
                    e('input', {
                      type: 'text',
                      value: jumpToPage,
                      onChange: (e) => setJumpToPage(e.target.value),
                      className: 'w-16 px-2 py-1 text-sm text-black rounded-l',
                      placeholder: 'Page'
                    }),
                    e('button', {
                      type: 'submit',
                      className: 'bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-sm rounded-r'
                    }, 'Go')
                  ])
                ])
              ])
            ])
        ])
      ])
    ] : e('div', {
      className: 'flex-1 flex items-center justify-center text-gray-500'
    }, 'Select a document to view'))
  ]);
};

// Main PDFViewerWindow component using the WindowFrame
export const PDFViewerWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for PDF viewer
  const pdfViewerTheme = {
    titleBarBg: 'bg-red-50',
    closeButton: 'bg-red-500 hover:bg-red-600',
    minimizeButton: 'bg-yellow-500 hover:bg-yellow-600',
    maximizeButton: 'bg-green-500 hover:bg-green-600',
    windowBorder: 'border-red-200'
  };

  return e(WindowFrame, {
    title: 'Document Viewer',
    initialPosition: { x: 300, y: 100 },
    initialSize: { width: 900, height: 600 },
    minSize: { width: 500, height: 400 },
    onClose,
    onMinimize,
    isMinimized,
    theme: pdfViewerTheme
  }, 
    e(PDFViewerContent)
  );
};