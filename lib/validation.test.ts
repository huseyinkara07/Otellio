import { describe, expect, it } from "vitest";
import { validateDemoForm, validateHotelSettings } from "./validation";

const validDemo = {
  hotelName: "Deniz Manzara Otel",
  roomCount: "45",
  email: "ornek@otel.com",
  phone: "0532 000 00 00",
  message: "",
  kvkk: true,
};

describe("validateDemoForm", () => {
  it("gecerli girdide hata dondurmez", () => {
    expect(validateDemoForm(validDemo)).toEqual({});
  });

  it("zorunlu alanlari kontrol eder", () => {
    const errors = validateDemoForm({
      hotelName: "",
      roomCount: "",
      email: "",
      phone: "",
      message: "",
      kvkk: false,
    });
    expect(Object.keys(errors).sort()).toEqual([
      "email",
      "hotelName",
      "kvkk",
      "phone",
      "roomCount",
    ]);
  });

  it("oda sayisi araligini (1-2000, tam sayi) uygular", () => {
    expect(validateDemoForm({ ...validDemo, roomCount: "0" }).roomCount).toBeDefined();
    expect(validateDemoForm({ ...validDemo, roomCount: "2001" }).roomCount).toBeDefined();
    expect(validateDemoForm({ ...validDemo, roomCount: "4.5" }).roomCount).toBeDefined();
    expect(validateDemoForm({ ...validDemo, roomCount: "2000" }).roomCount).toBeUndefined();
  });

  it("e-posta ve telefon bicimini kontrol eder", () => {
    expect(validateDemoForm({ ...validDemo, email: "gecersiz" }).email).toBeDefined();
    expect(validateDemoForm({ ...validDemo, phone: "123" }).phone).toBeDefined();
    expect(validateDemoForm({ ...validDemo, phone: "abc1234567" }).phone).toBeDefined();
    expect(
      validateDemoForm({ ...validDemo, phone: "+90 532 000 00 00" }).phone
    ).toBeUndefined();
  });

  it("mesaj uzunlugunu 500 ile sinirlar", () => {
    expect(
      validateDemoForm({ ...validDemo, message: "a".repeat(501) }).message
    ).toBeDefined();
    expect(
      validateDemoForm({ ...validDemo, message: "a".repeat(500) }).message
    ).toBeUndefined();
  });
});

describe("validateHotelSettings", () => {
  const valid = { name: "Deniz Manzara Otel", roomCount: "45", basePrice: "1500" };

  it("gecerli girdide hata dondurmez", () => {
    expect(validateHotelSettings(valid)).toEqual({});
  });

  it("taban fiyatin 0'dan buyuk olmasini ister", () => {
    expect(validateHotelSettings({ ...valid, basePrice: "0" }).basePrice).toBeDefined();
    expect(validateHotelSettings({ ...valid, basePrice: "-10" }).basePrice).toBeDefined();
    expect(validateHotelSettings({ ...valid, basePrice: "" }).basePrice).toBeDefined();
    expect(validateHotelSettings({ ...valid, basePrice: "0.5" }).basePrice).toBeUndefined();
  });

  it("otel adi uzunlugunu kontrol eder", () => {
    expect(validateHotelSettings({ ...valid, name: "A" }).name).toBeDefined();
    expect(validateHotelSettings({ ...valid, name: "A".repeat(101) }).name).toBeDefined();
  });
});
