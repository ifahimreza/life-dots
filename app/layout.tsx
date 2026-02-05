import type {Metadata} from "next";
import "./globals.css";
import Providers from "../components/Providers";
import PwaSetup from "../components/PwaSetup";

export const metadata: Metadata = {
  title: "Life in Dots by Fahim Reza",
  description: "Track the passage of time with a minimalist life dots view",
  keywords: ["life dots", "Fahim Reza"],
  manifest: "/manifest.json"
};

export const viewport = {
  themeColor: "#3a8f7a"
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="app-body font-satoshi">
        <Providers>
          {children}
          <PwaSetup />
        </Providers>
      </body>
    </html>
  );
}
