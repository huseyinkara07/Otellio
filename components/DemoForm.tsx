"use client";

import {
  useId,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { demo } from "@/lib/content";
import {
  validateDemoForm,
  type DemoFormErrors,
  type DemoFormInput,
} from "@/lib/validation";

type FormState = DemoFormInput & {
  // Honeypot: gerçek kullanıcılara görünmez, botlar doldurur.
  company: string;
};

type FormErrors = DemoFormErrors;

const initialState: FormState = {
  hotelName: "",
  roomCount: "",
  email: "",
  phone: "",
  message: "",
  kvkk: false,
  company: "",
};

export default function DemoForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const formId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Honeypot doluysa bot kabul edilir, gönderim sessizce yok sayılır.
    if (values.company) {
      return;
    }

    const validationErrors = validateDemoForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setServerError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: { success: boolean; errors?: FormErrors } = await response
        .json()
        .catch(() => ({ success: false }));

      if (response.ok && data.success) {
        setSubmitted(true);
        setValues(initialState);
      } else if (response.status === 429) {
        setServerError(demo.rateLimitError);
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setServerError(demo.serverError);
      }
    } catch {
      setServerError(demo.serverError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="demo" className="bg-navy py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          {demo.title}
        </h2>
        <p className="mt-4 text-center text-white/80">{demo.subtitle}</p>

        <div className="mt-10">
          {submitted ? (
            <div
              role="status"
              className="rounded-card bg-white p-8 text-center text-lg font-medium text-navy shadow-sm"
            >
              {demo.successMessage}
            </div>
          ) : (
            <>
              {serverError && (
                <div
                  role="alert"
                  className="mb-4 rounded-card bg-white p-4 text-center text-sm font-medium text-error shadow-sm"
                >
                  {serverError}
                </div>
              )}
              <DemoFormFields
                values={values}
                errors={errors}
                setValues={setValues}
                formId={formId}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function DemoFormFields({
  values,
  errors,
  setValues,
  formId,
  onSubmit,
  submitting,
}: {
  values: FormState;
  errors: FormErrors;
  setValues: Dispatch<SetStateAction<FormState>>;
  formId: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 rounded-card bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Honeypot alanı: ekranda görünmez, botlar doldurur */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-company`}>Şirket</label>
        <input
          id={`${formId}-company`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
        />
      </div>

      <Field
        id={`${formId}-hotelName`}
        label={demo.fields.hotelName.label}
        placeholder={demo.fields.hotelName.placeholder}
        type="text"
        value={values.hotelName}
        error={errors.hotelName}
        onChange={(value) => setValues((v) => ({ ...v, hotelName: value }))}
      />

      <Field
        id={`${formId}-roomCount`}
        label={demo.fields.roomCount.label}
        placeholder={demo.fields.roomCount.placeholder}
        type="number"
        value={values.roomCount}
        error={errors.roomCount}
        onChange={(value) => setValues((v) => ({ ...v, roomCount: value }))}
      />

      <Field
        id={`${formId}-email`}
        label={demo.fields.email.label}
        placeholder={demo.fields.email.placeholder}
        type="email"
        value={values.email}
        error={errors.email}
        onChange={(value) => setValues((v) => ({ ...v, email: value }))}
      />

      <Field
        id={`${formId}-phone`}
        label={demo.fields.phone.label}
        placeholder={demo.fields.phone.placeholder}
        type="tel"
        value={values.phone}
        error={errors.phone}
        onChange={(value) => setValues((v) => ({ ...v, phone: value }))}
      />

      <div>
        <label
          htmlFor={`${formId}-message`}
          className="block text-sm font-medium text-navy"
        >
          {demo.fields.message.label}
        </label>
        <textarea
          id={`${formId}-message`}
          rows={4}
          placeholder={demo.fields.message.placeholder}
          value={values.message}
          onChange={(e) =>
            setValues((v) => ({ ...v, message: e.target.value }))
          }
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? `${formId}-message-error` : undefined
          }
          className="mt-2 w-full rounded-button border border-black/15 px-4 py-3 text-base text-ink focus-visible:border-accent"
        />
        {errors.message && (
          <p
            id={`${formId}-message-error`}
            className="mt-1 text-sm text-error"
          >
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.kvkk}
            onChange={(e) =>
              setValues((v) => ({ ...v, kvkk: e.target.checked }))
            }
            aria-invalid={Boolean(errors.kvkk)}
            aria-describedby={errors.kvkk ? `${formId}-kvkk-error` : undefined}
            className="mt-1 h-5 w-5 shrink-0 accent-accent"
          />
          <span>
            {demo.kvkkText}{" "}
            <a
              href={demo.kvkkLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:font-semibold"
            >
              {demo.kvkkLinkText}
            </a>
          </span>
        </label>
        {errors.kvkk && (
          <p id={`${formId}-kvkk-error`} className="mt-1 text-sm text-error">
            {errors.kvkk}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {submitting ? "Gönderiliyor..." : demo.submitLabel}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  placeholder,
  type,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-12 w-full rounded-button border border-black/15 px-4 text-base text-ink focus-visible:border-accent"
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
