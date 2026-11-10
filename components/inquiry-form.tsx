"use client";

import Link from "@/components/site-link";
import { Arrow } from "@/components/ui";
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
  submitInquiry,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
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

export function InquiryForm() {
  const ready = useSyncExternalStore(subscribe, inBrowser, onServer);
  const formRef = useRef<HTMLFormElement>(null);

  const previewRef = useRef<HTMLHeadingElement>(null);
  const editingRef = useRef(false);
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [problem, setProblem] = useState("");
  const [preview, setPreview] = useState<Inquiry | null>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (preview) previewRef.current?.focus();
    else if (editingRef.current) {
      formRef.current?.querySelector<HTMLInputElement>("#name")?.focus();
      editingRef.current = false;
    }
  }, [preview]);

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
      const result = await submitInquiry(values);
      if (result.status === "invalid") applyErrors(result.errors);
      else setPreview(result.inquiry);
    } catch {
      setProblem(
        "Die Vorschau konnte nicht erstellt werden. Ihre Angaben sind erhalten. Versuchen Sie es erneut oder kontaktieren Sie uns direkt per E-Mail.",
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

  const serviceLabel = inquiryCopy.services.find(
    (option) => option.value === preview?.service,
  )?.label;
  return (
    <>
      <form
        ref={formRef}
        className="inquiry-form"
        hidden={Boolean(preview)}
        onSubmit={handleSubmit}
        onChange={handleCorrection}
        noValidate
        aria-label="Projektanfrage vorbereiten"
      >
        <fieldset className="inquiry-fields" disabled={!ready || pending}>
          <legend className="inquiry-sr">Angaben zur Projektanfrage</legend>
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
            <Field name="company" label="Unternehmen (optional)">
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
            <Field name="phone" label="Telefon (optional)">
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Telefon (optional)"
                maxLength={60}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
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
                Ich habe die{" "}
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
                </Link>{" "}
                gelesen.
              </label>
            </div>
            {errors.privacy && (
              <p id="privacy-error" className="inquiry-field-error">
                {errors.privacy}
              </p>
            )}
            <div aria-live="polite" className="inquiry-feedback">
              {pending && "Vorschau wird vorbereitet …"}
              {problem}
            </div>
            <button className="inquiry-submit" type="submit">
              {pending ? "Wird vorbereitet …" : "Anfrage als Vorschau öffnen"}{" "}
              <Arrow diagonal />
            </button>
            <p className="inquiry-demo">{inquiryCopy.demo}</p>
          </div>
        </fieldset>
      </form>
      {preview && (
        <div className="inquiry-preview">
          <span className="inquiry-check" aria-hidden="true">
            ✓
          </span>
          <h2 ref={previewRef} tabIndex={-1}>
            Ihre Anfrage im Überblick
          </h2>
          <p>
            Dies ist eine lokale Vorschau. Es wurde keine Anfrage versendet.
          </p>
          <dl>
            <dt>Name</dt>
            <dd>{preview.name}</dd>
            <dt>E-Mail</dt>
            <dd>{preview.email}</dd>
            {preview.company && (
              <>
                <dt>Unternehmen</dt>
                <dd>{preview.company}</dd>
              </>
            )}
            {phone.trim() && (
              <>
                <dt>Telefon</dt>
                <dd>{phone.trim()}</dd>
              </>
            )}
            <dt>Leistung</dt>
            <dd>{serviceLabel}</dd>
            {preview.budget && (
              <>
                <dt>Budgetrahmen</dt>
                <dd>{preview.budget}</dd>
              </>
            )}
            <dt>Projektbeschreibung</dt>
            <dd>{preview.description}</dd>
          </dl>
          <button
            className="inquiry-submit"
            type="button"
            onClick={() => {
              editingRef.current = true;
              setPreview(null);
            }}
          >
            Angaben bearbeiten <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
    </>
  );
}
