import { useMemo } from "react";
import { AvoidBreak } from "../../pages/cv/AvoidBreak";

interface MarkdownRenderProps {
  content: string;
  className?: string;
  idPrefix?: string;
}

export default function MarkdownRender({ content, className = "", idPrefix }: MarkdownRenderProps) {
  const nodes = useMemo(() => {
    if (!idPrefix) return null;
    const div = document.createElement("div");
    div.innerHTML = content;
    return Array.from(div.children);
  }, [content, idPrefix]);

  if (!idPrefix) {
    return <div className={`cv-markdown ${className}`} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <div className={`cv-markdown ${className}`}>
      {nodes!.flatMap((node, i) => {
        const tag = node.tagName.toLowerCase();
        if (tag === "ul" || tag === "ol") {
          return Array.from(node.children).map((li, j) => (
            <AvoidBreak key={`${i}-${j}`} id={`${idPrefix}-${i}-${j}`}>
              <div dangerouslySetInnerHTML={{ __html: `<${tag}>${li.outerHTML}</${tag}>` }} />
            </AvoidBreak>
          ));
        }
        return (
          <AvoidBreak key={i} id={`${idPrefix}-${i}`}>
            <div dangerouslySetInnerHTML={{ __html: node.outerHTML }} />
          </AvoidBreak>
        );
      })}
    </div>
  );
}
