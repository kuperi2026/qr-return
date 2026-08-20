"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  itemId: string;
  currentScanCount?: number | null;
};

export default function EmergencyScanTracker({
  itemId,
  currentScanCount = 0,
}: Props) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!itemId || tracked.current) {
      return;
    }

    tracked.current = true;

    void recordScan();
  }, [itemId]);

  async function recordScan() {
    try {
      const nextCount =
        Number(currentScanCount || 0) + 1;

      const { error } = await supabase
        .from("item")
        .update({
          scan_count: nextCount,
          last_scanned_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .eq("item_type", "emergency");

      if (error) {
        console.error(
          "Emergency scan tracking error:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Emergency scan tracking failed:",
        error
      );
    }
  }

  return null;
}
