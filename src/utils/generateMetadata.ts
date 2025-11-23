import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

// utils/seo/generateMeta.ts
interface TwitterMetadata {
  title?: string;
  description?: string;
  images?: string[];
  type?: string;
  locale?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  card?: string;
}

interface OpenGraphMetadata {
  title?: string;
  description?: string;
  url?: string;
  type?: string;
  images?: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
  image?: string;
  phone?: string;
  siteName?: string;
  email?: string;
  whatsapp?: string;
  locale?: string;
}

interface AlternatesMetadata {
  canonical?: string;
  languages?: Record<string, string>;
}

interface GenerateMetaDataProps {
  lang: string;
  pageName?: string;
  endPoint?: string;
  desc?: string;
  name?: string;
  image?: string;
  twitter?: TwitterMetadata;
  openGraph?: OpenGraphMetadata;
  alternates?: AlternatesMetadata;
}
export const generateMetaData = async ({
  lang,
  pageName,
  endPoint,
  desc,
  name,
  image = "",
  twitter,
  openGraph,
  alternates,
}: GenerateMetaDataProps): Promise<Metadata> => {
  const t = await getTranslations();
  // take translte details
  const titleKey = `${pageName}.meta.title`;
  const descKey = `${pageName}.meta.description`;

  const title = name ? `${name}` : t(titleKey);
  const description = desc ? `${desc}` : t(descKey);

  const metadataBase = new URL(
    process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:3000"
  );

  return {
    title,
    description,
    metadataBase,
    openGraph: {
      title,
      url: `${process.env.NEXT_PUBLIC_LIVE_URL}${endPoint}`,
      type: "website",
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...openGraph,
    },
    twitter: {
      title,
      description,
      images: [image],
      ...twitter,
    },
    alternates,
  };
};



// usage
//   generateMetaData({
//     lang: locale,
//     pageName: "developers",
//     endPoint: "/developers",
//     desc: t("meta_data.discover_page_desc"),
//     name: t("meta_data.discover_page_name"),
//     image: "/svgs/logo.webp",
//   });
