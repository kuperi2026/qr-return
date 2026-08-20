"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  itemId: string;
  tagCode: string;
};

export default function EmergencyScanTracker({
  itemId,
  tagCode,
}: Props) {
  const tracked = useRef(false);

  useEffect(() => {
    if (
      !itemId ||
      !tagCode ||
      tracked.current
    ) {
      return;
    }

    tracked.current = true;

    void recordScan();
  }, [itemId, tagCode]);

  async function recordScan() {
    try {
      const {
        error,
      } = await supabase.rpc(
        "record_emergency_scan",
        {
          p_item_id: itemId,
          p_tag_code: tagCode,
        }
      );

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
