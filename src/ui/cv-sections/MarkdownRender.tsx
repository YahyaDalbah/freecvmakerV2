interface MarkdownRenderProps {
  content: string;
  className?: string;
}

export default function MarkdownRender({ content, className = "" }: MarkdownRenderProps) {
  return <div className={`cv-markdown ${className}`} dangerouslySetInnerHTML={{ __html: content }} />;
}
