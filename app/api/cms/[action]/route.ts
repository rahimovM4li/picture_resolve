import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { currentUser, login, logout, manageAccount } from "@/lib/cms/auth";
import { editorState } from "@/lib/cms/dashboard";
import { deleteMedium, maxUpload, storeMedium } from "@/lib/cms/media";
import { mutate, checkPreview } from "@/lib/cms/model";
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
    if (action === "login") {
      const body = await formJson(req);
      await login(String(body.name ?? ""), String(body.password ?? ""), secure);
      return json({ ok: true });
    }
    const actor = await currentUser();
    if (!actor) throw new CmsError("Bitte erneut anmelden.", 401);
    if (action === "logout") {
      await logout();
      return json({ ok: true });
    }
    if (action === "end-preview") {
      (await cookies()).delete("pr_cms_preview");
      return new Response(null, {
        status: 303,
        headers: { Location: "/redaktion/", "Cache-Control": "no-store" },
      });
    }
    if (action === "upload") {
      const body = await limitedBody(req, maxUpload + 16384);
      // Multipart boundaries are case-sensitive; Blob.type lowercases parameters.
      const form = await new Response(body, {
        headers: { "Content-Type": req.headers.get("content-type") ?? "" },
      }).formData();
      const file = form.get("file");
      if (!(file instanceof File)) throw new CmsError("Datei fehlt.");
      await storeMedium(
        file,
        String(form.get("alt") || ""),
        String(form.get("rights") || ""),
        Number(form.get("focusX") ?? 50),
        Number(form.get("focusY") ?? 50),
      );
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
