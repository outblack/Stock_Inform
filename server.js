import express from "express";
import { existsSync, promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";

const workspaceRoot = process.cwd();
const reportsRoot = path.join(workspaceRoot, "reports");
const distRoot = path.join(workspaceRoot, "dist");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || "4321");

function resolveSkillDocPath(skillName) {
  const bundledPath = path.join(workspaceRoot, "skills", skillName, "SKILL.md");
  const codexPath = path.join(os.homedir(), ".codex", "skills", skillName, "SKILL.md");
  return existsSync(bundledPath) ? bundledPath : codexPath;
}

const categoryCatalog = [
  {
    id: "market",
    label: "시황 리포트",
    description: "글로벌/한국 매크로와 리스크 온오프 판단",
    accent: "from-cyan-300/90 via-sky-400/50 to-transparent"
  },
  {
    id: "pls",
    label: "PLS 라인",
    description: "주봉·월봉 지지저항과 분할 진입 시나리오",
    accent: "from-emerald-300/90 via-teal-400/50 to-transparent"
  },
  {
    id: "theme",
    label: "테마 로테이션",
    description: "당일 주도 테마와 대장주, 순환 시나리오",
    accent: "from-fuchsia-300/90 via-rose-400/50 to-transparent"
  },
  {
    id: "stock",
    label: "종목 심층 리포트",
    description: "개별 종목 토론형 리서치와 시나리오 분석",
    accent: "from-amber-300/90 via-orange-400/50 to-transparent"
  },
  {
    id: "skill-docs",
    label: "스킬 문서",
    description: "스킬 호출법과 각 스킬 설명서",
    accent: "from-violet-300/90 via-indigo-400/50 to-transparent"
  },
  {
    id: "misc",
    label: "기타 문서",
    description: "분류 규칙에 걸리지 않은 markdown",
    accent: "from-slate-300/90 via-zinc-300/50 to-transparent"
  }
];

