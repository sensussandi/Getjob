import "./globals.css";
import Providers from "./Providers"; // provider client
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "GetJob",
  description: "Frontend with Next.js + Tailwind + Flowbite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Provider client dibungkus di dalam Server layout */}
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
