
import { useTranslations } from "next-intl";
 
export default function Home() {
  const t = useTranslations();
  return (
    <div className="container">
      <h1>{t("hello")}</h1>
    </div>
  );
}
