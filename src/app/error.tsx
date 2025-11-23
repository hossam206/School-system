"use client";
// import ErrorIcon from "@/assets/error-icon.png";
import Image from "next/image";
import Link from "next/link";
// import MyLink from "@/components/shared/myLink";
import { usePathname } from "next/navigation";
export default function Error() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  return (
    <div className="main-container flex flex-col items-center justify-center h-[80vh]!">
      {/* image */}
      {/* <Image src={ErrorIcon} alt="error" width={520} height={180} /> */}

      <h1 className="text-2xl font-bold mt-2">
        {" "}
        {locale === "ar" ? "حدث خطأ ما!" : "Something went wrong"}
      </h1>

      <p className="text-gray-500 mt-2">
        {" "}
        {locale === "ar"
          ? "لم نتمكن من إرسال طلبك, يرجى المحاولة مرة أخرى في وقت لاحق."
          : "We couldn't send your request, please try again later."}
      </p>

      <Link
        href="/"
        style={{
          color: "#fff",
          fontSize: "16px",
          fontWeight: "500",
          textDecoration: "none",
          marginTop: "20px",
          backgroundColor: "#000",
          padding: "10px 24px",
          borderRadius: "24px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        {locale === "ar"
          ? "العوده للصفحه الرئيسية"
          : "Sorry! The page you are looking for was not found"}
      </Link>
    </div>
  );
}
