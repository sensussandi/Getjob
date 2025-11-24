import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/Header";

export const metadata = {
  title: "GetJob",
  description: "Frontend with Next.js + Tailwind + Flowbite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}