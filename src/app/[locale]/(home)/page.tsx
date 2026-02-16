import ModalDemo from "@/src/components/ui/Modal/ModalDemo";
import MyLink from "@/src/components/helpers/myLink";
import { Pagination } from "@/src/components/ui/pagination";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const metaData = {
    current_page: 1,
    from: 1,
    to: 10,
    last_page: 474,
    per_page: 10,
    total: 4734,
  };
  return (
    <div className="container">
      <h1 className="text-black">{t("hello")}</h1>
      <MyLink href={"/about"}>to about</MyLink>
      <ModalDemo />
    </div>
  );
}
