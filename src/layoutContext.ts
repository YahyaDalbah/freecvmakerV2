import type { UIMatch } from "react-router-dom";

/** Custom data on route `handle` (see routes.tsx). */
export type AppRouteHandle = {
    showGeneratePdfButton?: boolean;
};

export type RootLayoutOutletContext = {
    registerCvGeneratePdf: (handler: (() => Promise<void>) | null) => void;
};

export function matchShowsGeneratePdfButton(matches: UIMatch[]): boolean {
    return matches.some((m) => (m.handle as AppRouteHandle | undefined)?.showGeneratePdfButton === true);
}
