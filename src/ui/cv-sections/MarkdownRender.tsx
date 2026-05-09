import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AvoidBreak } from "../../pages/cv/AvoidBreak";

interface MarkdownRenderProps {
  content: string;
  className?: string;
  /** When set, each unordered list item gets its own AvoidBreak so individual bullets
   *  can be pushed past a page boundary without dragging the whole list with them. */
  idPrefix?: string;
}

export default function MarkdownRender({ content, className = "", idPrefix }: MarkdownRenderProps) {
  // Group consecutive list items together, keep other lines separate
  const processContent = (text: string) => {
    const lines = text.split('\n');
    const groups: string[] = [];
    let currentListGroup: string[] = [];

    lines.forEach((line) => {
      const isListItem = /^\s*[-*+]\s/.test(line) || /^\s*\d+\.\s/.test(line);

      if (isListItem) {
        currentListGroup.push(line);
      } else {
        if (currentListGroup.length > 0) {
          groups.push(currentListGroup.join('\n'));
          currentListGroup = [];
        }
        if (line.trim()) {
          groups.push(line);
        } else {
          groups.push("");
        }
      }
    });

    if (currentListGroup.length > 0) {
      groups.push(currentListGroup.join('\n'));
    }

    return groups;
  };

  const contentGroups = processContent(content);

  return (
    <div className={`[&_p]:m-0 [&_p]:inline [&_ul]:m-0 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:m-0 [&_ol]:pl-5 [&_ol]:list-decimal ${className}`}>
      {contentGroups.map((group, groupIndex) => {
        if (group === "") {
          return <span key={groupIndex} className="block h-[1em] min-h-[1em] w-full shrink-0" aria-hidden />;
        }

        // Unordered list + idPrefix: render each bullet in its own AvoidBreak so they
        // move to the next page individually rather than all-or-nothing.
        if (idPrefix && /^\s*[-*+]\s/.test(group)) {
          return group.split('\n').filter(Boolean).map((item, i) => (
            <AvoidBreak key={`${groupIndex}-${i}`} id={`${idPrefix}-${groupIndex}-${i}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{item}</ReactMarkdown>
            </AvoidBreak>
          ));
        }

        // Everything else (plain text, ordered lists): plain block, no page-break avoidance.
        // Long descriptions and flowing text are intentionally allowed to be cut at page boundaries.
        return (
          <span key={groupIndex} className="block">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{group}</ReactMarkdown>
          </span>
        );
      })}
    </div>
  );
}
