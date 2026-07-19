"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { passwordReset, siteConfig } from "@/lib/content";
import { createClient } from "@/lib/supabase/client";

const MIN_PASSWORD_LENGTH = 8;

// E-postadaki sifre sifirlama baglantisi kullaniciyi buraya getirir.
// Supabase istemcisi URL'deki kurtarma kodunu ilk olusturuldugunda kendisi
// dogrulayip gecici bir oturum acar (detectSessionInUrl); bu sayfa yalnizca
// bu oturumun olusup olusmadigini dinler ve yeni sifreyi kaydeder.
type LinkStatus = "checking" | "ready" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const formId = useId();

  const [linkStatus, setLinkStatus] = useState<LinkStatus>("checking");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    passwordConfirm?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // INITIAL_SESSION, URL'deki kurtarma kodunun dogrulanmasi bittikten
    // sonra yayinlanir: oturum varsa baglanti gecerli, yoksa gecersiz/suresi
    // dolmus demektir. "ready" durumundan geriye dusulmez.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setLinkStatus("ready");
      } else {
        setLinkStatus((current) =>
          current === "checking" ? "invalid" : current
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors: { password?: string; passwordConfirm?: string } = {};
    if (!password) {
      errors.password = passwordReset.errors.passwordRequired;
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = passwordReset.errors.passwordTooShort;
    }
    if (!errors.password && password !== passwordConfirm) {
      errors.passwordConfirm = passwordReset.errors.passwordMismatch;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setFormError(passwordReset.errors.generic);
        return;
      }

      setUpdated(true);
      router.refresh();
      router.push("/dashboard");
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
          {linkStatus === "checking" && (
            <p className="text-center text-sm text-muted" role="status">
              {passwordReset.checkingLinkLabel}
            </p>
          )}

          {linkStatus === "invalid" && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-navy">
                {passwordReset.invalidLinkTitle}
              </h1>
              <p className="mt-2 text-sm text-muted">
                {passwordReset.invalidLinkBody}
              </p>
              <Link
                href="/sifremi-unuttum"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110"
              >
                {passwordReset.requestNewLink}
              </Link>
            </div>
          )}

          {linkStatus === "ready" && (
            <>
              <h1 className="text-center text-2xl font-bold text-navy">
                {passwordReset.updateTitle}
              </h1>
              <p className="mt-2 text-center text-sm text-muted">
                {passwordReset.updateSubtitle}
              </p>

              {updated ? (
                <div
                  role="status"
                  className="mt-6 rounded-card bg-sand p-4 text-center text-sm font-medium text-navy"
                >
                  {passwordReset.updateSuccessMessage}
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

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="mt-6 space-y-5"
                  >
                    <div>
                      <label
                        htmlFor={`${formId}-password`}
                        className="block text-sm font-medium text-navy"
                      >
                        {passwordReset.passwordLabel}
                      </label>
                      <input
                        id={`${formId}-password`}
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={
                          fieldErrors.password
                            ? `${formId}-password-error`
                            : undefined
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

                    <div>
                      <label
                        htmlFor={`${formId}-passwordConfirm`}
                        className="block text-sm font-medium text-navy"
                      >
                        {passwordReset.passwordConfirmLabel}
                      </label>
                      <input
                        id={`${formId}-passwordConfirm`}
                        type="password"
                        autoComplete="new-password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        aria-invalid={Boolean(fieldErrors.passwordConfirm)}
                        aria-describedby={
                          fieldErrors.passwordConfirm
                            ? `${formId}-passwordConfirm-error`
                            : undefined
                        }
                        className="mt-2 h-12 w-full rounded-button border border-black/15 px-4 text-base text-ink focus-visible:border-accent"
                      />
                      {fieldErrors.passwordConfirm && (
                        <p
                          id={`${formId}-passwordConfirm-error`}
                          className="mt-1 text-sm text-error"
                        >
                          {fieldErrors.passwordConfirm}
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
                        ? passwordReset.updateSubmittingLabel
                        : passwordReset.updateSubmitLabel}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
