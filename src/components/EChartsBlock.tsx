import ReactECharts from "echarts-for-react";

type EChartsBlockProps = {
  code: string;
};

function buildOption(rawOption: unknown) {
  if (!rawOption || typeof rawOption !== "object" || Array.isArray(rawOption)) {
    return {
      title: {
        text: "Invalid chart specification",
        textStyle: { color: "#f8fafc" }
      }
    };
  }

  const baseOption = rawOption as Record<string, unknown>;

  return {
    backgroundColor: "transparent",
    textStyle: {
      color: "#d7e5ff",
      fontFamily: "'Noto Sans KR', sans-serif"
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(10, 16, 32, 0.92)",
      borderColor: "rgba(125, 211, 252, 0.35)",
      textStyle: { color: "#f8fafc" }
    },
    grid: {
      top: 48,
      right: 28,
      bottom: 42,
      left: 46
    },
    ...baseOption
  };
}

export function EChartsBlock({ code }: EChartsBlockProps) {
  try {
    const parsed = JSON.parse(code);
    const option = buildOption(parsed);

    return (
      <div className="embedded-block chart-block">
        <ReactECharts option={option} style={{ height: 360, width: "100%" }} opts={{ renderer: "svg" }} />
      </div>
    );
  } catch (error) {
    return (
      <div className="embedded-block embedded-block-error">
        <strong>ECharts JSON 파싱 실패</strong>
        <pre>{error instanceof Error ? error.message : "Unknown chart parse error."}</pre>
      </div>
    );
  }
}
