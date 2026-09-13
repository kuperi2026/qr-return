"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppHome() {
  const router = useRouter();

  useEffect(() => {
    window.localStorage.setItem("kompasi-app-mode", "1");
    router.replace("/app/products");
  }, [router]);

  return <main style={{ minHeight: "100vh", background: "#0a4c8a" }} />;
}
