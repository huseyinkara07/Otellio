-- 0004: abonelik altyapisi (saglayicidan bagimsiz).
--
-- Odeme saglayici entegrasyonu (iyzico/PayTR/Stripe) HENUZ YOK; bu tablo
-- ileride bir odeme webhook'u tarafindan veya elle (Supabase / dogrudan
-- Postgres) doldurulur. Kullanici kendi planini YUKSELTEMEZ: yalnizca kendi
-- abonelik satirini okuyabilir; yazma islemleri sunucu tarafi (service role /
-- dogrudan Postgres baglantisi) ile yapilir. Boylece kimse kendini ucretsiz
-- sekilde ucretli pakete tasiyamaz.
--
-- Abonelik kullanici (hesap) bazindadir; coklu tesis ayni abonelige baglidir.
-- Satiri olmayan kullanici, uygulama tarafinda varsayilan olarak "baslangic /
-- trial" kabul edilir (bkz. lib/subscription.ts).

create table if not exists subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'baslangic'
    check (plan in ('baslangic', 'standart', 'kurumsal')),
  status text not null default 'trial'
    check (status in ('trial', 'active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

-- Kullanici yalnizca kendi abonelik satirini OKUYABILIR. Yazma politikasi
-- bilerek tanimlanmadi; INSERT/UPDATE/DELETE RLS tarafindan reddedilir.
create policy "subscriptions_owner_read"
  on subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);