const skillDocs = [
  {
    slug: "usage-guide",
    title: "Stock Skills Usage Guide",
    description: "현재 구축한 주식 리서치 스킬 호출 가이드",
    filePath: path.join(workspaceRoot, "stock-skills-usage-guide.md")
  },
  {
    slug: "market-regime-debate",
    title: "Market Regime Debate Skill",
    description: "시장 레짐 분석 스킬 설명서",
    filePath: resolveSkillDocPath("market-regime-debate")
  },
  {
    slug: "pls-line-detector",
    title: "PLS Line Detector Skill",
    description: "플스선 탐색 스킬 설명서",
    filePath: resolveSkillDocPath("pls-line-detector")
  },
  {
    slug: "theme-rotation-map",
    title: "Theme Rotation Map Skill",
    description: "테마 순환 분석 스킬 설명서",
    filePath: resolveSkillDocPath("theme-rotation-map")
  },
  {
    slug: "stock-research-debate",
    title: "Stock Research Debate Skill",
    description: "개별 종목 토론형 리서치 스킬 설명서",
    filePath: resolveSkillDocPath("stock-research-debate")
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=,[\]{};:'"\\|<>/?]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "section";
}

function stripMarkdown(value) {
  return value
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "$1")
    .replace(/[>#*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFromContent(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("|") && !line.startsWith("```"));
  return stripMarkdown(lines.join(" ")).slice(0, 180) || "아직 요약 가능한 본문이 없습니다.";
}

function extractTitle(content, frontmatter, fallback) {
  if (typeof frontmatter.title === "string" && frontmatter.title.trim()) {
    return frontmatter.title.trim();
  }

  const heading = content.match(/^#\s+(.+)$/m);
  if (heading?.[1]) {
    return heading[1].trim();
  }

  return fallback;
}

function classifyReport(relativePath, frontmatter, content) {
  const subject = `${relativePath} ${frontmatter.type || ""} ${frontmatter.title || ""} ${content.slice(0, 240)}`.toLowerCase();
  const explicitType = typeof frontmatter.type === "string" ? frontmatter.type.toLowerCase().trim() : "";

  if (explicitType === "market" || explicitType === "market-regime") {
    return "market";
  }

  if (explicitType === "pls" || explicitType === "pls-line") {
    return "pls";
  }

  if (explicitType === "theme" || explicitType === "theme-rotation") {
    return "theme";
  }

  if (explicitType === "stock") {
    return "stock";
  }

  if (subject.includes("market-regime") || subject.includes("market regime") || subject.includes("regime")) {
    return "market";
  }

  if (subject.includes("pls-line") || subject.includes("pls line") || subject.includes("pls")) {
    return "pls";
  }

  if (subject.includes("theme-rotation") || subject.includes("theme rotation") || subject.includes("theme")) {
    return "theme";
  }

  if (frontmatter.ticker || subject.includes("investment debate report") || subject.includes("ticker:")) {
    return "stock";
  }

  return "misc";
}

function extractHeadings(content) {
  const seen = new Map();
  return content
    .split("\n")
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const depth = match[1].length;
      const text = match[2].trim();
      const base = slugify(text);
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      return { depth, text, id };
    });
}

function getDateLabel(relativePath, analysisTimestamp, mtimeMs, kind) {
  if (kind === "skill") {
    return null;
  }

  const reportPathMatch = relativePath.match(/^reports\/(\d{4}-\d{2}-\d{2})\//);
  if (reportPathMatch?.[1]) {
    return reportPathMatch[1];
  }

  const sourceValue = analysisTimestamp || mtimeMs;
  if (!sourceValue) {
    return null;
  }

  const parsed = new Date(sourceValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function canDeleteDocument(filePath) {
  const relativeToWorkspace = path.relative(workspaceRoot, filePath);
  if (relativeToWorkspace.startsWith("..") || path.isAbsolute(relativeToWorkspace)) {
    return false;
  }

  return /\.(md|mdx)$/i.test(filePath);
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(rootDir) {
  if (!(await fileExists(rootDir))) {
    return [];
  }

  const items = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
        items.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return items;
}

async function buildDocumentRecord(filePath, kind) {
  const raw = await fs.readFile(filePath, "utf-8");
  const stat = await fs.stat(filePath);
  const parsed = matter(raw);
  const relativePath = path.relative(workspaceRoot, filePath);
  const directoryLabel = path.dirname(relativePath) === "." ? "workspace-root" : path.dirname(relativePath);
  const title = extractTitle(parsed.content, parsed.data, path.basename(filePath, path.extname(filePath)));
  const summary = excerptFromContent(parsed.content);
  const categoryId = kind === "skill" ? "skill-docs" : classifyReport(relativePath, parsed.data, parsed.content);
  const analysisTimestamp =
    typeof parsed.data.analysis_timestamp === "string" ? parsed.data.analysis_timestamp : null;
  const dateLabel = getDateLabel(relativePath, analysisTimestamp, stat.mtimeMs, kind);

  return {
    id: `${kind}:${relativePath}`,
    kind,
    title,
    summary,
    categoryId,
    relativePath,
    absolutePath: filePath,
    directoryLabel,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    analysisTimestamp,
    dateLabel,
    canDelete: canDeleteDocument(filePath)
  };
}

async function scanLibrary() {
  const reportFiles = await collectMarkdownFiles(reportsRoot);
  const reportItems = await Promise.all(reportFiles.map((filePath) => buildDocumentRecord(filePath, "report")));

  const skillItems = [];
  for (const doc of skillDocs) {
    if (await fileExists(doc.filePath)) {
      const item = await buildDocumentRecord(doc.filePath, "skill");
      skillItems.push({
        ...item,
        title: doc.title,
        summary: doc.description
      });
    }
  }

  const allItems = [...reportItems, ...skillItems].sort((left, right) => right.mtimeMs - left.mtimeMs);
  const categories = categoryCatalog.map((category) => {
    const items = allItems.filter((item) => item.categoryId === category.id);
    return {
      ...category,
      count: items.length,
      items
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    stats: {
      totalDocuments: allItems.length,
      reportCount: reportItems.length,
      skillCount: skillItems.length
    },
    categories
  };
}

async function loadDocumentById(id) {
  const library = await scanLibrary();
  const item = library.categories.flatMap((category) => category.items).find((entry) => entry.id === id);

  if (!item) {
    return null;
  }

  const raw = await fs.readFile(item.absolutePath, "utf-8");
  const parsed = matter(raw);

  return {
    item,
    content: parsed.content,
    frontmatter: parsed.data,
    headings: extractHeadings(parsed.content),
    generatedAt: new Date().toISOString()
  };
}

async function findDocumentById(id) {
  const library = await scanLibrary();
  return library.categories.flatMap((category) => category.items).find((entry) => entry.id === id) || null;
}

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, host, port, time: new Date().toISOString() });
});

app.get("/api/library", async (_req, res) => {
  try {
    res.json(await scanLibrary());
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown library scan error"
    });
  }
});

app.get("/api/document", async (req, res) => {
  try {
    const id = String(req.query.id || "");
    if (!id) {
      res.status(400).json({ error: "Missing document id." });
      return;
    }

    const document = await loadDocumentById(id);
    if (!document) {
      res.status(404).json({ error: "Document not found." });
      return;
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown document load error"
    });
  }
});

app.delete("/api/document", async (req, res) => {
  try {
    const id = String(req.query.id || req.body?.id || "");
    if (!id) {
      res.status(400).json({ error: "Missing document id." });
      return;
    }

    const item = await findDocumentById(id);
    if (!item) {
      res.status(404).json({ error: "Document not found." });
      return;
    }

    if (!item.canDelete) {
      res.status(403).json({ error: "This document cannot be deleted from the app." });
      return;
    }

    const relativeToWorkspace = path.relative(workspaceRoot, item.absolutePath);
    if (relativeToWorkspace.startsWith("..") || path.isAbsolute(relativeToWorkspace)) {
      res.status(403).json({ error: "Only workspace markdown files can be deleted." });
      return;
    }

    await fs.unlink(item.absolutePath);

    res.json({
      ok: true,
      deletedId: item.id,
      deletedPath: item.relativePath
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown document delete error"
    });
  }
});

app.use(express.static(distRoot));

app.get("/{*any}", async (_req, res) => {
  const indexPath = path.join(distRoot, "index.html");
  if (!(await fileExists(indexPath))) {
    res.status(503).send("Frontend build was not found. Run `npm run build` first.");
    return;
  }

  res.sendFile(indexPath);
});

app.listen(port, host, () => {
  console.log(`Codex Research Room listening on http://${host}:${port}`);
});
