import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Study Companion - Transform PDFs into Interactive Learning",
  description: "Upload PDFs and get instant video summaries, interactive quizzes, flashcards, and AI chat support",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
