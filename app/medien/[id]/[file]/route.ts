import { currentUser } from "@/lib/cms/auth";
import { mediumResponse } from "@/lib/cms/media";

type Params = { params: Promise<{ id: string; file: string }> };
export async function GET(request: Request, { params }: Params) {
  const { id, file } = await params;
  return mediumResponse(
    id,
    file,
    request.headers.get("range"),
    Boolean(await currentUser()),
    request.method === "HEAD",
  );
}
export const HEAD = GET;
