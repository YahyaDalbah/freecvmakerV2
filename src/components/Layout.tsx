import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import type { CvEditorTab, RootLayoutOutletContext } from "../layoutContext";

export default function Layout() {
    const [cvGeneratePdf, setCvGeneratePdf] = useState<(() => Promise<void>) | null>(null);
    const [cvEditorTab, setCvEditorTab] = useState<CvEditorTab>("editing");

    const registerCvGeneratePdf = useCallback((handler: (() => Promise<void>) | null) => {
        // Functional update only: `setState(fn)` must not be confused with storing `fn` as state (React would call it).
        setCvGeneratePdf((_prev) => handler);
    }, []);

    const outletContext: RootLayoutOutletContext = {
        registerCvGeneratePdf,
        cvEditorTab,
        setCvEditorTab,
    };

    return (
        <>
            <Navbar cvGeneratePdfHandler={cvGeneratePdf} cvEditorTab={cvEditorTab} setCvEditorTab={setCvEditorTab} />
            <Outlet context={outletContext} />
        </>
    );
}
