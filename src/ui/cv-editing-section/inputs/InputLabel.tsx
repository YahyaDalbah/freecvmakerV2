import { memo } from "react";

function InputLabel({ label }: { label?: string }) {
    return (
        <>
            {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
        </>
    )
}

export default memo(InputLabel);
