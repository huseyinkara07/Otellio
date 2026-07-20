import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DEFAULT_SUBSCRIPTION,
  getSubscriptionForUser,
  planRank,
} from "./subscription";

// maybeSingle() zincirini taklit eden minimal Supabase istemcisi.
function fakeClient(result: { data: unknown; error: unknown }): SupabaseClient {
  const chain = {
    select: () => chain,
    eq: () => chain,
    maybeSingle: () => Promise.resolve(result),
  };
  return { from: () => chain } as unknown as SupabaseClient;
}

describe("planRank", () => {
  it("paketleri dogru siralar (kurumsal > standart > baslangic)", () => {
    expect(planRank("kurumsal")).toBeGreaterThan(planRank("standart"));
    expect(planRank("standart")).toBeGreaterThan(planRank("baslangic"));
  });
});

describe("getSubscriptionForUser", () => {
  it("satir yoksa varsayilana (baslangic/trial) duser", async () => {
    const sub = await getSubscriptionForUser(
      fakeClient({ data: null, error: null }),
      "u1"
    );
    expect(sub).toEqual(DEFAULT_SUBSCRIPTION);
  });

  it("mevcut abonelik satirini dogru cozer", async () => {
    const sub = await getSubscriptionForUser(
      fakeClient({
        data: {
          plan: "standart",
          status: "active",
          current_period_end: "2026-12-31T00:00:00Z",
        },
        error: null,
      }),
      "u1"
    );
    expect(sub).toEqual({
      plan: "standart",
      status: "active",
      currentPeriodEnd: "2026-12-31T00:00:00Z",
    });
  });

  it("beklenmedik veritabani hatasinda istisna firlatir", async () => {
    await expect(
      getSubscriptionForUser(
        fakeClient({ data: null, error: new Error("db") }),
        "u1"
      )
    ).rejects.toThrow();
  });

  it("tablo yoksa (42P01) varsayilana duser, hata firlatmaz", async () => {
    const sub = await getSubscriptionForUser(
      fakeClient({ data: null, error: { code: "42P01" } }),
      "u1"
    );
    expect(sub).toEqual(DEFAULT_SUBSCRIPTION);
  });
});
