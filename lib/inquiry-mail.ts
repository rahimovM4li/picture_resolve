import nodemailer from "nodemailer";
import { isMailbox, type Inquiry } from "./inquiry";
import { inquiryCopy } from "@/content/inquiry";

export function createInquiryMailer() {
  const host = process.env.SMTP_HOST;
  const from = process.env.INQUIRY_FROM;
  const to = process.env.INQUIRY_TO;
  const secure = process.env.SMTP_SECURE === "true";
  const port = Number(process.env.SMTP_PORT || (secure ? 465 : 587));
  if (
    !host ||
    !from ||
    !to ||
    !isMailbox(from) ||
    !isMailbox(to) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  )
    throw new Error("SMTP-Konfiguration unvollständig.");
  const local = ["127.0.0.1", "::1", "localhost"].includes(host);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && !local,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  return async (inquiry: Inquiry, id: string) => {
    const service = inquiryCopy.services.find(
      (item) => item.value === inquiry.service,
    )!.label;
    const fields = [
      ["Leistung", service],
      ["Name", inquiry.name],
      ["E-Mail", inquiry.email],
      ["Unternehmen", inquiry.company],
      ["Telefon", inquiry.phone],
      ["Budget", inquiry.budget],
    ];
    const message = await transport.sendMail({
      from,
      to,
      replyTo: { name: inquiry.name, address: inquiry.email },
      messageId: `<${id}@${from.split("@").pop()}>`,
      subject: `Projektanfrage · ${service}`,
      text: [
        ...fields
          .filter(([, value]) => value)
          .map(([label, value]) => label + ": " + value),
        "",
        inquiry.description,
        "",
        "Datenschutzhinweise bestätigt.",
        "Anfragenummer: " + id,
      ].join("\n"),
    });
    return message.accepted.length > 0;
  };
}

/** A disconnect after DATA can hide a successful SMTP handoff. Don't send it a second time. */
export function definitelyRejected(error: unknown) {
  const smtp = error as {
    code?: string;
    originalCode?: string;
    responseCode?: number;
    timeoutType?: string;
  };
  return (
    Number(smtp.responseCode) >= 400 ||
    ["EAUTH", "EENVELOPE", "EDNS", "ETLS"].includes(smtp.code ?? "") ||
    [
      "ECONNREFUSED",
      "ENETUNREACH",
      "EHOSTUNREACH",
      "ENOTFOUND",
      "EAI_AGAIN",
    ].includes(smtp.originalCode ?? smtp.code ?? "") ||
    [
      "CONNECT_TIMEOUT",
      "GREETING_TIMEOUT",
      "UPGRADE_TIMEOUT",
      "DNS_TIMEOUT",
    ].includes(smtp.timeoutType ?? "")
  );
}
