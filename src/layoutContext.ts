import type { UIMatch } from "react-router-dom";

/** Custom data on route `handle` (see routes.tsx). */
export type AppRouteHandle = {
    showGeneratePdfButton?: boolean;
    showCvEditorTabs?: boolean;
};

export type CvEditorTab = "editing" | "templates";

export type RootLayoutOutletContext = {
    registerCvGeneratePdf: (handler: (() => Promise<void>) | null) => void;
    cvEditorTab: CvEditorTab;
    setCvEditorTab: (tab: CvEditorTab) => void;
};

export function matchShowsGeneratePdfButton(matches: UIMatch[]): boolean {
    return matches.some((m) => (m.handle as AppRouteHandle | undefined)?.showGeneratePdfButton === true);
}

export function matchShowCvEditorTabs(matches: UIMatch[]): boolean {
    return matches.some((m) => (m.handle as AppRouteHandle | undefined)?.showCvEditorTabs === true);
}
