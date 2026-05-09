import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { resolveCvTemplate, isFullBleedTemplate } from "./cvTemplates";
import type { CvTemplateProps } from "./cvTemplateTypes";
import { PAGE_W, PAGE_H, PAGE_VPAD, CONTENT_H } from "./cvDimensions";

type Props = CvTemplateProps & {
    templateId?: string;
    className?: string;
};

export default function CvLivePreview({ templateId, className = "", ...templateProps }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [numPages, setNumPages] = useState(1);

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

    // Measure after every render; only update state when page count changes.
    // Subtract 0.5 before dividing to absorb browser's integer rounding of clipH
    // (prevents spurious extra pages when scrollHeight == ceil(n * clipH)).
    useLayoutEffect(() => {
        const el = measureRef.current;
        if (!el) return;
        const h = el.scrollHeight;
        const n = Math.max(1, Math.ceil((h - 0.5) / clipH));
        if (n !== numPages) setNumPages(n);
    });

    const totalH = numPages * clipH;

    return (
        <div ref={containerRef} className={`w-full ${className}`}>
            {/* Off-screen render at 1:1 scale purely for height measurement */}
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

            {/* One clipped window per page */}
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
                             * top = -(i * PAGE_H * scale) maps template y=(i*PAGE_H)
                             * to the top of the page window.
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
                             * The outer div's white background provides the padding areas.
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
        </div>
    );
}
