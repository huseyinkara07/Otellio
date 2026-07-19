"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { hotelSettings } from "@/lib/content";
import { validateHotelSettings, type HotelSettingsErrors } from "@/lib/validation";
import { saveHotelSettings } from "@/lib/actions/hotels";

export default function HotelSettingsForm({
  initialName,
  initialRoomCount,
  initialBasePrice,
  isFirstRun,
}: {
  initialName: string;
  initialRoomCount: string;
  initialBasePrice: string;
  isFirstRun: boolean;
}) {
  const router = useRouter();
  const formId = useId();

  const [name, setName] = useState(initialName);
  const [roomCount, setRoomCount] = useState(initialRoomCount);
  const [basePrice, setBasePrice] = useState(initialBasePrice);
  const [errors, setErrors] = useState<HotelSettingsErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage(null);
    setSaved(false);

    const values = { name, roomCount, basePrice };
    const validationErrors = validateHotelSettings(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      const result = await saveHotelSettings(values);
      if (result.success) {
        setSaved(true);
        router.refresh();
      } else if (result.errors) {
        setErrors(result.errors);
      } else {
        setFormMessage(result.message ?? hotelSettings.errors.generic);
      }
    } catch {
      setFormMessage(hotelSettings.errors.generic);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-card bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-navy">{hotelSettings.title}</h1>
      <p className="mt-2 text-sm text-muted">{hotelSettings.subtitle}</p>

      {isFirstRun && (
        <div className="mt-4 rounded-card bg-sand p-3 text-sm text-navy">
          {hotelSettings.firstRunNotice}
        </div>
      )}

      {saved && (
        <div
          role="status"
          className="mt-4 rounded-card bg-sand p-3 text-sm font-medium text-navy"
        >
          {hotelSettings.savedMessage}
        </div>
      )}

      {formMessage && (
        <div
          role="alert"
          className="mt-4 rounded-card p-3 text-sm font-medium text-error ring-1 ring-error/20"
        >
          {formMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label
            htmlFor={`${formId}-name`}
            className="block text-sm font-medium text-navy"
          >
            {hotelSettings.nameLabel}
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            placeholder={hotelSettings.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            className="mt-2 h-12 w-full rounded-button border border-black/15 px-4 text-base text-ink focus-visible:border-accent"
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className="mt-1 text-sm text-error">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${formId}-roomCount`}
            className="block text-sm font-medium text-navy"
          >
            {hotelSettings.roomCountLabel}
          </label>
          <input
            id={`${formId}-roomCount`}
            type="number"
            placeholder={hotelSettings.roomCountPlaceholder}
            value={roomCount}
            onChange={(e) => setRoomCount(e.target.value)}
            aria-invalid={Boolean(errors.roomCount)}
            aria-describedby={
              errors.roomCount ? `${formId}-roomCount-error` : undefined
            }
            className="mt-2 h-12 w-full rounded-button border border-black/15 px-4 text-base text-ink focus-visible:border-accent"
          />
          {errors.roomCount && (
            <p
              id={`${formId}-roomCount-error`}
              className="mt-1 text-sm text-error"
            >
              {errors.roomCount}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${formId}-basePrice`}
            className="block text-sm font-medium text-navy"
          >
            {hotelSettings.basePriceLabel}
          </label>
          <input
            id={`${formId}-basePrice`}
            type="number"
            placeholder={hotelSettings.basePricePlaceholder}
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            aria-invalid={Boolean(errors.basePrice)}
            aria-describedby={
              errors.basePrice
                ? `${formId}-basePrice-error`
                : `${formId}-basePrice-hint`
            }
            className="mt-2 h-12 w-full rounded-button border border-black/15 px-4 text-base text-ink focus-visible:border-accent"
          />
          {errors.basePrice ? (
            <p
              id={`${formId}-basePrice-error`}
              className="mt-1 text-sm text-error"
            >
              {errors.basePrice}
            </p>
          ) : (
            <p
              id={`${formId}-basePrice-hint`}
              className="mt-1 text-sm text-muted"
            >
              {hotelSettings.basePriceHint}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          aria-busy={saving}
          className="inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? hotelSettings.savingLabel : hotelSettings.saveLabel}
        </button>
      </form>
    </div>
  );
}
