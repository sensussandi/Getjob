import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/Header";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "GetJob",
  description: "Frontend with Next.js + Tailwind + Flowbite",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
