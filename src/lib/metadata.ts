import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  name: string;
  description: string;
  locale: string;
  images?: string[];
} & Metadata;

export async function genMetadata({
  name,
  description,
  locale,
  images,
  ...props
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t(name);      
  const desc = t(description);

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: images ? images.map((image) => ({ url: image })) : undefined,
      locale,
      ...props.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: images ? images.map((image) => ({ url: image })) : undefined,
      ...props.twitter,
    },
    ...props,
  };
}
