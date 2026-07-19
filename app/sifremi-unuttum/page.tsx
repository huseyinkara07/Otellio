"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { passwordReset, siteConfig } from "@/lib/content";
import { EMAIL_REGEX } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const formId = useId();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setFieldError(passwordReset.errors.emailRequired);
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setFieldError(passwordReset.errors.emailInvalid);
      return;
    }
    setFieldError(null);

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/sifre-yenile`,
      });

      // Hesabin var olup olmadigi disariya sizdirilmaz: e-posta kayitli
      // degilse de ayni basari mesaji gosterilir. Yalnizca istegin kendisi
      // basarisiz olursa (ag hatasi, rate limit) genel hata gosterilir.
      if (error) {
        setFormError(passwordReset.errors.generic);
        return;
      }
      setSubmitted(true);
    } catch {
      setFormError(passwordReset.errors.generic);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-navy">
            {siteConfig.name}
          </Link>
        </div>

        <div className="rounded-card bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-navy">
            {passwordReset.requestTitle}
          </h1>
          <p className="mt-2 text-center text-sm text-muted">
            {passwordReset.requestSubtitle}
          </p>

          {submitted ? (
            <div
              role="status"
              className="mt-6 rounded-card bg-sand p-4 text-center text-sm font-medium text-navy"
            >
              {passwordReset.requestSuccessMessage}
            </div>
          ) : (
            <>
              {formError && (
                <div
                  role="alert"
                  className="mt-6 rounded-card bg-white p-3 text-center text-sm font-medium text-error ring-1 ring-error/20"
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor={`${formId}-email`}
                    className="block text-sm font-medium text-navy"
                  >
                    {passwordReset.emailLabel}
                  </label>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    autoComplete="email"
                    placeholder={passwordReset.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(fieldError)}
                    aria-describedby={
                      fieldError ? `${formId}-email-error` : undefined
                    }
                    className="mt-2 h-12 w-full rounded-button border border-black/15 px-4 text-base text-ink focus-visible:border-accent"
                  />
                  {fieldError && (
                    <p
                      id={`${formId}-email-error`}
                      className="mt-1 text-sm text-error"
                    >
                      {fieldError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className="inline-flex h-12 w-full items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting
                    ? passwordReset.requestSubmittingLabel
                    : passwordReset.requestSubmitLabel}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm">
            <Link
              href="/login"
              className="font-medium text-navy underline hover:text-accent"
            >
              {passwordReset.backToLogin}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
