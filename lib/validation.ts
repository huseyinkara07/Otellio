// Demo formu dogrulama kurallari (PRD Bolum 7). Hem istemci (DemoForm.tsx)
// hem sunucu (app/api/demo/route.ts) ayni kurallari kullanir; boylece iki
// tarafin kurallari zamanla birbirinden sapmaz.
import { demo, hotelSettings } from "./content";

export type DemoFormInput = {
  hotelName: string;
  roomCount: string;
  email: string;
  phone: string;
  message: string;
  kvkk: boolean;
};

export type DemoFormErrors = Partial<Record<keyof DemoFormInput, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_CHARS_REGEX = /^[0-9+\s]+$/;

export function validateDemoForm(values: DemoFormInput): DemoFormErrors {
  const errors: DemoFormErrors = {};
  const { fields } = demo;

  const hotelName = values.hotelName.trim();
  if (!hotelName) {
    errors.hotelName = fields.hotelName.errorRequired;
  } else if (hotelName.length < 2 || hotelName.length > 100) {
    errors.hotelName = fields.hotelName.errorLength;
  }

  const roomCountRaw = values.roomCount.trim();
  const roomCount = Number(roomCountRaw);
  if (!roomCountRaw) {
    errors.roomCount = fields.roomCount.errorRequired;
  } else if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 2000) {
    errors.roomCount = fields.roomCount.errorRange;
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = fields.email.errorRequired;
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = fields.email.errorInvalid;
  }

  const phone = values.phone.trim();
  const phoneDigitCount = phone.replace(/\D/g, "").length;
  if (!phone) {
    errors.phone = fields.phone.errorRequired;
  } else if (
    !PHONE_ALLOWED_CHARS_REGEX.test(phone) ||
    phoneDigitCount < 10 ||
    phoneDigitCount > 15
  ) {
    errors.phone = fields.phone.errorInvalid;
  }

  if (values.message.trim().length > 500) {
    errors.message = fields.message.errorLength;
  }

  if (!values.kvkk) {
    errors.kvkk = demo.kvkkError;
  }

  return errors;
}

export type HotelSettingsInput = {
  name: string;
  roomCount: string;
  basePrice: string;
};

export type HotelSettingsErrors = Partial<Record<keyof HotelSettingsInput, string>>;

export function validateHotelSettings(
  values: HotelSettingsInput
): HotelSettingsErrors {
  const errors: HotelSettingsErrors = {};
  const { errors: messages } = hotelSettings;

  const name = values.name.trim();
  if (!name) {
    errors.name = messages.nameRequired;
  } else if (name.length < 2 || name.length > 100) {
    errors.name = messages.nameLength;
  }

  const roomCountRaw = values.roomCount.trim();
  const roomCount = Number(roomCountRaw);
  if (!roomCountRaw) {
    errors.roomCount = messages.roomCountRequired;
  } else if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 2000) {
    errors.roomCount = messages.roomCountRange;
  }

  const basePriceRaw = values.basePrice.trim();
  const basePrice = Number(basePriceRaw);
  if (!basePriceRaw) {
    errors.basePrice = messages.basePriceRequired;
  } else if (!Number.isFinite(basePrice) || basePrice <= 0) {
    errors.basePrice = messages.basePriceRange;
  }

  return errors;
}
