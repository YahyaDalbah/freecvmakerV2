import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { resolveCvTemplate, isFullBleedTemplate } from "./cvTemplates";
import type { CvTemplateProps } from "./cvTemplateTypes";
import { PAGE_W, PAGE_H, PAGE_VPAD, CONTENT_H } from "./cvDimensions";
import { PageBreakContext } from "./AvoidBreak";

type Props = CvTemplateProps & {
    templateId?: string;
    className?: string;
};

// Stable empty-object reference so the measurement provider never triggers re-renders.
const ZERO_PUSHES: Record<string, number> = {};

export default function CvLivePreview({ templateId, className = "", ...templateProps }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [numPages, setNumPages] = useState(1);
    const [pushes, setPushes] = useState<Record<string, number>>({});

    const Template = resolveCvTemplate(templateId);
    // Full-bleed templates (e.g. sidebar) must fill the page edge-to-edge.
    // They use PAGE_H clipping with no top/bottom padding.
    // Padded templates use CONTENT_H clipping with PAGE_VPAD whitespace around each page.
    const fullBleed = isFullBleedTemplate(templateId);
    const clipH = fullBleed ? PAGE_H : CONTENT_H;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => {
            const w = el.offsetWidth;
            if (w > 0) setScale(w / PAGE_W);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // After every render:
    //   1. Scan [data-break-id] elements in the zero-push measurement div to get natural positions.
    //   2. Compute which entries would cross a page boundary and by how much.
    //   3. If pushes changed, update state (one more render, then stable).
    //   4. Otherwise compute numPages from natural height + total push sum.
    useLayoutEffect(() => {
        const el = measureRef.current;
        if (!el) return;

        const entries = Array.from(el.querySelectorAll<HTMLElement>("[data-break-id]"));
        const newPushes: Record<string, number> = {};
        let cumulativePush = 0;
        const elTop = el.getBoundingClientRect().top;

        for (const entry of entries) {
            const id = entry.getAttribute("data-break-id")!;
            const rect = entry.getBoundingClientRect();
            const naturalTop = rect.top - elTop;
            // Actual top accounts for all preceding entries' pushes shifting this one down.
            const actualTop = naturalTop + cumulativePush;
            const height = rect.height;

            // Only push entries that fit on one page; skip zero-height and oversized entries.
            if (height > 0 && height <= clipH) {
                const nextBoundary = (Math.floor(actualTop / clipH) + 1) * clipH;
                if (actualTop < nextBoundary && nextBoundary < actualTop + height) {
                    const myPush = nextBoundary - actualTop;
                    newPushes[id] = myPush;
                    cumulativePush += myPush;
                }
            }
        }

        const keysA = Object.keys(newPushes);
        const keysB = Object.keys(pushes);
        const changed =
            keysA.length !== keysB.length || keysA.some((k) => newPushes[k] !== pushes[k]);

        if (changed) {
            setPushes(newPushes);
            return; // numPages will be recomputed on next render after pushes settle
        }

        // Compute numPages from natural height + total push sum.
        // Subtract 0.5 to absorb browser integer rounding of clipH (prevents spurious extra pages).
        const naturalH = el.scrollHeight;
        const totalPushSum = keysA.reduce((acc, k) => acc + newPushes[k], 0);
        const actualH = naturalH + totalPushSum;
        const n = Math.max(1, Math.ceil((actualH - 0.5) / clipH));
        if (n !== numPages) setNumPages(n);
    });

    const totalH = numPages * clipH;

    return (
        <div ref={containerRef} className={`w-full ${className}`}>
            {/* Zero-push measurement div — always natural layout so positions are stable */}
            <PageBreakContext.Provider value={ZERO_PUSHES}>
                <div
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        top: -9999,
                        left: -9999,
                        width: PAGE_W,
                        visibility: "hidden",
                        pointerEvents: "none",
                        overflow: "hidden",
                    }}
                >
                    <div ref={measureRef}>
                        <Template {...templateProps} variant="embedded" />
                    </div>
                </div>
            </PageBreakContext.Provider>

            {/* Visible pages — templates rendered with computed pushes */}
            <PageBreakContext.Provider value={pushes}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {Array.from({ length: numPages }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                width: PAGE_W * scale,
                                height: PAGE_H * scale,
                                overflow: "hidden",
                                position: "relative",
                                background: "white",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                                flexShrink: 0,
                            }}
                        >
                            {fullBleed ? (
                                /*
                                 * Full-bleed: template background fills entire page window.
                                 * Content div shifted so page i's slice starts at the top.
                                 */
                                <div
                                    style={{
                                        position: "absolute",
                                        top: -(i * PAGE_H * scale),
                                        left: 0,
                                        width: PAGE_W,
                                        minHeight: totalH,
                                        transform: `scale(${scale})`,
                                        transformOrigin: "top left",
                                    }}
                                >
                                    <Template {...templateProps} variant="embedded" />
                                </div>
                            ) : (
                                /*
                                 * Padded: inner viewport sits PAGE_VPAD from top and bottom,
                                 * showing exactly CONTENT_H of template content per page.
                                 */
                                <div
                                    style={{
                                        position: "absolute",
                                        top: PAGE_VPAD * scale,
                                        left: 0,
                                        width: PAGE_W * scale,
                                        height: CONTENT_H * scale,
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: -i * CONTENT_H * scale,
                                            left: 0,
                                            width: PAGE_W,
                                            minHeight: totalH,
                                            transform: `scale(${scale})`,
                                            transformOrigin: "top left",
                                        }}
                                    >
                                        <Template {...templateProps} variant="embedded" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </PageBreakContext.Provider>
        </div>
    );
}
