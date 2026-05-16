import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { AvoidBreak } from "../../pages/cv/AvoidBreak";

interface MarkdownRenderProps {
  content: string;
  className?: string;
  /** When set, each unordered list item gets its own AvoidBreak so individual
   *  bullets can be pushed past a page boundary without dragging the whole list. */
  idPrefix?: string;
}

export default function MarkdownRender({ content, className = "", idPrefix }: MarkdownRenderProps) {
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
        groups.push(line.trim() ? line : "");
      }
    });

    if (currentListGroup.length > 0) groups.push(currentListGroup.join('\n'));
    return groups;
  };

  const contentGroups = processContent(content);

  return (
    <div className={`cv-markdown ${className}`}>
      {contentGroups.map((group, groupIndex) => {
        if (group === "") {
          return <span key={groupIndex} className="block h-[1em] min-h-[1em] w-full shrink-0" aria-hidden />;
        }

        if (idPrefix && /^\s*[-*+]\s/.test(group)) {
          return group.split('\n').filter(Boolean).map((item, i) => (
            <AvoidBreak key={`${groupIndex}-${i}`} id={`${idPrefix}-${groupIndex}-${i}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{item}</ReactMarkdown>
            </AvoidBreak>
          ));
        }

        return (
          <span key={groupIndex} className="block">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{group}</ReactMarkdown>
          </span>
        );
      })}
    </div>
  );
}
