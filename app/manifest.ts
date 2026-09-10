import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KOMPASI — დაცული QR კავშირი",
    short_name: "KOMPASI",
    description: "მართეთ QR პროფილები, სკანირებები, Lost Mode და უსაფრთხო კავშირი ერთ სივრცეში.",
    start_url: "/my-profiles?source=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#063b72",
    theme_color: "#075ee5",
    lang: "ka",
    categories: ["utilities", "lifestyle", "security"],
    icons: [
      { src: "/app-icons/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/app-icons/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
