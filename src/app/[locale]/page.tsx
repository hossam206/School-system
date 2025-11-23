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
  return (
    <div className="container">
      {/* <p>{locale}</p> */}
      <h1 className="text-black">{t("hello")}</h1>
    </div>
  );
}
