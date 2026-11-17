import { previewSelection } from "./read";
export async function PreviewNotice() {
  if (!(await previewSelection())) return null;
  return (
    <aside
      aria-label="Redaktionsvorschau"
      style={{
        position: "fixed",
        zIndex: 1500,
        bottom: "5rem",
        left: "1rem",
        padding: "8px 12px",
        background: "#181514",
        color: "white",
        fontSize: 14,
      }}
    >
      <form method="post" action="/api/cms/end-preview/">
        <button>Entwurfsvorschau beenden</button>
      </form>
    </aside>
  );
}
