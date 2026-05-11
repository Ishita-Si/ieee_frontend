import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import SmoothScrollInit from "@/components/providers/SmoothScrollInit";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "IEEE Student Branch RGIPT",
    template: "%s | IEEE RGIPT",
  },
  description: "Official Website of IEEE Student Branch RGIPT. Discover our events, hackathons like KodeKurrent, workshops, and join our tech community.",
  keywords: ["IEEE", "RGIPT", "Student Branch", "KodeKurrent", "Hackathon", "Engineering", "Technology", "Events", "India", "College Hackathon"],
  authors: [{ name: "IEEE RGIPT Web Team" }],
  creator: "IEEE Student Branch RGIPT",
  publisher: "IEEE Student Branch RGIPT",
  metadataBase: new URL("https://ieeergipt.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ieeergipt.in",
    siteName: "IEEE SB RGIPT",
    title: "IEEE Student Branch RGIPT",
    description: "Official Website of IEEE Student Branch RGIPT. Discover out events, hackathons, and tech community at Rajiv Gandhi Institute of Petroleum Technology.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "IEEE RGIPT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE SB RGIPT",
    description: "Official Website of IEEE Student Branch RGIPT. Discover our events and hackathons.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
				<SessionProvider>
					<SmoothScrollInit />
					{children}
				</SessionProvider>
				<Analytics />
      </body>
    </html>
  );
}
