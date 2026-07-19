"use client";

import { Suspense, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, demoAnchor, siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/client";

function mapAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return auth.errors.invalidCredentials;
  }
  return auth.errors.generic;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = auth.errors.emailRequired;
    }
    if (!password) {
      errors.password = auth.errors.passwordRequired;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setFormError(mapAuthError(error.message));
        return;
      }

      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch {
      // Supabase istemcisi olusturulamadi (ör. NEXT_PUBLIC_SUPABASE_URL/
      // ANON_KEY .env.local'de tanimli degil) veya beklenmeyen bir hata olustu.
      setFormError(auth.errors.generic);
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
            {auth.title}
          </h1>
          <p className="mt-2 text-center text-sm text-muted">
            {auth.subtitle}
          </p>

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
                {auth.emailLabel}
              </label>
              <input
                id={`${formId}-email`}
                type="email"
                autoComplete="email"
                placeholder={auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? `${formId}-email-error` : undefined
                }
                className="mt-2 h-12 w-full rounded-button border border-black/15 px-4 text-base text-ink focus-visible:border-accent"
              />
              {fieldErrors.email && (
                <p
                  id={`${formId}-email-error`}
                  className="mt-1 text-sm text-error"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${formId}-password`}
                className="block text-sm font-medium text-navy"
              >
                {auth.passwordLabel}
              </label>
              <input
                id={`${formId}-password`}
                type="password"
                autoComplete="current-password"
                placeholder={auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? `${formId}-password-error` : undefined
                }
                className="mt-2 h-12 w-full rounded-button border border-black/15 px-4 text-base text-ink focus-visible:border-accent"
              />
              {fieldErrors.password && (
                <p
                  id={`${formId}-password-error`}
                  className="mt-1 text-sm text-error"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? auth.submittingLabel : auth.submitLabel}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {auth.noAccountText}{" "}
            <Link
              href={`/${demoAnchor}`}
              className="font-medium text-navy underline hover:text-accent"
            >
              {auth.requestDemoLink}
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-navy underline hover:text-accent"
          >
            ← {auth.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
