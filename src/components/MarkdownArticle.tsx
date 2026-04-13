import { Children, Suspense, isValidElement, lazy } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { ReactNode } from "react";

const MermaidBlock = lazy(async () => {
  const module = await import("./MermaidBlock");
  return { default: module.MermaidBlock };
});

const EChartsBlock = lazy(async () => {
  const module = await import("./EChartsBlock");
  return { default: module.EChartsBlock };
});

type MarkdownArticleProps = {
  content: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=,[\]{};:'"\\|<>/?]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "section";
}

function nodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => nodeToText(child)).join(" ");
  }

  if (node && typeof node === "object" && "props" in node) {
    return nodeToText((node as { props?: { children?: ReactNode } }).props?.children ?? "");
  }

  return "";
}

function codeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => codeToText(child)).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    return codeToText((node as { props?: { children?: ReactNode } }).props?.children ?? "");
  }

  return "";
}

function extractCodeBlock(children: ReactNode) {
  const nodes = Children.toArray(children);

  if (nodes.length !== 1) {
    return null;
  }

  const codeNode = nodes[0];

  if (!isValidElement<{ className?: string; children?: ReactNode }>(codeNode)) {
    return null;
  }

  const className = codeNode.props.className;

  return {
    className,
    code: codeToText(codeNode.props.children).replace(/\n$/, "")
  };
}

export function MarkdownArticle({ content }: MarkdownArticleProps) {
  const headingCount = new Map<string, number>();

  function getHeadingId(text: string) {
    const base = slugify(text);
    const count = headingCount.get(base) || 0;
    headingCount.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  }

  return (
    <ReactMarkdown
      className="markdown-body"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => {
          const text = nodeToText(children);
          const id = getHeadingId(text);
          return <h1 id={id}>{children}</h1>;
        },
        h2: ({ children }) => {
          const text = nodeToText(children);
          const id = getHeadingId(text);
          return <h2 id={id}>{children}</h2>;
        },
        h3: ({ children }) => {
          const text = nodeToText(children);
          const id = getHeadingId(text);
          return <h3 id={id}>{children}</h3>;
        },
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
        code({ className, children, node: _node, ...props }) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre({ children, node: _node, ...props }) {
          const codeBlock = extractCodeBlock(children);
          const language = codeBlock?.className?.replace("language-", "");

          if (language === "mermaid" && codeBlock) {
            return (
              <Suspense fallback={<div className="embedded-block">Mermaid 렌더러 로딩 중...</div>}>
                <MermaidBlock code={codeBlock.code} />
              </Suspense>
            );
          }

          if (language === "echarts" && codeBlock) {
            return (
              <Suspense fallback={<div className="embedded-block">차트 렌더러 로딩 중...</div>}>
                <EChartsBlock code={codeBlock.code} />
              </Suspense>
            );
          }

          return (
            <pre className="code-block" {...props}>
              <code className={codeBlock?.className}>{codeBlock ? codeBlock.code : children}</code>
            </pre>
          );
        },
        table: ({ children }) => (
          <div className="table-wrap">
            <table>{children}</table>
          </div>
        ),
        blockquote: ({ children }) => <blockquote className="quote-block">{children}</blockquote>
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
