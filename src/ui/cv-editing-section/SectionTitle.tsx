import { memo } from "react";

function SectionTitle({title}: {title: string}) {
  return (
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
  )
}

export default memo(SectionTitle);
