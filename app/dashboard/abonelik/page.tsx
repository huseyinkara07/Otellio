import { createClient } from "@/lib/supabase/server";
import { getSubscriptionForUser, DEFAULT_SUBSCRIPTION } from "@/lib/subscription";
import { pricing, subscription as sub } from "@/lib/content";

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const current = user
    ? await getSubscriptionForUser(supabase, user.id)
    : DEFAULT_SUBSCRIPTION;

  const currentPlan =
    pricing.plans.find((p) => p.id === current.plan) ?? pricing.plans[0];
  const otherPlans = pricing.plans.filter((p) => p.id !== current.plan);
  const statusLabel = sub.statusLabels[current.status] ?? current.status;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-navy">{sub.title}</h1>
      <p className="mt-2 text-sm text-muted">{sub.subtitle}</p>

      {/* Mevcut plan */}
      <div className="mt-6 rounded-card border border-accent/40 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm text-muted">{sub.currentPlanLabel}</div>
            <div className="mt-1 text-xl font-bold text-navy">
              {currentPlan.name}
            </div>
          </div>
          <span className="rounded-button bg-sand px-3 py-1 text-sm font-medium text-navy">
            {statusLabel}
          </span>
        </div>

        <p className="mt-4 text-sm font-medium text-navy">{sub.includesLabel}</p>
        <ul className="mt-2 space-y-1 text-sm text-ink">
          {currentPlan.features.map((feature) => (
            <li key={feature}>• {feature}</li>
          ))}
        </ul>
      </div>

      {/* Diger paketler */}
      <h2 className="mt-8 text-lg font-semibold text-navy">
        {sub.otherPlansTitle}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {otherPlans.map((plan) => (
          <div key={plan.id} className="rounded-card bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-navy">{plan.name}</h3>
              {plan.badge && (
                <span className="rounded-button bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent-hover">
                  {plan.badge}
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-muted">{plan.target}</div>
            <div className="mt-2 text-sm font-semibold text-navy">
              {plan.price}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-ink">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <a
          href={sub.upgradeHref}
          className="inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110"
        >
          {sub.upgradeCta}
        </a>
        <p className="mt-3 text-xs text-muted">{sub.manualNote}</p>
      </div>
    </div>
  );
}
