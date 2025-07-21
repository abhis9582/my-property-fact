import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Onyx",
  description: "Onyx by splendor",
};

export default function RootLayout({ children }) {
  return (
    <div className={`${inter.variable} ${playfair.variable} antialiased`}>
      {children}
    </div>
  );
}
