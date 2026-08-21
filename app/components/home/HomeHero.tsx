"use client";

import EmergencySection from "./EmergencySection";
import ProductOrbit from "./ProductOrbit";

export default function HomeHero({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <>
      <section className="homeHero">
        <div className="homeHeroInner">
          <EmergencySection ka={ka} />
          <ProductOrbit ka={ka} />
        </div>
      </section>

      <style jsx>{`
        .homeHero {
          min-height: 720px;

          color: #ffffff;

          background:
            radial-gradient(
              circle at 79% 48%,
              rgba(255, 255, 255, 0.14),
              transparent 31%
            ),
            linear-gradient(
              135deg,
              #0750ba 0%,
              #1266e9 48%,
              #0748aa 100%
            );
        }

        .homeHeroInner {
          width: calc(100% - 80px);
          max-width: 1280px;

          margin: auto;
          padding: 72px 0 82px;

          display: grid;
          grid-template-columns: 1.03fr 0.97fr;

          gap: 75px;

          align-items: center;
        }

        @media (max-width: 1050px) {
          .homeHeroInner {
            grid-template-columns: 1fr;

            max-width: 760px;

            gap: 60px;
          }
        }

        @media (max-width: 650px) {
          .homeHeroInner {
            width: calc(100% - 28px);

            padding: 52px 0 60px;

            gap: 45px;
          }
        }
      `}</style>
    </>
  );
}
