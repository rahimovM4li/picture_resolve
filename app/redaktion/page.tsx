import { customerDemo } from "@/lib/demo";
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
  const { currentUser } = await import("@/lib/cms/auth");
  const { editorState } = await import("@/lib/cms/dashboard");
  const { eintrag } = await searchParams;
  if (customerDemo) {
    const { inDemo, readDemo, demoUser } = await import("@/lib/cms/demo-store");
    const initial = await inDemo(await readDemo(), () => editorState(demoUser));
    return (
      <div className="cms-studio">
        <Editor demo actor={demoUser} initial={initial} selection={eintrag} />
      </div>
    );
  }
  const user = await currentUser();
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
