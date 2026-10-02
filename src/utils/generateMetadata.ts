import { genMetadata } from "@/src/lib/metadata";
import type { Metadata } from "next";

export function createMetadata(
  name: string,
  description: string,
  images?: string[],
  extra?: Omit<Metadata, "title" | "description" | "openGraph" | "twitter">,
) {
  return async function ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    return genMetadata({
      name,
      description,
      locale,
      images,
      ...extra,
    });
  };
}
