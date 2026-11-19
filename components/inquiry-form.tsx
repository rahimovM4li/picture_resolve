"use client";

import Link from "@/components/site-link";
import { Arrow } from "@/components/ui";
import { CtaLabel } from "./cta-label";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { inquiryCopy } from "@/content/inquiry";
import {
  readInquiry,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
  type InquiryResponse,
} from "@/lib/inquiry";

const subscribe = () => () => {};
const inBrowser = () => true;
const onServer = () => false;

const serviceLabels: Record<string, string> = {
  imagefilme: "Imagefilm",
  recruitingfilme: "Recruitingfilm",
  beratung: "Beratung",
};
const services = inquiryCopy.services.map(({ label, value }) => ({
  label: serviceLabels[value] ?? label,
  value,
}));
const budgets = inquiryCopy.budgets.map((value) => ({ label: value, value }));

function Choices({
  name,
  legend,
  options,
  initial,
  error,
}: {
  name: "service" | "budget";
  legend: string;
  options: readonly { label: string; value: string }[];
  initial: string;
  error?: string;
}) {
  return (
    <fieldset
      className="inquiry-choices"
      aria-describedby={error ? name + "-error" : undefined}
    >
      <legend className="inquiry-caption">{legend}</legend>
      <div className="inquiry-options">
        {options.map(({ label, value }) => (
          <label
            key={value}
            className={value === "" ? "inquiry-undecided" : undefined}
          >
            <input
              type="radio"
              name={name}
              value={value}
              required={name === "service"}
              defaultChecked={initial === value}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={name + "-error"} className="inquiry-field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function ServiceChoices({
  initial = "imagefilme",
  error,
}: {
  initial?: string;
  error?: string;
}) {
  return (
    <Choices
      name="service"
      legend="Was planen Sie?"
      options={services}
      initial={initial}
      error={error}
    />
  );
}

function PrefilledServiceChoices({ error }: { error?: string }) {
  const value = useSearchParams().get("leistung");
  const initial = services.find((option) => option.value === value)?.value;
  return <ServiceChoices key={initial} initial={initial} error={error} />;
}
function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="inquiry-field">
      <label className="inquiry-sr" htmlFor={name}>
        {label}
      </label>
      {children}
      {error && (
        <p id={name + "-error"} className="inquiry-field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function InquiryForm({
  demo = false,
  submitLabel,
  privacyText,
}: {
  submitLabel: string;
  demo?: boolean;
  privacyText: string;
}) {
  const ready = useSyncExternalStore(subscribe, inBrowser, onServer);
  const formRef = useRef<HTMLFormElement>(null);

  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const requestId = useRef<string | undefined>(undefined);
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [problem, setProblem] = useState("");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (accepted) confirmationRef.current?.focus();
  }, [accepted]);

  const control = (name: keyof Inquiry, required = true) => ({
    id: name,
    name,
    required,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? name + "-error" : undefined,
  });

  function applyErrors(found: InquiryErrors) {
    setErrors(found);
    const first = Object.keys(found)[0];
    requestAnimationFrame(() =>
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const values = readInquiry(event.currentTarget);
    const found = validateInquiry(values);
    setProblem("");
    if (Object.keys(found).length) {
      applyErrors(found);
      return;
    }
    busy.current = true;
    setPending(true);
    setErrors({});
    try {
      requestId.current ??= crypto.randomUUID();
      const website =
        formRef.current?.querySelector<HTMLInputElement>('[name="website"]')
          ?.value ?? "";
      const response = await fetch("/api/inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: requestId.current, website }),
      });
      const result = (await response.json()) as InquiryResponse;
      if (result.status === "invalid") applyErrors(result.errors);
      else if (result.status === (demo ? "demo" : "accepted") && response.ok) setAccepted(true);
      else if ("message" in result) setProblem(result.message);
      else throw new Error();
    } catch {
      setProblem(
        "Der Versandstatus konnte nicht abgerufen werden. Ihre Angaben sind erhalten. Prüfen Sie die Verbindung und versuchen Sie es erneut.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  function handleCorrection(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const key = target.getAttribute("name") as keyof Inquiry | null;
    if (
      key &&
      errors[key] &&
      !validateInquiry(readInquiry(event.currentTarget))[key]
    ) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  return (
    <>
      <form
        ref={formRef}
        className="inquiry-form"
        hidden={accepted}
        onSubmit={handleSubmit}
        onChange={handleCorrection}
        noValidate
        aria-label="Projektanfrage"
        aria-busy={pending}
      >
        <fieldset className="inquiry-fields" disabled={!ready || pending}>
          <legend className="inquiry-sr">Angaben zur Projektanfrage</legend>
          <label className="inquiry-sr" aria-hidden="true">
            Diese Zeile freilassen
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <Suspense fallback={<ServiceChoices error={errors.service} />}>
            <PrefilledServiceChoices error={errors.service} />
          </Suspense>
          <div className="inquiry-grid">
            <Field name="name" label="Name" error={errors.name}>
              <input
                {...control("name")}
                autoComplete="name"
                placeholder="Ihr Name"
                maxLength={150}
              />
            </Field>
            <Field
              name="company"
              label="Unternehmen (optional)"
              error={errors.company}
            >
              <input
                {...control("company", false)}
                autoComplete="organization"
                placeholder="Unternehmen"
                maxLength={200}
              />
            </Field>
            <Field name="email" label="E-Mail" error={errors.email}>
              <input
                {...control("email")}
                type="email"
                autoComplete="email"
                placeholder="E-Mail"
                maxLength={254}
              />
            </Field>
            <Field name="phone" label="Telefon (optional)" error={errors.phone}>
              <input
                {...control("phone", false)}
                type="tel"
                autoComplete="tel"
                placeholder="Telefon (optional)"
                maxLength={60}
              />
            </Field>
          </div>
          <Choices
            name="budget"
            legend="Budgetrahmen"
            options={[...budgets, { label: "Noch offen", value: "" }]}
            initial=""
            error={errors.budget}
          />
          <Field
            name="description"
            label="Projektbeschreibung"
            error={errors.description}
          >
            <textarea
              {...control("description")}
              rows={4}
              maxLength={5000}
              placeholder="Worum geht es in Ihrem Film?"
            />
          </Field>
          <div className="inquiry-before-submit">
            <div className="inquiry-privacy">
              <input {...control("privacy")} type="checkbox" />
              <label htmlFor="privacy">
                {privacyText}{" "}
                <Link
                  href="/datenschutz/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzhinweise
                  <span className="inquiry-sr">
                    {" "}
                    (öffnet in einem neuen Tab)
                  </span>
                </Link>
              </label>
            </div>
            {errors.privacy && (
              <p id="privacy-error" className="inquiry-field-error">
                {errors.privacy}
              </p>
            )}
            <div aria-live="polite" className="inquiry-feedback">
              {pending && (demo ? "Ihre Testanfrage wird geprüft …" : "Ihre Anfrage wird gesendet …")}
              {problem}
            </div>
            {demo && <p>Testformular der Kundenvorschau. Bitte verwenden Sie Beispieldaten. Es wird keine E-Mail verschickt.</p>}
            <button className="inquiry-submit" type="submit" data-cta>
              <CtaLabel>{pending ? (demo ? "Wird geprüft …" : "Wird gesendet …") : (demo ? "Testanfrage prüfen" : submitLabel)}</CtaLabel> <Arrow diagonal />
            </button>
          </div>
        </fieldset>
      </form>
      {accepted && (
        <section className="inquiry-preview" aria-labelledby="inquiry-sent">
          <span className="inquiry-check" aria-hidden="true">
            ✓
          </span>
          <h2 ref={confirmationRef} id="inquiry-sent" tabIndex={-1}>
            {demo ? "Ihre Testanfrage wurde geprüft." : "Ihre Anfrage wurde gesendet."}
          </h2>
          <p>
            {demo ? "Der Formularablauf ist abgeschlossen. In der Kundenvorschau erfolgt kein Versand." : "Vielen Dank für Ihr Filmbriefing. Das Studio antwortet Ihnen über die angegebene E-Mail-Adresse."}
          </p>
        </section>
      )}
    </>
  );
}
