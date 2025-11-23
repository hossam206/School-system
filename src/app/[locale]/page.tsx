
import { useTranslations } from "next-intl";
 
export default function Home() {
  const t = useTranslations();
  return (
    <div className="container"> 
      <h1 className="bg-primary text-white">{t("hello")}</h1>
    </div>
  );
}
