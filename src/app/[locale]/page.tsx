import { GET_PROJECTS } from "@/src/apis";
import MyLink from "@/src/components/helpers/myLink";
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
      <MyLink href={"/test"}>to about</MyLink>
      {/* <GenericSelect
        items={users}
        valueKey="id" // Returns the 'id' property
        labelKey="name" // Displays the 'name' property
        imageKey="avatar" // Shows image if property exists
        onSelect={(id) => console.log("Selected ID:", id)}
        placeholder="Select User"
      /> */}
    </div>
  );
}
