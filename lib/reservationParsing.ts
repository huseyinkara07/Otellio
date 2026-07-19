// Excel/CSV'den okunan ham satirlari (xlsx'in sheet_to_json({header:1}) ile
// urettigi unknown[][] bicimi) rezervasyon kayitlarina cevirir. Bu fonksiyon
// hem tarayicida (yukleme onizlemesi) hem gerekirse baska bir baglamda
// yeniden kullanilabilecek sekilde saf (pure) tutulmustur.

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_ROWS = 5000;

export type ParsedReservationRow = {
  stayDate: string;
  roomsSold: number;
  revenue: number | null;
};

export type ParseOutcome = {
  rows: ParsedReservationRow[];
  skippedCount: number;
  errorCode?: "no_valid_rows" | "missing_columns";
};

const DATE_HEADERS = ["tarih", "date"];
const ROOMS_SOLD_HEADERS = [
  "satılan oda sayısı",
  "satilan oda sayisi",
  "satılan oda",
  "satilan oda",
  "dolu oda sayısı",
  "dolu oda sayisi",
  "dolu oda",
  "rooms sold",
  "occupied rooms",
];
const REVENUE_HEADERS = [
  "gelir",
  "revenue",
  "fiyat",
  "ortalama fiyat",
  "toplam gelir",
];

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("tr");
}

function findColumnIndex(headerRow: unknown[], candidates: string[]): number {
  const normalized = headerRow.map(normalizeHeader);
  return normalized.findIndex((header) => candidates.includes(header));
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function excelSerialToDate(serial: number): Date | null {
  if (!Number.isFinite(serial) || serial <= 0) return null;
  const utcDays = Math.floor(serial - 25569);
  const date = new Date(utcDays * 86400 * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseFlexibleDate(value: unknown): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : toISODate(value);
  }
  if (typeof value === "number") {
    const date = excelSerialToDate(value);
    return date ? toISODate(date) : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();

    let match = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (match) {
      return toISODate(
        new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      );
    }

    match = trimmed.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (match) {
      return toISODate(
        new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
      );
    }
  }
  return null;
}

function parseNumericCell(value: unknown): number | null {
  if (typeof value === "number") return value;
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function isBlankRow(row: unknown[]): boolean {
  return row.every((cell) => cell === undefined || cell === null || cell === "");
}

export function parseReservationSheet(sheetRows: unknown[][]): ParseOutcome {
  if (sheetRows.length < 2) {
    return { rows: [], skippedCount: 0, errorCode: "no_valid_rows" };
  }

  const [headerRow, ...dataRows] = sheetRows;
  const dateCol = findColumnIndex(headerRow, DATE_HEADERS);
  const roomsCol = findColumnIndex(headerRow, ROOMS_SOLD_HEADERS);
  const revenueCol = findColumnIndex(headerRow, REVENUE_HEADERS);

  if (dateCol === -1 || roomsCol === -1) {
    return { rows: [], skippedCount: 0, errorCode: "missing_columns" };
  }

  const rowByDate = new Map<string, ParsedReservationRow>();
  let skippedCount = 0;

  for (const raw of dataRows) {
    if (!raw || isBlankRow(raw)) {
      continue;
    }

    const stayDate = parseFlexibleDate(raw[dateCol]);
    const roomsSold = parseNumericCell(raw[roomsCol]);
    const revenueRaw = revenueCol !== -1 ? raw[revenueCol] : undefined;
    const revenue =
      revenueRaw === undefined || revenueRaw === null || revenueRaw === ""
        ? null
        : parseNumericCell(revenueRaw);

    const isValid =
      stayDate !== null &&
      roomsSold !== null &&
      Number.isInteger(roomsSold) &&
      roomsSold >= 0 &&
      (revenue === null || (revenue !== null && Number.isFinite(revenue) && revenue >= 0));

    if (!isValid || stayDate === null || roomsSold === null) {
      skippedCount += 1;
      continue;
    }

    // Ayni tarih birden fazla kez geciyorsa dosyadaki son satir kazanir.
    rowByDate.set(stayDate, { stayDate, roomsSold, revenue });
  }

  const rows = Array.from(rowByDate.values()).sort((a, b) =>
    a.stayDate.localeCompare(b.stayDate)
  );

  if (rows.length === 0) {
    return { rows: [], skippedCount, errorCode: "no_valid_rows" };
  }

  return { rows, skippedCount };
}
