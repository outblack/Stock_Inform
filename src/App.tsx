import { useEffect, useDeferredValue, useState, useTransition } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { MarkdownArticle } from "./components/MarkdownArticle";
import type { Category, DocumentResponse, DocumentSummary, LibraryResponse } from "./types";

function formatDate(value: number | string | null) {
  if (!value) {
    return "시간 정보 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatDateFilterLabel(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short"
  }).format(parsed);
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function matchesQuery(item: DocumentSummary, query: string) {
  if (!query) {
    return true;
  }

  const subject = `${item.title} ${item.summary} ${item.relativePath} ${item.directoryLabel}`.toLowerCase();
  return subject.includes(query.toLowerCase());
}

function groupByDirectory(items: DocumentSummary[]) {
  const grouped = new Map<string, DocumentSummary[]>();

  for (const item of items) {
    const group = grouped.get(item.directoryLabel) || [];
    group.push(item);
    grouped.set(item.directoryLabel, group);
  }

  return [...grouped.entries()].sort((left, right) => right[0].localeCompare(left[0], "ko"));
}

function flattenCategories(categories: Category[]) {
  return categories.flatMap((category) => category.items);
}

function deriveDateLabel(item: {
  kind: string;
  relativePath: string;
  analysisTimestamp?: string | null;
  mtimeMs?: number;
}) {
  if (item.kind === "skill") {
    return null;
  }

  const reportPathMatch = item.relativePath.match(/^reports\/(\d{4}-\d{2}-\d{2})\//);
  if (reportPathMatch?.[1]) {
    return reportPathMatch[1];
  }

  const sourceValue = item.analysisTimestamp || item.mtimeMs;
  if (!sourceValue) {
    return null;
  }

  const parsed = new Date(sourceValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function normalizeLibraryResponse(payload: LibraryResponse): LibraryResponse {
  return {
    ...payload,
    categories: payload.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        dateLabel: item.dateLabel ?? deriveDateLabel(item),
        canDelete: item.canDelete ?? item.kind === "report"
      }))
    }))
  };
}

