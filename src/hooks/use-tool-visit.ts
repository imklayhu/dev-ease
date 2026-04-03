"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { appendToolHistory, getToolActivity, recordToolVisit } from "@/lib/db/client";

export function useToolVisit(toolId: string) {
  const t = useTranslations("toolVisit");
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
        label: t("history.openCount", { count: next.count }),
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
  }, [toolId, t]);

  return { visits, lastVisitedAt };
}
