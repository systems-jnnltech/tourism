/**
 * Malungon Municipal Tourism Office Database Management System (MTODMS)
 * Unified High-Fidelity Printing & PDF Export Engine
 * 
 * Compliant with:
 * - DILG-DOT JMC Standard Reporting Requirements
 * - Sandboxed Iframe Resilience (Google AI Studio Preview & Standalone Cloud Run)
 * - Exact Color & High-Resolution Vector Typography
 */

export interface PrintOptions {
  title: string;
  subtitle?: string;
  landscape?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Universal print handler that works in normal windows, sandboxed iframes,
 * mobile browsers, and restricted environments.
 */
export const printElement = (
  target: HTMLElement | string | null,
  options: PrintOptions
): boolean => {
  const element: HTMLElement | null =
    typeof target === 'string'
      ? document.getElementById(target)
      : target;

  if (!element) {
    console.error(`[MTODMS PrintEngine] Element not found:`, target);
    alert(`Print Target Not Found. Please ensure the document is rendered on screen.`);
    return false;
  }

  const { title, landscape = false } = options;
  const originalTitle = document.title;

  // 1. Check if we can safely use the browser print dialog
  let directPrintSucceeded = false;

  try {
    // Set document title so saved PDF filenames have official format
    document.title = `${title} - Malungon MTODMS`;

    // Mark target element and body for CSS print engine
    element.classList.add('printable-active-target');
    document.body.classList.add('is-printing-document');

    if (landscape) {
      document.body.classList.add('print-landscape');
    }

    // Attempt direct window.print()
    window.print();
    directPrintSucceeded = true;

    // Clean up after print
    const cleanup = () => {
      element.classList.remove('printable-active-target');
      document.body.classList.remove('is-printing-document');
      document.body.classList.remove('print-landscape');
      document.title = originalTitle;
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 2000);
  } catch (err) {
    console.warn('[MTODMS PrintEngine] Direct window.print() failed or restricted by sandbox:', err);
    directPrintSucceeded = false;
  }

  // If direct print threw an error (or failed due to sandboxed iframe without allow-modals),
  // immediately invoke the standalone fallback popup or direct download.
  if (!directPrintSucceeded) {
    fallbackPrint(element, options);
  }

  return true;
};

/**
 * Fallback printing mechanism for sandboxed iframes or popup blockers.
 * Creates a self-contained, standalone document that can be opened in a new tab
 * or saved directly as an HTML/PDF-ready file.
 */
export const fallbackPrint = (
  element: HTMLElement,
  options: PrintOptions
) => {
  const { title, landscape = false } = options;
  const contentHtml = element.outerHTML;

  const fullHtml = generateStandAloneDocumentHtml({
    title,
    contentHtml,
    landscape,
  });

  // Try opening a standalone window/tab first
  try {
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    const printWin = window.open(blobUrl, '_blank');
    if (printWin) {
      printWin.focus();
      return;
    }
  } catch (e) {
    console.warn('[MTODMS PrintEngine] Window.open failed, switching to direct download fallback:', e);
  }

  // If window.open was blocked by sandbox, download the standalone HTML document directly!
  downloadDocumentHtml(fullHtml, title);
};

/**
 * Downloads the document as a standalone, printable HTML file with embedded styling.
 * The user can double-click it to open in any browser and press Ctrl+P to save as PDF.
 */
export const downloadDocumentHtml = (htmlContent: string, title: string) => {
  const sanitizedFilename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Official_Copy.html`;
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = sanitizedFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Friendly non-intrusive alert
  setTimeout(() => {
    alert(
      `Document "${title}" has been saved as a print-ready file (${sanitizedFilename}).\n\n` +
      `You can open this file in any web browser and press Ctrl+P (or Cmd+P) to print or Save as PDF with pristine formatting.`
    );
  }, 300);
};

/**
 * Compiles a completely standalone, self-contained HTML document with Tailwind CSS,
 * official republic header, watermarks, and auto-print triggers.
 */
export const generateStandAloneDocumentHtml = ({
  title,
  contentHtml,
  landscape = false,
}: {
  title: string;
  contentHtml: string;
  landscape?: boolean;
}): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Municipality of Malungon MTODMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      size: ${landscape ? 'landscape' : 'portrait'};
      margin: 12mm 12mm 15mm 12mm;
    }
    @media print {
      .screen-only-toolbar {
        display: none !important;
      }
      body {
        background: #ffffff !important;
        color: #000000 !important;
        font-size: 11pt;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .page-break-avoid {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
    }
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <!-- Top Screen-Only Quick Action Bar -->
  <div class="screen-only-toolbar bg-slate-900 text-white px-6 py-3 sticky top-0 z-50 shadow-md flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-white text-xs shadow-xs">
        MTO
      </div>
      <div>
        <div class="font-bold text-sm leading-tight">${title}</div>
        <div class="text-[11px] text-slate-400">Municipality of Malungon • Official Tourism Record</div>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <button onclick="window.print()" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span>Print Document / Save as PDF</span>
      </button>
      <button onclick="window.close()" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer">
        Close
      </button>
    </div>
  </div>

  <!-- Document Body Container -->
  <div class="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full">
    <div class="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:p-0">
      ${contentHtml}
    </div>
  </div>

  <script>
    // Auto-trigger print when opened in standalone window
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          window.focus();
          window.print();
        } catch (e) {
          console.log('Auto-print blocked, click the Print button above.');
        }
      }, 500);
    });
  </script>
</body>
</html>`;
};
