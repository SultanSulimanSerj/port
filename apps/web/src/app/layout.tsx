import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Project Portal",
  description: "Multi-tenant project management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}