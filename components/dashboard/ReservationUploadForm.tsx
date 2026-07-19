"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { dataUpload } from "@/lib/content";
import {
  parseReservationSheet,
  MAX_FILE_SIZE_BYTES,
  MAX_ROWS,
  type ParsedReservationRow,
} from "@/lib/reservationParsing";

const ACCEPTED_EXTENSIONS = [".xlsx", ".csv"];

export default function ReservationUploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<ParsedReservationRow[]>([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  async function handleFile(file: File) {
    setErrorMessage(null);
    setSavedCount(null);
    setRows([]);
    setSkippedCount(0);

    const lowerName = file.name.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
      setErrorMessage(dataUpload.errors.unsupportedType);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(dataUpload.errors.fileTooLarge);
      return;
    }

    setParsing(true);
    try {
      const XLSX = await import("xlsx");
      const isCsv = lowerName.endsWith(".csv");
      const data = isCsv ? await file.text() : await file.arrayBuffer();
      const workbook = XLSX.read(data, {
        type: isCsv ? "string" : "array",
        cellDates: true,
      });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        raw: true,
        defval: "",
      });

      if (sheetRows.length - 1 > MAX_ROWS) {
        setErrorMessage(dataUpload.errors.tooManyRows);
        return;
      }

      const outcome = parseReservationSheet(sheetRows);
      if (outcome.errorCode) {
        setErrorMessage(dataUpload.errors.noValidRows);
        return;
      }

      setRows(outcome.rows);
      setSkippedCount(outcome.skippedCount);
    } catch {
      setErrorMessage(dataUpload.errors.parseFailed);
    } finally {
      setParsing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data: { success: boolean; savedCount?: number } = await response
        .json()
        .catch(() => ({ success: false }));

      if (response.ok && data.success) {
        setSavedCount(data.savedCount ?? rows.length);
        setRows([]);
        router.refresh();
      } else {
        setErrorMessage(dataUpload.errors.saveFailed);
      }
    } catch {
      setErrorMessage(dataUpload.errors.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-card bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-navy">{dataUpload.title}</h1>
      <p className="mt-2 text-sm text-muted">{dataUpload.subtitle}</p>
      <p className="mt-1 text-sm text-muted">{dataUpload.columnsHint}</p>

      {errorMessage && (
        <div
          role="alert"
          className="mt-4 rounded-card p-3 text-sm font-medium text-error ring-1 ring-error/20"
        >
          {errorMessage}
        </div>
      )}

      {savedCount !== null && (
        <div
          role="status"
          className="mt-4 rounded-card bg-sand p-3 text-sm font-medium text-navy"
        >
          {dataUpload.savedPrefix} {savedCount} {dataUpload.savedSuffix}
        </div>
      )}

      <label
        htmlFor="reservation-file"
        className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-black/15 p-10 text-center hover:border-accent"
      >
        <UploadCloud className="h-8 w-8 text-muted" aria-hidden="true" />
        <span className="font-medium text-navy">
          {dataUpload.dropzoneLabel}
        </span>
        <span className="text-sm text-muted">{dataUpload.dropzoneHint}</span>
        <input
          ref={inputRef}
          id="reservation-file"
          type="file"
          accept=".xlsx,.csv"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>

      {parsing && (
        <p className="mt-4 text-sm text-muted">{dataUpload.parsingLabel}</p>
      )}

      {rows.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-navy">
            {dataUpload.previewTitle}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {rows.length} {dataUpload.rowsFoundSuffix}
            {skippedCount > 0
              ? ` ${skippedCount} ${dataUpload.skippedRowsSuffix}`
              : ""}
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-muted">
                  <th className="py-2 pr-4">{dataUpload.columnDate}</th>
                  <th className="py-2 pr-4">{dataUpload.columnRoomsSold}</th>
                  <th className="py-2 pr-4">{dataUpload.columnRevenue}</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 15).map((row) => (
                  <tr
                    key={row.stayDate}
                    className="border-b border-black/5 text-ink"
                  >
                    <td className="py-2 pr-4">{row.stayDate}</td>
                    <td className="py-2 pr-4">{row.roomsSold}</td>
                    <td className="py-2 pr-4">{row.revenue ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            aria-busy={saving}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? dataUpload.savingLabel : dataUpload.saveLabel}
          </button>
        </div>
      )}
    </div>
  );
}
