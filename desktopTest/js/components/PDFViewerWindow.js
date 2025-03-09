// js/components/PDFViewerWindow.js
const { useState, useRef, useEffect } = React;
const { createElement: e } = React;

import { WindowFrame } from './WindowFrame.js';

// Mock PDF data
const mockPDFs = [
  { id: 1, title: 'Mythical Man Month', path: './Documents/MythicalManMonth.pdf' },
  { id: 2, title: 'Origin of Species', path: './Documents/Origin_of_Species.pdf' },
  { id: 3, title: 'Volleyball Schedule', path: './Documents/volleyball_sched.pdf' },
  { id: 4, title: 'Story Draft', path: './js/Documents/storyDraftV2.pdf' }, 
  { id: 5, title: 'Data Structures', path: './js/Documents/JAVA3elatest.pdf' }, 

];

// PDFViewerContent Component
const PDFViewerContent = ({ isMaximized, windowSize }) => {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const canvasRef = useRef(null);
  
  // Load PDF.js script
  useEffect(() => {
    // Add PDF.js from CDN
    const scriptPdf = document.createElement('script');
    scriptPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    scriptPdf.async = true;
    
    scriptPdf.onload = () => {
      // Set worker source after main script is loaded
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    };
    
    document.body.appendChild(scriptPdf);
    
    return () => {
      document.body.removeChild(scriptPdf);
    };
  }, []);
  
  // Load selected PDF
  useEffect(() => {
    if (!selectedPDF || !window.pdfjsLib) return;
    
    const loadPDF = async () => {
      try {
        const loadingTask = window.pdfjsLib.getDocument(selectedPDF.path);
        const pdf = await loadingTask.promise;
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        
        // Render first page
        renderPage(pdf, 1);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };
    
    loadPDF();
  }, [selectedPDF]);
  
  // Handle page changes
  useEffect(() => {
    if (!selectedPDF || !window.pdfjsLib) return;
    
    const renderCurrentPage = async () => {
      try {
        const loadingTask = window.pdfjsLib.getDocument(selectedPDF.path);
        const pdf = await loadingTask.promise;
        renderPage(pdf, currentPage);
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };
    
    renderCurrentPage();
  }, [currentPage, scale, selectedPDF]);
  
  // Render specific page
  const renderPage = async (pdf, pageNumber) => {
    try {
      const page = await pdf.getPage(pageNumber);
      
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
  
  // Navigate between pages
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };
  
  // Change zoom level
  const changeZoom = (zoomChange) => {
    const newScale = scale + zoomChange;
    if (newScale < 0.5 || newScale > 3) return;
    setScale(newScale);
  };
  
  return e('div', {
    className: 'flex h-full bg-gray-100'
  }, [
    // PDF list sidebar
    e('div', {
      key: 'sidebar',
      className: 'w-56 bg-gray-200 p-4 border-r border-gray-300 overflow-y-auto'
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
    
    // PDF viewer
    e('div', {
      key: 'viewer',
      className: 'flex-1 flex flex-col'
    }, selectedPDF ? [
      // Toolbar
      e('div', {
        key: 'toolbar',
        className: 'border-b border-gray-300 p-2 flex items-center justify-between bg-white'
      }, [
        // Left controls (navigation)
        e('div', {
          key: 'navigation',
          className: 'flex items-center space-x-2'
        }, [
          e('button', {
            key: 'prev',
            onClick: () => changePage(currentPage - 1),
            disabled: currentPage <= 1,
            className: `p-1 rounded ${currentPage <= 1 ? 'text-gray-400' : 'hover:bg-gray-200'}`
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, e('path', { d: 'M15 18l-6-6 6-6' }))),
          
          e('span', {
            key: 'page-info',
            className: 'text-sm'
          }, `Page ${currentPage} of ${totalPages}`),
          
          e('button', {
            key: 'next',
            onClick: () => changePage(currentPage + 1),
            disabled: currentPage >= totalPages,
            className: `p-1 rounded ${currentPage >= totalPages ? 'text-gray-400' : 'hover:bg-gray-200'}`
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, e('path', { d: 'M9 18l6-6-6-6' })))
        ]),
        
        // Right controls (zoom)
        e('div', {
          key: 'zoom',
          className: 'flex items-center space-x-2'
        }, [
          e('button', {
            key: 'zoom-out',
            onClick: () => changeZoom(-0.1),
            className: 'p-1 rounded hover:bg-gray-200'
          }, e('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2
          }, e('path', { d: 'M5 12h14' }))),
          
          e('span', {
            key: 'zoom-level',
            className: 'text-sm'
          }, `${Math.round(scale * 100)}%`),
          
          e('button', {
            key: 'zoom-in',
            onClick: () => changeZoom(0.1),
            className: 'p-1 rounded hover:bg-gray-200'
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
      
      // PDF render area
      e('div', {
        key: 'render-area',
        className: 'flex-1 overflow-auto flex items-center justify-center bg-gray-500'
      }, e('canvas', {
        ref: canvasRef,
        className: 'shadow-lg'
      }))
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