import MyLink from "@/src/components/helpers/myLink";
import { Table } from "@/src/components/ui/Table";
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
  // get test data

  const users = [
    { id: 1, name: "Project 1" },
    { id: 2, name: "Project 2" },
    { id: 3, name: "Project 3" },
  ];
  return (
    <div className="container">
      <h1 className="text-black">{t("hello")}</h1>
      <MyLink href={"/test"}>to about</MyLink>
      <div className="max-w-[400px] mx-auto">
        <Table  
        // tableHeaders={users}
        />
      </div>
    </div>
  );
}
