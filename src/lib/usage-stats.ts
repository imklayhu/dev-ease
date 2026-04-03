import { toolCategories, tools as toolRegistry, type ToolCategoryId } from "@/data/tools";
import type { ActivityRecord } from "@/lib/db/client";

export type UsageSummary = {
  totalVisits: number;
  toolsWithVisits: number;
  lastActivityAt: string | null;
};

export type ToolUsageRow = {
  toolId: string;
  title: string;
  count: number;
};

export type CategoryUsageRow = {
  categoryId: ToolCategoryId;
  categoryTitle: string;
  count: number;
};

export function computeUsageSummary(rows: ActivityRecord[]): UsageSummary {
  const active = rows.filter((r) => r.count > 0);
  const totalVisits = active.reduce((sum, r) => sum + r.count, 0);
  const lastTimes = active.map((r) => r.lastVisitedAt).filter(Boolean);
  const lastActivityAt =
    lastTimes.length > 0 ? lastTimes.reduce((a, b) => (a > b ? a : b)) : null;

  return {
    totalVisits,
    toolsWithVisits: active.length,
    lastActivityAt,
  };
}

export function computeToolUsageRows(rows: ActivityRecord[]): ToolUsageRow[] {
  const titleById = new Map(toolRegistry.map((t) => [t.id, t.title]));

  return rows
    .filter((r) => r.count > 0)
    .map((r) => ({
      toolId: r.toolId,
      title: titleById.get(r.toolId) ?? r.toolId,
      count: r.count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeCategoryUsageRows(rows: ActivityRecord[]): CategoryUsageRow[] {
  const toolToCategory = new Map(toolRegistry.map((t) => [t.id, t.categoryId]));
  const byCat = new Map<ToolCategoryId, number>();

  for (const cat of toolCategories) {
    byCat.set(cat.id, 0);
  }

  for (const r of rows) {
    if (r.count <= 0) {
      continue;
    }
    const cat = toolToCategory.get(r.toolId);
    if (cat) {
      byCat.set(cat, (byCat.get(cat) ?? 0) + r.count);
    }
  }

  return toolCategories.map((c) => ({
    categoryId: c.id,
    categoryTitle: c.title,
    count: byCat.get(c.id) ?? 0,
  }));
}
