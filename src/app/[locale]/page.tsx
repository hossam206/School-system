import { GET_PROJECTS } from "@/src/apis";
import { GenericSelect } from "@/src/components/ui/select";
import { userStore } from "@/src/store/userStore";
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
    const user = userStore((state) => state.user);
    const setUser = userStore((state) => state.setUser);
    const updateUser = userStore((state) => state.updateUser);
    const clearUser = userStore((state) => state.clearUser);
  return (
    <div className="container">
      <h1 className="text-black">{t("hello")}</h1>
      {/* add to the store */}
      <button onClick={() => setUser(users[0])}>Set User</button>
      {/* remove from the store */}
      <button onClick={() => clearUser()}>Clear User</button>
      {/* show the user */}
      <p>{user?.email}</p>


      
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
