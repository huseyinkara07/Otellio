-- Kurumsal paketin "coklu tesis" vaadi: kullanici basina tek otel kisiti
-- (hotels.user_id UNIQUE) kaldirilir; bir kullanici birden fazla tesis
-- kaydedebilir. RLS politikalari sahiplik uzerinden (auth.uid() = user_id)
-- calismaya devam eder ve birden fazla satiri ayni sekilde korur.
--
-- Uygulama tarafi: panel "aktif tesis" secimini cookie ile tutar
-- (lib/hotels.ts, components/dashboard/HotelSwitcher.tsx).

alter table hotels drop constraint if exists hotels_user_id_key;
