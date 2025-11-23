import { GET_PROJECTS } from "@/src/apis";
import { GenericSelect } from "@/src/components/ui/select";
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
  const users = [
  { id: "1", name: "John Doe", avatar: "https://github.com/shadcn.png" },
  { id: "2", name: "Jane Smith" },
];
  return (
    <div className="container">
      <h1 className="text-black">{t("hello")}</h1>
      <GenericSelect
      items={users}
      valueKey="id"       // Returns the 'id' property
      labelKey="name"     // Displays the 'name' property
      imageKey="avatar"   // Shows image if property exists
      onSelect={(id) => console.log("Selected ID:", id)}
      placeholder="Select User"
    />
    </div>
  );
}
