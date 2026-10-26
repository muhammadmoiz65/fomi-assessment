import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { appConfig } from "@/config/app.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: appConfig.brand.productName,
  description: `${appConfig.brand.description} ${appConfig.brand.tagline}`,
  applicationName: appConfig.brand.name,
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: appConfig.theme.colors.light },
    { media: "(prefers-color-scheme: dark)", color: appConfig.theme.colors.dark },
  ],
};

/*
 * Inline, blocking theme bootstrap. Runs before first paint so a reload
 * never flashes the wrong theme (persisted choice wins, else system).
 * Storage key comes from the global config.
 */
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("${appConfig.theme.storageKey}");
    var theme = saved || "${appConfig.theme.default}";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "${appConfig.theme.default}");
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
