import type { Metadata, Viewport } from "next";
import "./product-grid.css";
import AppInstallManager from "@/app/components/app/AppInstallManager";
import PremiumAppShell from "@/app/components/app/PremiumAppShell";

export const metadata: Metadata = {
  title: "KOMPASI | დაცული QR კავშირი",
  description:
    "QR პროფილების, დაკარგული ნივთებისა და უსაფრთხო კავშირის ერთიანი სისტემა.",
  manifest: "/manifest.webmanifest",
  applicationName: "KOMPASI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KOMPASI",
  },
  icons: {
    icon: [
      { url: "/app-icons/app-icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/app-icons/app-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#075ee5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#f8fafc",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        {children}
        <PremiumAppShell />
        <AppInstallManager />
      </body>
    </html>
  );
}
