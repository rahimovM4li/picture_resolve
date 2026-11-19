import { customerDemo } from "@/lib/demo";

type Params = { params: Promise<{ id: string; file: string }> };
export async function GET(request: Request, { params }: Params) {
  const { id, file } = await params;
  if (customerDemo) {
    const { demoFile } = await import("@/lib/cms/demo-store");
    return demoFile(
      id,
      file,
      request.headers.get("range"),
      request.method === "HEAD",
    );
  }
  const { currentUser } = await import("@/lib/cms/auth");
  const { mediumResponse } = await import("@/lib/cms/media");
  return mediumResponse(
    id,
    file,
    request.headers.get("range"),
    Boolean(await currentUser()),
    request.method === "HEAD",
  );
}
export const HEAD = GET;
