export function isAnyFieldFilled(section: Record<string, unknown>): boolean {
    return Object.keys(section).some((key) => {
        if (key === "id") return false;
        const value = section[key];
        if (value === undefined || value === null) return false;
        if (typeof value === "string") return value.trim() !== "";
        if (Array.isArray(value)) return value.some((v) => typeof v === "string" && v.trim() !== "");
        return false;
    });
}
