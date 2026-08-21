"use client";

import EmergencySection from "./EmergencySection";
import ProductOrbit from "./ProductOrbit";

export default function HomeHero({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <section
      style={{
        minHeight: "720px",
        color: "#ffffff",
        background:
          "radial-gradient(circle at 79% 48%, rgba(255,255,255,.14), transparent 31%), linear-gradient(135deg, #0750ba 0%, #1266e9 48%, #0748aa 100%)",
      }}
    >
      <div
        style={{
          width: "calc(100% - 80px)",
          maxWidth: "1280px",
          margin: "auto",
          padding: "72px 0 82px",
          display: "grid",
          gridTemplateColumns: "1.03fr .97fr",
          gap: "75px",
          alignItems: "center",
        }}
      >
        <EmergencySection ka={ka} />

        <ProductOrbit ka={ka} />
      </div>
    </section>
  );
}
