import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trendy Tech IG Agent",
  description: "Generate Instagram posts from trending tech topics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container py-8">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Trendy Tech IG Agent
            </h1>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              <span>Star</span>
            </a>
          </header>
          {children}
          <footer className="mt-16 text-center text-sm text-white/60">
            Built for creators. No external API keys required.
          </footer>
        </div>
      </body>
    </html>
  );
}
