import MyLink from "@/src/components/helpers/myLink";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HomeTable from "./HomeTable";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  const t = await getTranslations();

  const data = [
    { id: 1, name: "Project 1" },
    { id: 2, name: "Project 2" },
    { id: 3, name: "Project 3" },
  ];

  return (
    <div className="container">
      <h1 className="text-black">{t("hello")}</h1>
      <MyLink href={"/test"}>to about</MyLink>
      <div className="max-w-[400px] mx-auto">
        <HomeTable data={data} />
      </div>
    </div>
  );
}
