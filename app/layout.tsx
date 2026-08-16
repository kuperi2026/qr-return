import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Return | Lost & Found",
  description:
    "Smart QR solution for returning lost pets, keys, wallets, bags and luggage.",
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
      </body>
    </html>
  );
}
