import { Pool } from "pg";

// Next.js dev modunda her hot-reload'da modul yeniden calisir; global'e
// tekilleştirmeden her degisiklikte yeni bir Pool acilir ve baglantilar
// tukenir. Bu yuzden Pool globalThis uzerinde tekil tutulur.
declare global {
  var _otellioPgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    throw new Error(
      "SUPABASE_DB_URL tanimli degil. .env.local dosyasina eklenmeli."
    );
  }
  return new Pool({ connectionString, max: 5 });
}

// Pool, modul yuklenirken DEGIL ilk kullanimda olusturulur: `next build`
// sayfa verisi toplarken rota modullerini import eder ve env degiskenlerinin
// olmadigi ortamlarda (ör. CI) modul seviyesinde olusturma build'i kirar.
export function getPool(): Pool {
  if (!globalThis._otellioPgPool) {
    globalThis._otellioPgPool = createPool();
  }
  return globalThis._otellioPgPool;
}
