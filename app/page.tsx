"use client";

import HomeHeader from "@/components/home/HomeHeader";
import HeroSection from "@/components/home/HeroSection";
import ProductOrbit from "@/components/home/ProductOrbit";
import PhonePreview from "@/components/home/PhonePreview";
import VideoSection from "@/components/home/VideoSection";
import StepsSection from "@/components/home/StepsSection";
import StoreSection from "@/components/home/StoreSection";
import MissionSection from "@/components/home/MissionSection";
import FounderSection from "@/components/home/FounderSection";
import TeamSection from "@/components/home/TeamSection";
import RulesSection from "@/components/home/RulesSection";
import FAQSection from "@/components/home/FAQSection";
import HomeFooter from "@/components/home/HomeFooter";

export default function HomePage() {
  return (
    <main>
      <HomeHeader />

      <HeroSection />

      <ProductOrbit />

      <PhonePreview />

      <VideoSection />

      <StepsSection />

      <StoreSection />

      <MissionSection />

      <FounderSection />

      <TeamSection />

      <RulesSection />

      <FAQSection />

      <HomeFooter />
    </main>
  );
}
