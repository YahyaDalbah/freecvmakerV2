import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRenderProps {
  content: string;
  className?: string;
}

export default function MarkdownRender({ content, className = "" }: MarkdownRenderProps) {
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
        // If we have accumulated list items, add them as a group
        if (currentListGroup.length > 0) {
          groups.push(currentListGroup.join('\n'));
          currentListGroup = [];
        }
        // Non-list: keep each text line; preserve blank lines as vertical space (page breaks / spacing)
        if (line.trim()) {
          groups.push(line);
        } else {
          groups.push("");
        }
      }
    });
    
    // Don't forget remaining list items
    if (currentListGroup.length > 0) {
      groups.push(currentListGroup.join('\n'));
    }
    
    return groups;
  };

  const contentGroups = processContent(content);

  return (
    <div className={`[&_p]:m-0 [&_p]:inline [&_ul]:m-0 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:m-0 [&_ol]:pl-5 [&_ol]:list-decimal ${className}`}>
      {contentGroups.map((group, index) => (
        <span key={index} className="block">
          {group === "" ? (
            <span className="block h-[1em] min-h-[1em] w-full shrink-0" aria-hidden />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {group}
            </ReactMarkdown>
          )}
        </span>
      ))}
    </div>
  );
}
