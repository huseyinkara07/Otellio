// Haftalik rapor e-postasinin icerigini uretir. Saf tutulmustur (DB/HTTP
// bagimliligi yok) ki gonderim katmanindan bagimsiz test edilebilsin.
// Ayni dizindeki modullere gore konum: lib/validation.ts'deki gibi lib ici
// goreli import kullanilir.
//
// E-posta istemcileri harici CSS desteklemedigi icin stiller satir ici
// yazilir; renkler PRD Bolum 5 paletinin hex karsiliklaridir
// (tailwind.config.ts ile ayni degerler).

import {
  computeOccupancyForecast,
  type ForecastPoint,
} from "../forecast/simpleForecast";
import { computePriceSuggestions } from "../forecast/priceSuggestion";
import { weeklyReportEmail } from "../content";

const REPORT_HORIZON_DAYS = 30;
const WEEK_DAYS = 7;
// Genel Bakis'taki "One Cikan Gunler" esikleriyle ayni (app/dashboard/page.tsx).
const BUSY_THRESHOLD = 0.8;
const QUIET_THRESHOLD = 0.5;
const MAX_HIGHLIGHT_DAYS = 3;

const COLOR_NAVY = "#0F2A43";
const COLOR_SAND = "#F7F4EF";
const COLOR_ACCENT = "#E86A33";
const COLOR_MUTED = "#5B6672";
const COLOR_INK = "#1A1A1A";

export type WeeklyReportInput = {
  hotelName: string;
  roomCount: number;
  basePrice: number;
  reservations: { stay_date: string; rooms_sold: number }[];
  baseUrl: string;
  today?: Date;
};

export type WeeklyReport = {
  subject: string;
  html: string;
};

// Otel adi kullanici girdisidir; HTML'e gomulmeden once kacislanir.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDayLong(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
}

function averageOccupancyPct(points: ForecastPoint[]): number {
  return Math.round(
    (points.reduce((sum, p) => sum + p.occupancyRate, 0) / points.length) * 100
  );
}

function highlightListHtml(
  title: string,
  hint: string,
  days: ForecastPoint[],
  priceByDate: Map<string, number>
): string {
  if (days.length === 0) return "";
  const items = days
    .map(
      (day) =>
        `<li style="margin:0 0 8px 0;">${formatDayLong(day.date)} — ` +
        `${weeklyReportEmail.occupancyLabel}: <strong>%${Math.round(
          day.occupancyRate * 100
        )}</strong>, ` +
        `${weeklyReportEmail.suggestedPriceLabel}: <strong>${priceByDate.get(
          day.date
        )} TL</strong></li>`
    )
    .join("");
  return (
    `<h3 style="margin:24px 0 4px 0;font-size:16px;color:${COLOR_NAVY};">${title}</h3>` +
    `<p style="margin:0 0 12px 0;font-size:13px;color:${COLOR_MUTED};">${hint}</p>` +
    `<ul style="margin:0;padding-left:20px;font-size:14px;color:${COLOR_INK};">${items}</ul>`
  );
}

export function buildWeeklyReport(
  input: WeeklyReportInput
): WeeklyReport | null {
  const forecast = computeOccupancyForecast(
    input.reservations,
    input.roomCount,
    REPORT_HORIZON_DAYS,
    input.today ?? new Date()
  );
  if (forecast.status !== "ok") return null;

  const weekPoints = forecast.points.slice(0, WEEK_DAYS);
  const weekAvgOccupancy = averageOccupancyPct(weekPoints);
  const weekAvgPrice = Math.round(
    computePriceSuggestions(weekPoints, input.basePrice).reduce(
      (sum, p) => sum + p.suggestedPrice,
      0
    ) / weekPoints.length
  );

  const priceByDate = new Map(
    computePriceSuggestions(forecast.points, input.basePrice).map((p) => [
      p.date,
      p.suggestedPrice,
    ])
  );

  const busyDays = forecast.points
    .filter((p) => p.occupancyRate >= BUSY_THRESHOLD)
    .sort((a, b) => b.occupancyRate - a.occupancyRate)
    .slice(0, MAX_HIGHLIGHT_DAYS);
  const quietDays = forecast.points
    .filter((p) => p.occupancyRate <= QUIET_THRESHOLD)
    .sort((a, b) => a.occupancyRate - b.occupancyRate)
    .slice(0, MAX_HIGHLIGHT_DAYS);

  const safeHotelName = escapeHtml(input.hotelName);
  const dashboardUrl = `${input.baseUrl.replace(/\/$/, "")}/dashboard`;

  const html = `<!DOCTYPE html>
<html lang="tr">
  <body style="margin:0;padding:0;background-color:${COLOR_SAND};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLOR_SAND};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:${COLOR_NAVY};padding:20px 32px;">
                <span style="font-size:22px;font-weight:bold;color:#FFFFFF;">Otellio</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 4px 0;font-size:16px;color:${COLOR_INK};">${weeklyReportEmail.greetingPrefix} ${safeHotelName},</p>
                <p style="margin:0 0 24px 0;font-size:14px;color:${COLOR_MUTED};">${weeklyReportEmail.intro}</p>

                <h2 style="margin:0 0 12px 0;font-size:18px;color:${COLOR_NAVY};">${weeklyReportEmail.weekTitle}</h2>
                <p style="margin:0 0 4px 0;font-size:14px;color:${COLOR_INK};">${weeklyReportEmail.avgOccupancyLabel}: <strong>%${weekAvgOccupancy}</strong></p>
                <p style="margin:0;font-size:14px;color:${COLOR_INK};">${weeklyReportEmail.avgPriceLabel}: <strong>${weekAvgPrice} TL</strong></p>

                ${highlightListHtml(
                  weeklyReportEmail.busyTitle,
                  weeklyReportEmail.busyHint,
                  busyDays,
                  priceByDate
                )}
                ${highlightListHtml(
                  weeklyReportEmail.quietTitle,
                  weeklyReportEmail.quietHint,
                  quietDays,
                  priceByDate
                )}

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;">
                  <tr>
                    <td style="background-color:${COLOR_ACCENT};border-radius:10px;">
                      <a href="${dashboardUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:bold;color:${COLOR_NAVY};text-decoration:none;">${weeklyReportEmail.ctaLabel}</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0 0;font-size:12px;color:${COLOR_MUTED};">${weeklyReportEmail.disclaimer}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background-color:${COLOR_SAND};">
                <p style="margin:0;font-size:11px;color:${COLOR_MUTED};">${weeklyReportEmail.footerNote}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject: `${weeklyReportEmail.subjectPrefix} — ${input.hotelName}`,
    html,
  };
}
