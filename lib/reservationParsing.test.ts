import { describe, expect, it } from "vitest";
import { parseReservationSheet } from "./reservationParsing";

describe("parseReservationSheet", () => {
  it("Turkce basliklar ve ISO tarihlerle satirlari ayristirir", () => {
    const outcome = parseReservationSheet([
      ["Tarih", "Satılan Oda Sayısı", "Gelir"],
      ["2025-07-01", 10, 15000],
      ["2025-07-02", 12, ""],
    ]);
    expect(outcome.errorCode).toBeUndefined();
    expect(outcome.rows).toEqual([
      { stayDate: "2025-07-01", roomsSold: 10, revenue: 15000 },
      { stayDate: "2025-07-02", roomsSold: 12, revenue: null },
    ]);
  });

  it("BUYUK harfli Turkce basliklari da tanir (İ -> i)", () => {
    const outcome = parseReservationSheet([
      ["TARİH", "DOLU ODA"],
      ["2025-07-01", 5],
    ]);
    expect(outcome.rows).toHaveLength(1);
  });

  it("gg.aa.yyyy ve Excel seri numarasi tarihlerini cevirir", () => {
    const outcome = parseReservationSheet([
      ["date", "rooms sold"],
      ["01.07.2025", 10],
      ["15/07/2025", 11],
      [25570, 12], // Excel serisi: 1899-12-30 + 25570 gun = 1970-01-02
    ]);
    expect(outcome.rows.map((r) => r.stayDate)).toEqual([
      "1970-01-02",
      "2025-07-01",
      "2025-07-15",
    ]);
  });

  it("ayni tarihte son satir kazanir ve satirlar tarihe gore siralanir", () => {
    const outcome = parseReservationSheet([
      ["Tarih", "Satılan Oda"],
      ["2025-07-02", 8],
      ["2025-07-01", 5],
      ["2025-07-02", 9],
    ]);
    expect(outcome.rows).toEqual([
      { stayDate: "2025-07-01", roomsSold: 5, revenue: null },
      { stayDate: "2025-07-02", roomsSold: 9, revenue: null },
    ]);
  });

  it("hatali satirlari atlar ve sayar; bos satirlari saymaz", () => {
    const outcome = parseReservationSheet([
      ["Tarih", "Satılan Oda"],
      ["2025-07-01", -3], // negatif oda: gecersiz
      ["gecersiz-tarih", 5], // tarih okunamiyor: gecersiz
      ["", "", ""], // bos satir: sessizce gecilir
      ["2025-07-02", 7],
    ]);
    expect(outcome.rows).toHaveLength(1);
    expect(outcome.skippedCount).toBe(2);
  });

  it("zorunlu sutunlar yoksa missing_columns doner", () => {
    const outcome = parseReservationSheet([
      ["Ad", "Soyad"],
      ["a", "b"],
    ]);
    expect(outcome.errorCode).toBe("missing_columns");
  });

  it("hic gecerli satir yoksa no_valid_rows doner", () => {
    expect(parseReservationSheet([]).errorCode).toBe("no_valid_rows");
    expect(
      parseReservationSheet([
        ["Tarih", "Satılan Oda"],
        ["x", "y"],
      ]).errorCode
    ).toBe("no_valid_rows");
  });

  it("virgullu ondalik geliri cevirir", () => {
    const outcome = parseReservationSheet([
      ["Tarih", "Satılan Oda", "Gelir"],
      ["2025-07-01", 10, "1500,50"],
    ]);
    expect(outcome.rows[0].revenue).toBeCloseTo(1500.5, 9);
  });
});
