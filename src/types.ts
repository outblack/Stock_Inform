export type DocumentKind = "report" | "skill";

export type DocumentSummary = {
  id: string;
  kind: DocumentKind;
  title: string;
  summary: string;
  categoryId: string;
  relativePath: string;
  absolutePath: string;
  directoryLabel: string;
  mtimeMs: number;
  size: number;
  analysisTimestamp: string | null;
  dateLabel: string | null;
  canDelete: boolean;
};

export type Category = {
  id: string;
  label: string;
  description: string;
  accent: string;
  count: number;
  items: DocumentSummary[];
};

export type LibraryResponse = {
  generatedAt: string;
  workspaceRoot: string;
  stats: {
    totalDocuments: number;
    reportCount: number;
    skillCount: number;
  };
  categories: Category[];
};

export type Heading = {
  depth: number;
  text: string;
  id: string;
};

export type DocumentResponse = {
  item: DocumentSummary;
  content: string;
  frontmatter: Record<string, unknown>;
  headings: Heading[];
  generatedAt: string;
};
