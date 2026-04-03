"use client";

import { useEffect, useState } from "react";

import { appendToolHistory, getToolActivity, recordToolVisit } from "@/lib/db/client";

export function useToolVisit(toolId: string) {
  const [visits, setVisits] = useState(0);
  const [lastVisitedAt, setLastVisitedAt] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      const previous = await getToolActivity(toolId);
      const next = await recordToolVisit(toolId);

      if (!mounted) {
        return;
      }

      await appendToolHistory({
        toolId,
        label: `第 ${next.count} 次打开此工具`,
      });

      if (!mounted) {
        return;
      }

      setVisits(next.count);
      setLastVisitedAt(previous.lastVisitedAt || next.lastVisitedAt);
    })();

    return () => {
      mounted = false;
    };
  }, [toolId]);

  return { visits, lastVisitedAt };
}
