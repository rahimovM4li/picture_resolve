import { currentUser } from "@/lib/cms/auth";
import { editorState } from "@/lib/cms/dashboard";
import { Editor, Login } from "./studio";
import "./studio.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Redaktion · Picture Resolve",
  robots: { index: false, follow: false },
};
export default async function Redaktion() {
  const user = await currentUser();
  return (
    <div className="cms-studio">
      {user ? <Editor actor={user} initial={editorState(user)} /> : <Login />}
    </div>
  );
}
