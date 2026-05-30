import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Business Suite | Ultimate Invoice & Inventory Management",
  description: "Generate professional tax invoices, quotations, slip bills, delivery challans, track customer database and stock levels with premium insights.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          document.documentElement.classList.remove('dark');
          try { localStorage.removeItem('theme-dark'); localStorage.removeItem('theme-preset'); } catch(e) {}
        `}} />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
