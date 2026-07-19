import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const SETTINGS_PATH = "/dashboard/ayarlar";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Supabase Auth henuz yapilandirilmamis olabilir (NEXT_PUBLIC_SUPABASE_URL/
  // ANON_KEY .env.local'de yoksa). Korumali olmayan rotalar (ornegin anasayfa)
  // bu durumdan etkilenmemeli; sadece /dashboard gibi korumali rotalar
  // yapilandirma tamamlanana kadar login'e yonlendirilir.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    if (isProtected) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() Supabase Auth sunucusuna dogrular; getSession() sadece cookie
  // icerigini okur ve sahte/eski oturumlara karsi guvenli degildir.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Ilk girisde otel profili (hotels tablosu) henuz olusturulmamis olabilir.
  // Ayarlar sayfasinin disindaki her korumali rota, profil tamamlanana kadar
  // Ayarlar'a yonlendirilir (sonsuz donguyu onlemek icin kendisi haric).
  if (isProtected && user && pathname !== SETTINGS_PATH) {
    const { data: hotel } = await supabase
      .from("hotels")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!hotel) {
      const settingsUrl = request.nextUrl.clone();
      settingsUrl.pathname = SETTINGS_PATH;
      return NextResponse.redirect(settingsUrl);
    }
  }

  return supabaseResponse;
}
