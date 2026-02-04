import type {Metadata} from "next";
import "./globals.css";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  title: "Life Dots - Fahim Reza",
  description: "Track the passage of time with a minimalist life dots view"
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-neutral-100 text-neutral-900 font-satoshi dark:bg-neutral-950 dark:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
