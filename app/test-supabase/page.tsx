"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TestSupabasePage() {
  const [status, setStatus] = useState("Checking Supabase...");

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase
        .from("item")
        .select("id")
        .limit(1);

      if (error) {
        console.error(error);
        setStatus(`ERROR: ${error.message}`);
        return;
      }

      console.log("Supabase connection successful:", data);
      setStatus("SUPABASE CONNECTED ✓");
    }

    checkConnection();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#071b3d",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1 style={{ marginBottom: "15px" }}>
          QR RETURN
        </h1>

        <p
          style={{
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          {status}
        </p>
      </div>
    </main>
  );
}
