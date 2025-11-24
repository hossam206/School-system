
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
  const users = [
    { id: "1", name: "John Doe", avatar: "https://github.com/shadcn.png",email: "john.doe@example.com" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  ];

  return (
    <div className="container">
      <h1 className="text-black">{t("hello")}</h1>
    </div>
  );
}
