import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { customerDemo } from "@/lib/demo";
import {
  CmsError,
  collections,
  type Collection,
  type Fields,
  previewPath,
} from "@/lib/cms/types";

export const runtime = "nodejs";
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
async function limitedBody(req: Request, limit: number) {
  if (Number(req.headers.get("content-length")) > limit)
    throw new CmsError("Datei oder Inhalt ist zu groß.", 413);
  const reader = req.body?.getReader();
  const parts: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  if (reader)
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new CmsError("Datei oder Inhalt ist zu groß.", 413);
      }
      parts.push(new Uint8Array(value));
    }
  return new Blob(parts, {
    type: req.headers.get("content-type") || "application/json",
  });
}
async function formJson(req: Request) {
  try {
    const data = JSON.parse(await (await limitedBody(req, 256 * 1024)).text());
    if (!data || typeof data !== "object" || Array.isArray(data)) throw Error();
    return data;
  } catch (e) {
    if (e instanceof CmsError) throw e;
    throw new CmsError("Formulardaten sind ungültig.", 400);
  }
}
export async function POST(
  req: Request,
  ctx: { params: Promise<{ action: string }> },
) {
  try {
    const origin = req.headers.get("origin");
    if (!origin || new URL(origin).host !== req.headers.get("host"))
      throw new CmsError("Die Anfrage stammt nicht von dieser Website.", 403);
    const secure =
      new URL(origin).protocol === "https:" || process.env.CMS_HTTPS === "1";
    const { action } = await ctx.params;
    if (customerDemo) {
      const { demoUser, demoCookie, inDemo, readDemo, saveDemo } =
        await import("@/lib/cms/demo-store");
      const jar = await cookies();
      if (action === "logout") {
        jar.delete(demoCookie);
        jar.delete("pr_cms_preview");
        return json({ ok: true });
      }
      if (action === "login" || action === "account")
        throw new CmsError("Zugänge verwaltet das Studio.", 403);
      const state = await readDemo();
      if (!state && jar.has(demoCookie))
        throw new CmsError(
          "Der Teststand ist abgelaufen. Bitte die Demo in der Redaktion neu starten.",
          410,
        );
      return await inDemo(state, async () => {
        const response = await edit(req, action, secure, demoUser);
        if (response.ok && action !== "preview") await saveDemo(state, secure);
        return response;
      });
    }
    const { currentUser, login } = await import("@/lib/cms/auth");
    if (action === "login") {
      const body = await formJson(req);
      await login(String(body.name ?? ""), String(body.password ?? ""), secure);
      return json({ ok: true });
    }
    const actor = await currentUser();
    if (!actor) throw new CmsError("Bitte erneut anmelden.", 401);
    return await edit(req, action, secure, actor);
  } catch (error) {
    if (error instanceof CmsError)
      return json({ error: error.message }, error.status);
    console.error(
      "CMS-Anfrage fehlgeschlagen",
      error instanceof Error ? error.name : "Unbekannter Fehler",
    );
    return json(
      {
        error:
          "Der Vorgang konnte nicht abgeschlossen werden. Bitte erneut versuchen.",
      },
      500,
    );
  }
}
async function edit(
  req: Request,
  action: string,
  secure: boolean,
  actor: import("@/lib/cms/types").User,
) {
  const { logout, manageAccount } = await import("@/lib/cms/auth");
  const { editorState } = await import("@/lib/cms/dashboard");
  const { deleteMedium, maxUpload, storeMedium } =
    await import("@/lib/cms/media");
  const { mutate, checkPreview } = await import("@/lib/cms/model");
  if (action === "logout") {
    await logout();
    return json({ ok: true });
  }
  if (action === "end-preview") {
    const jar = await cookies();
    const selected = jar.get("pr_cms_preview")?.value;
    jar.delete("pr_cms_preview");
    return new Response(null, {
      status: 303,
      headers: {
        Location: selected
          ? "/redaktion/?eintrag=" + encodeURIComponent(selected)
          : "/redaktion/",
        "Cache-Control": "no-store",
      },
    });
  }
  if (action === "upload") {
    const limit = customerDemo ? 4 * 1024 * 1024 : maxUpload;
    const body = await limitedBody(req, limit + 16384);
    // Multipart boundaries are case-sensitive; Blob.type lowercases parameters.
    const form = await new Response(body, {
      headers: { "Content-Type": req.headers.get("content-type") ?? "" },
    }).formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new CmsError("Datei fehlt.");
    if (file.size > limit)
      throw new CmsError("Die Datei ist für diesen Upload zu groß.", 413);
    const medium = await storeMedium(
      file,
      String(form.get("alt") || ""),
      String(form.get("rights") || ""),
      Number(form.get("focusX") ?? 50),
      Number(form.get("focusY") ?? 50),
    );
    return json({ state: editorState(actor), medium });
  } else {
    const body = await formJson(req);
    if (action === "account") {
      manageAccount(
        actor,
        String(body.name),
        String(body.role),
        String(body.password ?? ""),
        String(body.operation),
      );
    } else if (action === "delete-medium") {
      deleteMedium(String(body.id));
    } else {
      const collection = body.collection as Collection;
      if (!collections.includes(collection))
        throw new CmsError("Inhaltsbereich unbekannt.");
      const id = action === "create" ? randomUUID() : String(body.id);
      if (action === "preview") {
        const doc = checkPreview(collection, id);
        const path = previewPath(collection, id, doc.data);
        if (!path)
          throw new CmsError("Für die Vorschau fehlt ein gültiger URL-Name.");
        (await cookies()).set("pr_cms_preview", collection + "/" + id, {
          path: "/",
          httpOnly: true,
          secure,
          sameSite: "strict",
          maxAge: 3600,
        });
        return json({ path });
      }
      if (!["save", "publish", "create", "delete"].includes(action))
        throw new CmsError("Aktion unbekannt.", 404);
      mutate(
        action as "save" | "publish" | "create" | "delete",
        collection,
        id,
        Number(body.revision),
        body.data as Fields,
      );
      return json({ state: editorState(actor), id });
    }
  }
  return json({ state: editorState(actor) });
}
