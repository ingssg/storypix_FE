"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Google Analytics 4
export default function useGtag() {
  const pathname = usePathname();
  const location = useSearchParams();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pathname + (location.toString() ? `?${location.toString()}` : ""),
      });
    }
  }, [pathname, location]);
}
