import { createContext, useContext, type ReactNode } from "react";

// Maps entry ID → pixels of top padding to push the entry past a page boundary.
// Zero pushes (empty object) = natural layout (no adjustments).
export const PageBreakContext = createContext<Record<string, number>>({});

export function AvoidBreak({ id, children }: { id: string; children: ReactNode }) {
    const pushes = useContext(PageBreakContext);
    const push = pushes[id] ?? 0;
    return (
        <div
            data-break-id={id}
            style={{ paddingTop: push > 0 ? push : undefined, breakInside: "avoid" }}
        >
            {children}
        </div>
    );
}
