import type { Education, Experience, PersonalInfo, Project, Reference, Skill } from "./types";

/** Same origin as cvmaker-backend; override with `VITE_CV_API_URL` (no trailing slash). */
export function getCvApiBaseUrl(): string {
    const raw = import.meta.env.VITE_CV_API_URL as string | undefined;
    const base = (raw ?? "http://localhost:3001").replace(/\/$/, "");
    return base;
}

/** Body shape for `POST /api/generate-cv` — must match what Puppeteer seeds into `/print`. */
export type CvPdfPayload = {
    template: string;
    color?: string;
    personalInfo: PersonalInfo;
    professionalSummary: string;
    sectionOrder: string[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: Skill[];
    references: Reference[];
};

export async function fetchCvPdfBlob(
    payload: CvPdfPayload,
    options?: { signal?: AbortSignal },
): Promise<Blob> {
    const base = getCvApiBaseUrl();
    const res = await fetch(`${base}/api/generate-cv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: options?.signal,
    });
    if (!res.ok) {
        let detail = res.statusText;
        try {
            const j = (await res.json()) as { details?: string; error?: string };
            detail = j.details ?? j.error ?? detail;
        } catch {
            try {
                detail = await res.text();
            } catch {
                /* ignore */
            }
        }
        throw new Error(detail || `Request failed (${res.status})`);
    }
    return res.blob();
}

/** Debounce delay for live PDF preview (same PDF as download). */
export const CV_PDF_PREVIEW_DEBOUNCE_MS = 900;
