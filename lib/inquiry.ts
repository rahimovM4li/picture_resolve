import { inquiryCopy } from "@/content/inquiry";

export interface Inquiry {
  name: string;
  email: string;
  company: string;
  service: string;
  description: string;
  budget: string;
  privacy: boolean;
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export type InquirySubmission =
  | { status: "invalid"; errors: InquiryErrors }
  | { status: "preview"; inquiry: Inquiry };
export type InquiryAdapter = (values: Inquiry) => Promise<InquirySubmission>;

export function validateInquiry(values: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!values.name.trim()) errors.name = "Bitte geben Sie Ihren Namen an.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  if (!inquiryCopy.services.some((option) => option.value === values.service))
    errors.service = "Bitte wählen Sie ein Thema aus.";
  if (!values.description.trim())
    errors.description = "Bitte beschreiben Sie kurz Ihr Vorhaben.";
  if (
    values.budget &&
    !inquiryCopy.budgets.some((option) => option === values.budget)
  )
    errors.budget = "Bitte wählen Sie eine Budgetspanne aus.";
  if (!values.privacy)
    errors.privacy = "Bitte bestätigen Sie die Datenschutzhinweise.";
  return errors;
}

export const submitInquiry: InquiryAdapter = async (values) => {
  const errors = validateInquiry(values);
  if (Object.keys(errors).length) return { status: "invalid", errors };
  return {
    status: "preview",
    inquiry: {
      ...values,
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      description: values.description.trim(),
    },
  };
};

export function readInquiry(form: HTMLFormElement): Inquiry {
  const data = new FormData(form);
  const value = (key: keyof Inquiry) => String(data.get(key) ?? "");
  return {
    name: value("name"),
    email: value("email"),
    company: value("company"),
    service: value("service"),
    description: value("description"),
    budget: value("budget"),
    privacy: data.has("privacy"),
  };
}
