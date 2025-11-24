import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { createMetadata } from "@/src/utils/generateMetadata";

 

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}
 export const generateMetadata = createMetadata(
   "home.Title",
   "home.Description",
   ["https://example.com/image.jpg"],
   {
     keywords: ["EREP", "Platform", "Next.js"],
     authors: [{ name: "EREP Team" }],
   }
 );
export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
    const { locale } = await params;
    setRequestLocale(locale);


  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <NextIntlClientProvider>
        <body className="antialiased">{children}</body>
      </NextIntlClientProvider>
    </html>
  );
}
