import { GET_PROJECTS } from "@/src/apis";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations();

  const projects = await GET_PROJECTS();

  console.log(projects, "sasa");
  return (
    <div className="container">
      <h1 className="text-black">{t("hello")}</h1>
    </div>
  );
}
