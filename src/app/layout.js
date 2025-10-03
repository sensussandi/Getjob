import "./globals.css";
import Header from "@/components/Header";// pastikan sesuai nama file

export const metadata = {
  title: "GetJob",
  description: "Frontend with Next.js + Tailwind + Flowbite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
