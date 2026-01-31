import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRenderProps {
  content: string;
  className?: string;
}

export default function MarkdownRender({ content, className = "" }: MarkdownRenderProps) {
  return (
    <div className={`[&_p]:m-0 [&_p]:inline ${className}`}>
      {content.split('\n').map((line, index) => (
        <span key={index} className="block">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {line}
          </ReactMarkdown>
        </span>
      ))}
    </div>
  );
}
