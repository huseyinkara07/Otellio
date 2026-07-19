import { Pool } from "pg";

// Next.js dev modunda her hot-reload'da modul yeniden calisir; global'e
// tekilleştirmeden her degisiklikte yeni bir Pool acilir ve baglantilar
// tukenir. Bu yuzden Pool'u globalThis uzerinde tekil tutuyoruz.
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

export const pool = globalThis._otellioPgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis._otellioPgPool = pool;
}
