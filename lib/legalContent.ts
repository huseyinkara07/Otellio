// KVKK Aydinlatma Metni ve Gizlilik Politikasi sayfalarinin tek icerik
// kaynagi (lib/content.ts ile ayni desen; hacimli hukuki metinler ana
// icerik dosyasini sisirmemek icin burada tutulur).
//
// NOT: Bu metinler standart bir taslak olarak hazirlanmistir; yayina
// cikmadan once bir hukukcuya kontrol ettirilmesi onerilir.

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPageContent = {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
  backToHome: string;
};

export const kvkkPage: LegalPageContent = {
  title: "KVKK Aydınlatma Metni",
  updatedAt: "Son güncelleme: 19 Temmuz 2026",
  intro:
    "Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, veri sorumlusu sıfatıyla Otellio tarafından, kişisel verilerinizin hangi amaçlarla ve nasıl işlendiğini açıklamak için hazırlanmıştır.",
  sections: [
    {
      heading: "Veri Sorumlusu",
      paragraphs: [
        "Kişisel verileriniz, veri sorumlusu sıfatıyla Otellio tarafından işlenir. Her türlü soru ve talebiniz için bize info@otellio.com adresinden ulaşabilirsiniz.",
      ],
    },
    {
      heading: "İşlenen Kişisel Veriler",
      paragraphs: [
        "Demo talep formunu doldurduğunuzda: otel adı, oda sayısı, e-posta adresiniz, telefon numaranız ve (isteğe bağlı) mesajınız işlenir.",
        "Otellio paneline kullanıcı olarak eklendiğinizde: hesap e-posta adresiniz ve tesisinize dair girdiğiniz bilgiler (tesis adı, oda sayısı, taban fiyat) işlenir.",
        "Panele yüklediğiniz rezervasyon verileri (tarih, satılan oda sayısı, gelir) misafirlerinize dair kişisel veri içermez; yalnızca tesisinize ait toplam sayılardan oluşur.",
      ],
    },
    {
      heading: "İşleme Amaçları",
      bullets: [
        "Demo talebinizi değerlendirmek ve sizinle iletişime geçmek",
        "Doluluk tahmini ve fiyat önerisi hizmetini sunmak",
        "Hesabınızın güvenliğini sağlamak (giriş, şifre sıfırlama, davet e-postaları)",
        "Talep etmeniz hâlinde haftalık özet raporları e-posta ile iletmek",
      ],
    },
    {
      heading: "İşlemenin Hukuki Sebepleri",
      paragraphs: [
        "Kişisel verileriniz; KVKK m.5/1 kapsamında açık rızanıza, hizmet ilişkisi kurulduğunda KVKK m.5/2-c kapsamında sözleşmenin kurulması ve ifasına, ayrıca KVKK m.5/2-f kapsamında meşru menfaate dayanılarak işlenir.",
      ],
    },
    {
      heading: "Verilerin Aktarılması",
      paragraphs: [
        "Verileriniz; hizmetin teknik altyapısını sağlayan, sunucuları yurt dışında bulunabilen hizmet sağlayıcılarında (veritabanı ve kimlik doğrulama: Supabase; e-posta gönderimi: Resend; barındırma sağlayıcısı) saklanabilir ve işlenebilir.",
        "Kişisel verileriniz bu altyapı sağlayıcıları dışında üçüncü kişilerle paylaşılmaz; pazarlama amacıyla hiçbir üçüncü tarafa aktarılmaz.",
      ],
    },
    {
      heading: "Saklama Süresi",
      paragraphs: [
        "Demo talepleri, talebin değerlendirilmesi için gerekli süre boyunca saklanır. Hesap verileriniz, hesabınız açık olduğu sürece ve sonrasında yalnızca yasal yükümlülüklerin gerektirdiği süre boyunca tutulur. Talebiniz üzerine verileriniz silinir.",
      ],
    },
    {
      heading: "KVKK m.11 Kapsamındaki Haklarınız",
      bullets: [
        "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
        "İşlenmişse buna ilişkin bilgi talep etme",
        "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
        "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
        "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
        "Silinmesini veya yok edilmesini isteme",
        "Otomatik sistemlerce analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
        "Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
      ],
      paragraphs: [
        "Bu haklarınızı kullanmak için info@otellio.com adresine e-posta gönderebilirsiniz; başvurunuz en geç 30 gün içinde yanıtlanır.",
      ],
    },
  ],
  backToHome: "Anasayfaya dön",
};

export const privacyPage: LegalPageContent = {
  title: "Gizlilik Politikası",
  updatedAt: "Son güncelleme: 19 Temmuz 2026",
  intro:
    "Otellio, verilerinizi yalnızca size doluluk tahmini ve fiyat önerisi hizmeti sunmak için kullanır. Bu politika; hangi verileri topladığımızı, nasıl koruduğumuzu ve hangi hizmet sağlayıcılarla çalıştığımızı açıklar.",
  sections: [
    {
      heading: "Topladığımız Veriler",
      paragraphs: [
        "Demo formu üzerinden ilettiğiniz iletişim bilgileri, panel hesabınıza dair bilgiler (e-posta, tesis bilgileri) ve panele yüklediğiniz rezervasyon verileri (tarih, satılan oda sayısı, gelir) tarafımızca saklanır. Rezervasyon verileri misafir bilgisi içermez.",
        "Yüklediğiniz veriler yalnızca sizin tesisinize tahmin ve öneri üretmek için kullanılır; başka otellerle veya üçüncü kişilerle paylaşılmaz, karşılaştırma ya da pazarlama amacıyla kullanılmaz.",
      ],
    },
    {
      heading: "Çerezler",
      paragraphs: [
        "Otellio yalnızca hizmetin çalışması için zorunlu çerezleri kullanır: giriş oturumunuzu sürdüren kimlik doğrulama çerezleri ve panel tercihlerinizi hatırlayan çerezler. Reklam, takip veya üçüncü taraf analitik çerezi kullanılmaz.",
      ],
    },
    {
      heading: "Veri Güvenliği",
      paragraphs: [
        "Tüm bağlantılar şifrelidir (HTTPS). Veritabanı erişimi hesap bazında yetkilendirme (satır seviyesinde erişim kontrolü) ile korunur; her kullanıcı yalnızca kendi tesisinin verisine erişebilir.",
      ],
    },
    {
      heading: "Çalıştığımız Hizmet Sağlayıcılar",
      bullets: [
        "Supabase — veritabanı ve kimlik doğrulama altyapısı",
        "Resend — işlemsel e-posta gönderimi (giriş, şifre sıfırlama, haftalık rapor)",
        "Barındırma sağlayıcısı — uygulamanın yayınlandığı sunucu altyapısı",
      ],
      paragraphs: [
        "Bu sağlayıcıların sunucuları yurt dışında bulunabilir. Verileriniz bu sağlayıcılarda yalnızca hizmetin sunulması amacıyla işlenir.",
      ],
    },
    {
      heading: "Değişiklikler ve İletişim",
      paragraphs: [
        "Bu politikada yapılacak değişiklikler bu sayfada yayımlanır. Sorularınız ve veri silme talepleriniz için info@otellio.com adresine yazabilirsiniz.",
      ],
    },
  ],
  backToHome: "Anasayfaya dön",
};
