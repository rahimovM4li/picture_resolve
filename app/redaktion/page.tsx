import { currentUser } from "@/lib/cms/auth";
import { editorState } from "@/lib/cms/dashboard";
import { Editor, Login } from "./studio";
import "./studio.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Redaktion · Picture Resolve",
  robots: { index: false, follow: false },
};
export default async function Redaktion({
  searchParams,
}: {
  searchParams: Promise<{ eintrag?: string }>;
}) {
  const user = await currentUser();
  const { eintrag } = await searchParams;
  return (
    <div className="cms-studio">
      {user ? (
        <Editor actor={user} initial={editorState(user)} selection={eintrag} />
      ) : (
        <Login />
      )}
    </div>
  );
}
