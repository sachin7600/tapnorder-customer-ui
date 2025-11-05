"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const outletId = localStorage.getItem("outletId");
    const tableId = localStorage.getItem("tableId");

    if (outletId && tableId) {
      router.replace(`/home/outletId/${outletId}/tableId/${tableId}`);
    }
  }, []);
  return null;
}
