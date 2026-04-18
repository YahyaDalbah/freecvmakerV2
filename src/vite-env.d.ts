/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Base URL for cvmaker-backend (no trailing slash), e.g. `http://localhost:3001` */
    readonly VITE_CV_API_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
