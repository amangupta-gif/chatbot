import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';

  if (inline) {
    return <code className={className} {...props}>{children}</code>;
  }

  return (
    <div className="relative group my-2">
      {lang && (
        <div className="absolute top-2 right-2 text-xs text-zinc-500 font-mono z-10 select-none">
          {lang}
        </div>
      )}
      <SyntaxHighlighter
        style={oneDark}
        language={lang || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '8px',
          fontSize: '0.8rem',
          padding: '1em',
          background: '#0d0d10',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownRenderer({ content }) {
  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ code: CodeBlock }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