export default function App() {
  const [library, setLibrary] = useState<LibraryResponse | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [document, setDocument] = useState<DocumentResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDate, setActiveDate] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusText, setStatusText] = useState("라이브러리를 불러오는 중입니다.");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  async function fetchLibrary() {
    try {
      const response = await fetch("/api/library");
      if (!response.ok) {
        throw new Error("라이브러리를 불러오지 못했습니다.");
      }

      const payload = normalizeLibraryResponse((await response.json()) as LibraryResponse);
      setLibrary(payload);
      setStatusText(`문서 인덱스 새로고침 완료 · ${formatDate(payload.generatedAt)}`);
      return payload;
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "라이브러리 로딩에 실패했습니다.");
      return null;
    }
  }

  async function fetchDocument(nextId: string) {
    if (!nextId) {
      setDocument(null);
      return;
    }

    try {
      const response = await fetch(`/api/document?id=${encodeURIComponent(nextId)}`);
      if (!response.ok) {
        throw new Error("선택한 문서를 불러오지 못했습니다.");
      }

      const payload = (await response.json()) as DocumentResponse;
      setDocument(payload);
    } catch (error) {
      setDocument(null);
      setStatusText(error instanceof Error ? error.message : "문서 로딩에 실패했습니다.");
    }
  }

  function openCategory(categoryId: string) {
    startTransition(() => {
      setActiveCategory(categoryId);
      setActiveDate("all");
      setIsSidebarOpen(true);
    });
  }

  function shouldCloseDrawerAfterSelection() {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches;
  }

  async function handleDeleteDocument(item: DocumentSummary) {
    if (!item.canDelete) {
      setStatusText("이 문서는 앱에서 삭제할 수 없는 파일입니다.");
      return;
    }

    const confirmed = window.confirm(`"${item.title}" 문서를 삭제할까요?\n삭제 후에는 되돌릴 수 없습니다.`);
    if (!confirmed) {
      return;
    }

    const fallbackId = selectedId === item.id ? visibleItems.find((entry) => entry.id !== item.id)?.id ?? "" : selectedId;

    try {
      setDeletingId(item.id);

      const response = await fetch(`/api/document?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: item.id
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "문서를 삭제하지 못했습니다.");
      }

      if (selectedId === item.id) {
        setDocument(null);
        setSelectedId(fallbackId);
      }

      await fetchLibrary();
      setStatusText(`문서를 삭제했습니다 · ${item.title}`);
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "문서 삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    fetchLibrary();
  }, []);

  const filteredCategories =
    library?.categories.map((category) => ({
      ...category,
      items: category.items.filter((item) => matchesQuery(item, deferredQuery))
    })) ?? [];

  const categoryScopedCategories =
    activeCategory === "all"
      ? filteredCategories
      : filteredCategories.filter((category) => category.id === activeCategory);

  const availableDates = [...new Set(
    flattenCategories(categoryScopedCategories)
      .map((item) => item.dateLabel)
      .filter((value): value is string => Boolean(value))
  )].sort((left, right) => right.localeCompare(left, "ko"));

  const visibleCategories = categoryScopedCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => activeDate === "all" || item.dateLabel === activeDate)
    }))
    .filter((category) => category.items.length > 0);

  const visibleItems = flattenCategories(visibleCategories);

  useEffect(() => {
    if (activeDate !== "all" && !availableDates.includes(activeDate)) {
      setActiveDate(availableDates[0] ?? "all");
    }
  }, [activeDate, availableDates]);

  useEffect(() => {
    if (visibleItems.length === 0) {
      setSelectedId("");
      setDocument(null);
      return;
    }

    const currentExists = visibleItems.some((item) => item.id === selectedId);
    if (!currentExists) {
      const fallback = visibleItems[0];
      setSelectedId(fallback.id);
    }
  }, [selectedId, visibleItems]);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    fetchDocument(selectedId);
  }, [selectedId]);

  useEffect(() => {
    window.location.hash = selectedId ? encodeURIComponent(selectedId) : "";
  }, [selectedId]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      setSelectedId(decodeURIComponent(hash));
    }
  }, []);

  const groupedItems = groupByDirectory(visibleItems);
  const activeItem = document?.item || visibleItems.find((item) => item.id === selectedId) || null;
  const totalVisibleCount = filteredCategories.reduce((sum, category) => sum + category.items.length, 0);

  return (
    <div className="app-shell">
      <motion.div className="scroll-progress" style={{ scaleX: progressScale }} />
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />

      <header className="top-shell">
        <div className="topbar">
          <div className="topbar-group">
            <span className="topbar-caption">문서 {library?.stats.totalDocuments ?? 0}</span>
          </div>

          <div className="topbar-group">
            <span className={`status-chip ${isPending ? "status-chip-busy" : ""}`}>
              {isPending ? "전환 중" : "라이브"}
            </span>
            <button
              className="refresh-button"
              onClick={() => {
                fetchLibrary();
                if (activeItem) {
                  void fetchDocument(activeItem.id);
                }
              }}
            >
              새로고침
            </button>
          </div>
        </div>

        <nav className="category-tabs">
          <button
            className={`category-tab ${activeCategory === "all" ? "category-tab-active" : ""}`}
            onClick={() => openCategory("all")}
          >
            <span>전체</span>
            <strong>{totalVisibleCount}</strong>
          </button>

          {library?.categories.map((category) => {
            const filteredCount =
              filteredCategories.find((entry) => entry.id === category.id)?.items.length ?? 0;

            return (
              <button
                key={category.id}
                className={`category-tab ${activeCategory === category.id ? "category-tab-active" : ""}`}
                onClick={() => openCategory(category.id)}
              >
                <span>{category.label}</span>
                <strong>{filteredCount}</strong>
              </button>
            );
          })}
        </nav>
      </header>

      <main className={`workspace-single ${isSidebarOpen ? "workspace-with-drawer" : ""}`}>
        <AnimatePresence>
          {isSidebarOpen ? (
            <>
              <motion.button
                className="drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => {
                  setIsSidebarOpen(false);
                }}
              />

              <motion.aside
                className="library-drawer"
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="drawer-header">
                  <div>
                    <span className="eyebrow">Library</span>
                    <h2>문서 목록</h2>
                  </div>
                  <button
                    className="drawer-close"
                    onClick={() => {
                      setIsSidebarOpen(false);
                    }}
                  >
                    닫기
                  </button>
                </div>

                <label className="search-shell drawer-search">
                  <span>Search</span>
                  <input
                    value={query}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      startTransition(() => {
                        setQuery(nextValue);
                      });
                    }}
                    placeholder="시황, PLS, theme, ticker, 날짜..."
                  />
                </label>

                {availableDates.length > 0 ? (
                  <div className="date-filter-shell">
                    <span>날짜</span>
                    <div className="date-filter-row">
                      <button
                        className={`date-chip ${activeDate === "all" ? "date-chip-active" : ""}`}
                        onClick={() => {
                          setActiveDate("all");
                        }}
                      >
                        전체 날짜
                      </button>
                      {availableDates.map((dateValue) => (
                        <button
                          key={dateValue}
                          className={`date-chip ${activeDate === dateValue ? "date-chip-active" : ""}`}
                          onClick={() => {
                            setActiveDate(dateValue);
                          }}
                        >
                          {formatDateFilterLabel(dateValue)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="drawer-status">{statusText}</div>

                <div className="document-groups drawer-groups">
                  {groupedItems.length === 0 ? (
                    <div className="empty-state drawer-empty">
                      <h3>표시할 문서가 없습니다.</h3>
                      <p>
                        <code>./reports/&lt;날짜&gt;/...md</code> 형태로 보고서를 저장하거나 검색어를
                        비워보세요.
                      </p>
                    </div>
                  ) : (
                    groupedItems.map(([directory, items]) => (
                      <div key={directory} className="directory-group">
                        <div className="directory-heading">{directory}</div>
                        {items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            className={`doc-row ${selectedId === item.id ? "doc-row-active" : ""}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.02 }}
                          >
                            <div className="doc-row-top">
                              <div className="doc-row-head">
                                <span className={`doc-kind doc-kind-${item.kind}`}>
                                  {item.kind === "skill" ? "SKILL" : "REPORT"}
                                </span>
                                <span className="doc-time">{formatDate(item.analysisTimestamp || item.mtimeMs)}</span>
                              </div>

                              {item.canDelete ? (
                                <button
                                  className="doc-delete-button"
                                  disabled={deletingId === item.id}
                                  onClick={() => {
                                    void handleDeleteDocument(item);
                                  }}
                                >
                                  {deletingId === item.id ? "삭제 중..." : "삭제"}
                                </button>
                              ) : null}
                            </div>

                            <button
                              className="doc-row-select"
                              onClick={() =>
                                startTransition(() => {
                                  setSelectedId(item.id);
                                  if (shouldCloseDrawerAfterSelection()) {
                                    setIsSidebarOpen(false);
                                  }
                                })
                              }
                            >
                              <strong>{item.title}</strong>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        <section className="panel viewer-panel viewer-stage">
          {activeItem && document ? (
            <>
              <div className="viewer-header">
                <div>
                  <h2>{activeItem.title}</h2>
                  <p className="viewer-subtitle">
                    {activeCategory === "all"
                      ? "전체 문서"
                      : library?.categories.find((category) => category.id === activeCategory)?.label ?? "문서"}
                  </p>
                </div>

                {activeItem.canDelete ? (
                  <div className="viewer-actions">
                    <button
                      className="danger-button"
                      disabled={deletingId === activeItem.id}
                      onClick={() => {
                        void handleDeleteDocument(activeItem);
                      }}
                    >
                      {deletingId === activeItem.id ? "삭제 중..." : "문서 삭제"}
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="meta-strip">
                <span>{activeItem.relativePath}</span>
                <span>{formatDate(activeItem.analysisTimestamp || activeItem.mtimeMs)}</span>
                <span>{formatFileSize(activeItem.size)}</span>
              </div>

              {document.headings.length > 0 ? (
                <nav className="toc-strip">
                  {document.headings.map((heading) => (
                    <a key={heading.id} href={`#${heading.id}`} className={`toc-chip toc-depth-${heading.depth}`}>
                      {heading.text}
                    </a>
                  ))}
                </nav>
              ) : null}

              <motion.article
                key={document.item.id + document.generatedAt}
                className="article-shell"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <MarkdownArticle content={document.content} />
              </motion.article>
            </>
          ) : (
            <div className="empty-state viewer-empty">
              <h3>선택된 문서가 없습니다.</h3>
              <p>상단 카테고리를 눌러 사이드바를 열고 보고서나 스킬 문서를 선택해보세요.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
