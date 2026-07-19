import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { parseReservationSheet } from "./reservationParsing";

// Veri Yukle sayfasindan indirilen ornek dosyanin, uygulamanin kendi yukleme
// akisindan (xlsx okuma + parseReservationSheet) her zaman eksiksiz gectigini
// garanti eder; ornek dosya veya parser degisirse bu test kirilir.
describe("public/ornek-rezervasyon.csv", () => {
  it("ornek dosya yukleme akisindan atlanan satir olmadan gecer", () => {
    const csv = readFileSync(
      path.resolve(process.cwd(), "public", "ornek-rezervasyon.csv"),
      "utf8"
    );
    const workbook = XLSX.read(csv, { type: "string", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      raw: true,
      defval: "",
    });

    const outcome = parseReservationSheet(sheetRows);
    expect(outcome.errorCode).toBeUndefined();
    expect(outcome.skippedCount).toBe(0);
    expect(outcome.rows).toHaveLength(21);
    expect(outcome.rows[0]).toEqual({
      stayDate: "2026-06-01",
      roomsSold: 31,
      revenue: 40300,
    });
  });
});
