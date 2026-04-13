import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";

type MermaidBlockProps = {
  code: string;
};

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    background: "#0b1020",
    primaryColor: "#60a5fa",
    primaryTextColor: "#e5efff",
    primaryBorderColor: "#5eead4",
    secondaryColor: "#111829",
    secondaryTextColor: "#d7e5ff",
    tertiaryColor: "#151f33",
    lineColor: "#7dd3fc",
    textColor: "#d7e5ff"
  }
});

export function MermaidBlock({ code }: MermaidBlockProps) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;

    mermaid
      .render(`mermaid-${id}`, code)
      .then((result) => {
        if (!cancelled) {
          setSvg(result.svg);
          setError("");
        }
      })
      .catch((renderError: unknown) => {
        if (!cancelled) {
          setError(renderError instanceof Error ? renderError.message : "Mermaid diagram failed to render.");
          setSvg("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <div className="embedded-block embedded-block-error">
        <strong>Mermaid 렌더링 실패</strong>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div
      className="embedded-block mermaid-block"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
