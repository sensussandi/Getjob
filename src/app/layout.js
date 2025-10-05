import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "GetJob",
  description: "Frontend with Next.js + Tailwind + Flowbite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
