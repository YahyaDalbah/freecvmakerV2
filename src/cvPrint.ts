/**
 * Printable region for CV layout — must match cvmaker-backend `page.pdf` margins
 * (`top/right/bottom/left`, same value as CV_PDF_MARGIN_CSS).
 */
export const CV_PDF_MARGIN_CSS = "0.3in";

/** Content box width = A4 width minus left+right PDF margins */
export const CV_PRINTABLE_WIDTH_CSS = `calc(210mm - 2 * ${CV_PDF_MARGIN_CSS})`;

/** One page of content height = A4 height minus top+bottom PDF margins (preview pagination) */
export const CV_PRINTABLE_HEIGHT_CSS = `calc(297mm - 2 * ${CV_PDF_MARGIN_CSS})`;
