import { CronExpressionParser } from "cron-parser";

export type CronNextRunsResult =
  | { ok: true; dates: Date[] }
  | { ok: false; message: string };

/**
 * 计算自当前时刻起接下来的若干次触发时间（按指定时区解释 cron）。
 */
export function getNextCronRuns(expression: string, count: number, timeZone: string): CronNextRunsResult {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { ok: false, message: "empty" };
  }
  if (count < 1 || count > 50) {
    return { ok: false, message: "badCount" };
  }
  try {
    const expr = CronExpressionParser.parse(trimmed, {
      tz: timeZone,
      currentDate: new Date(),
    });
    const taken = expr.take(count);
    return { ok: true, dates: taken.map((d) => d.toDate()) };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
