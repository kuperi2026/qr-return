import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KOMPASI — დაცული QR კავშირი",
    short_name: "KOMPASI",
    description: "მართეთ QR პროფილები, სკანირებები, Lost Mode და უსაფრთხო კავშირი ერთ სივრცეში.",
    start_url: "/app?source=installed",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#063b72",
    theme_color: "#075ee5",
    lang: "ka",
    categories: ["utilities", "lifestyle", "security"],
    shortcuts: [
      { name: "ჩემი პროფილები", short_name: "პროფილები", url: "/my-profiles", icons: [{ src: "/app-icons/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
      { name: "ახალი QR პროფილი", short_name: "დამატება", url: "/register", icons: [{ src: "/app-icons/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
      { name: "Live Chat", short_name: "ჩათი", url: "/account/chat", icons: [{ src: "/app-icons/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
    ],
    icons: [
      { src: "/app-icons/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/app-icons/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
