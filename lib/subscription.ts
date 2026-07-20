import type { SupabaseClient } from "@supabase/supabase-js";

// Abonelik/plan yardimcilari. Odeme saglayicisi henuz entegre degil; bu katman
// planin ne oldugunu OKUR (RLS ile kullaniciya kisitli) ve satir yoksa guvenli
// varsayilana duser. Yazma (plan yukseltme) sunucu tarafinda yapilir.

export type PlanId = "baslangic" | "standart" | "kurumsal";
export type SubscriptionStatus = "trial" | "active" | "past_due" | "canceled";

export type Subscription = {
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
};

// Satiri olmayan kullanici icin varsayilan: baslangic paketi, deneme durumu.
export const DEFAULT_SUBSCRIPTION: Subscription = {
  plan: "baslangic",
  status: "trial",
  currentPeriodEnd: null,
};

const PLAN_ORDER: PlanId[] = ["baslangic", "standart", "kurumsal"];

// Plan siralamasi (yukseltme yonunu belirlemek icin): kurumsal > standart >
// baslangic.
export function planRank(plan: PlanId): number {
  return PLAN_ORDER.indexOf(plan);
}

export async function getSubscriptionForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Subscription> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  // 42P01 = tablo yok (migration henuz calistirilmamis ortam): abonelik
  // ozelligi opsiyonel oldugundan hata firlatmak yerine varsayilana duseriz.
  if (error) {
    if ((error as { code?: string }).code === "42P01") {
      return DEFAULT_SUBSCRIPTION;
    }
    throw error;
  }
  if (!data) return DEFAULT_SUBSCRIPTION;

  return {
    plan: data.plan as PlanId,
    status: data.status as SubscriptionStatus,
    currentPeriodEnd: data.current_period_end ?? null,
  };
}
