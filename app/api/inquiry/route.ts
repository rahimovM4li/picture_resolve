import { isIP } from "node:net";
import {
  parseInquiry,
  validateInquiry,
  type InquiryResponse,
} from "@/lib/inquiry";
import { reserveDelivery, finishDelivery } from "@/lib/inquiry-ledger";
import { createInquiryMailer, definitelyRejected } from "@/lib/inquiry-mail";

export const runtime = "nodejs";

const failed =
  "Ihre Anfrage konnte nicht gesendet werden. Ihre Angaben sind erhalten. Bitte versuchen Sie es erneut.";
const uncertain =
  "Die Übergabe ist noch nicht bestätigt. Bitte kontaktieren Sie das Studio mit Ihrer Anfragenummer";
const limit = 40_000;

function reply(body: InquiryResponse, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function payload(request: Request): Promise<Record<string, unknown>> {
  const reader = request.body?.getReader();
  if (!reader || Number(request.headers.get("content-length")) > limit)
    throw new Error();
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) {
      await reader.cancel();
      throw new Error();
    }
    chunks.push(value);
  }
  const input: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error();
  return input as Record<string, unknown>;
}

export async function POST(request: Request) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return reply(
      { status: "failed", message: "Das Formularformat ist ungültig." },
      415,
    );
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return reply(
      {
        status: "failed",
        message: "Bitte nutzen Sie das Formular auf unserer Website.",
      },
      403,
    );
  const input = await payload(request).catch(() => null);
  if (
    !input ||
    typeof input.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      input.id,
    ) ||
    input.website !== ""
  )
    return reply(
      {
        status: "failed",
        message: "Die Anfrage wurde abgewiesen. Bitte prüfen Sie das Formular.",
      },
      400,
    );
  const values = parseInquiry(input);
  const errors = validateInquiry(values);
  if (Object.keys(errors).length)
    return reply({ status: "invalid", errors }, 422);

  // Only use client IP from a header overwritten by the operator's trusted reverse proxy.
  const clientHeader = process.env.INQUIRY_CLIENT_IP_HEADER;
  const address = clientHeader ? request.headers.get(clientHeader) : null;
  try {
    const reserved = reserveDelivery(
      input.id,
      JSON.stringify(values),
      values.email,
      address && isIP(address) ? address : null,
    );
    if (reserved === "limited")
      return reply(
        {
          status: "failed",
          message: "Zu viele Anfragen. Versuchen Sie es in 15 Minuten erneut.",
        },
        429,
      );
    if (reserved === "accepted") return reply({ status: "accepted" });
    if (reserved === "conflict")
      return reply(
        {
          status: "failed",
          message:
            "Diese Anfragenummer gehört bereits zu anderen Angaben. Bitte prüfen Sie den bisherigen Versand.",
        },
        409,
      );
    if (reserved === "busy")
      return reply(
        {
          status: "pending",
          message:
            "Die Übergabe läuft. Bitte prüfen Sie den Status in einem Moment erneut.",
        },
        202,
      );
    if (reserved === "uncertain")
      return reply(
        { status: "pending", message: uncertain + " " + input.id + "." },
        409,
      );
    let send;
    try {
      send = createInquiryMailer();
    } catch {
      finishDelivery(input.id, "failed");
      return reply({ status: "failed", message: failed }, 503);
    }
    let accepted: boolean;
    try {
      accepted = await send(values, input.id);
    } catch (error) {
      const rejected = definitelyRejected(error);
      finishDelivery(input.id, rejected ? "failed" : "uncertain");
      return rejected
        ? reply({ status: "failed", message: failed }, 503)
        : reply(
            { status: "pending", message: uncertain + " " + input.id + "." },
            503,
          );
    }
    finishDelivery(input.id, accepted ? "accepted" : "failed");
    return accepted
      ? reply({ status: "accepted" })
      : reply({ status: "failed", message: failed }, 503);
  } catch {
    return reply({ status: "failed", message: failed }, 503);
  }
}
