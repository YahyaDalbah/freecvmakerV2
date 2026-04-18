/**
 * Renders the same PDF bytes returned by `POST /api/generate-cv` (Puppeteer → /print).
 * Pagination, padding, and breaks match the downloaded file by construction.
 */
export default function CvPdfPreview({
    blobUrl,
    loading,
    error,
    cvDataLoading = false,
    className = "",
}: {
    blobUrl: string | null;
    loading: boolean;
    error: string | null;
    /** CV form payload not ready yet (avoid hitting generate-cv with stale empty state). */
    cvDataLoading?: boolean;
    className?: string;
}) {
    const overlay = cvDataLoading
        ? "Loading CV…"
        : loading
          ? blobUrl
              ? "Updating preview…"
              : "Generating preview…"
          : null;

    return (
        <div
            className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm bg-gray-800 ring-1 ring-black/10 ${className}`}
            aria-busy={loading || cvDataLoading}
        >
            {error ? (
                <div
                    className="absolute inset-x-0 top-0 z-10 border-b border-red-900/50 bg-red-950/95 px-3 py-2 text-sm text-red-100"
                    role="alert"
                >
                    {error}
                </div>
            ) : null}

            {overlay ? (
                <div className="absolute inset-0 z-[5] flex items-center justify-center bg-gray-900/45 text-sm text-gray-100">
                    {overlay}
                </div>
            ) : null}

            {!blobUrl && !loading && !cvDataLoading ? (
                <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-gray-400">
                    Preview shows the same PDF as Generate PDF.
                </div>
            ) : null}

            {blobUrl ? (
                <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden">
                    <iframe
                        title="CV PDF preview"
                        src={`${blobUrl}#toolbar=0&navpanes=0&view=FitH`}
                        className="block min-h-0 min-w-0 h-full w-full max-w-full border-0 bg-zinc-900"
                    />
                </div>
            ) : null}
        </div>
    );
}
