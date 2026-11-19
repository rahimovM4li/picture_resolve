import { inquiryCopy } from "@/content/inquiry";

export function isMailbox(value: string) {
  const parts = value.split("@");
  if (parts.length !== 2 || parts[0].length > 64 || value.length > 254)
    return false;
  return (
    /^[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+(?:\.[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+)*$/u.test(
      parts[0],
    ) &&
    parts[1].includes(".") &&
    parts[1]
      .split(".")
      .every((label) =>
        /^[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?$/u.test(label),
      )
  );
}

export interface Inquiry {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  description: string;
  budget: string;
  privacy: boolean;
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export type InquiryResponse =
  | { status: "invalid"; errors: InquiryErrors }
  | { status: "accepted" | "demo" }
  | { status: "pending" | "failed"; message: string };

export function parseInquiry(data: Record<string, unknown>): Inquiry {
  const field = (key: string) =>
    typeof data[key] === "string" ? data[key].trim() : "";
  return {
    name: field("name"),
    email: field("email"),
    company: field("company"),
    phone: field("phone"),
    service: field("service"),
    description: field("description"),
    budget: field("budget"),
    privacy: data.privacy === true,
  };
}

export function validateInquiry(values: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!values.name || values.name.length > 150 || /[\r\n]/.test(values.name))
    errors.name = "Bitte geben Sie Ihren Namen an (maximal 150 Zeichen).";
  // A single mailbox also keeps lists or display names out of Reply-To.
  if (!isMailbox(values.email))
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  if (values.company.length > 200 || /[\r\n]/.test(values.company))
    errors.company = "Bitte kürzen Sie den Unternehmensnamen auf 200 Zeichen.";
  if (values.phone && !/^[\d\s+()./-]{3,60}$/.test(values.phone))
    errors.phone = "Bitte prüfen Sie die Telefonnummer.";
  if (!inquiryCopy.services.some((option) => option.value === values.service))
    errors.service = "Bitte wählen Sie eine Leistung aus.";
  if (!values.description || values.description.length > 5000)
    errors.description =
      "Bitte beschreiben Sie Ihr Vorhaben in maximal 5.000 Zeichen.";
  if (values.budget && !inquiryCopy.budgets.includes(values.budget))
    errors.budget = "Bitte wählen Sie eine der Budgetspannen aus.";
  if (!values.privacy)
    errors.privacy = "Bitte bestätigen Sie die Datenschutzhinweise.";
  return errors;
}

export function readInquiry(form: HTMLFormElement): Inquiry {
  const fields = new FormData(form);
  return parseInquiry({
    ...Object.fromEntries(fields),
    privacy: fields.has("privacy"),
  });
}
