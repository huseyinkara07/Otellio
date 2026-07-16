// Tek Türkçe içerik kaynağı. Pazarlama metinleri PRD Bölüm 11'den birebir alınmıştır.
// Form alan etiketleri/hata mesajları PRD'de örnek olarak verilen tona (Bölüm 7) uyularak buradan yönetilir.

export const siteConfig = {
  name: "Otellio",
  email: "info@otellio.com",
  locale: "tr_TR",
};

export const metadata = {
  title:
    "Otellio — Küçük ve Orta Ölçekli Oteller İçin Doluluk Tahmini ve Fiyat Önerisi",
  description:
    "Antalya'daki bağımsız otel, pansiyon ve apart oteller için sade bir doluluk tahmini ve fiyat önerisi aracı. Excel verinizi yükleyin, 30-90 günlük tahmininizi ve önerilen fiyatlarınızı dakikalar içinde alın.",
};

export const navLinks = [
  { label: "Nasıl Çalışır", href: "#nasil-calisir" },
  { label: "Özellikler", href: "#ozellikler" },
  { label: "Fiyatlandırma", href: "#fiyatlandirma" },
  { label: "SSS", href: "#sss" },
];

export const ctaLabel = "Demo İste";
export const demoAnchor = "#demo";

export const hero = {
  title: "Odanız boş kalmadan önce bilin.",
  subtitle:
    "Geçmiş rezervasyon verinizi yükleyin, önümüzdeki 30-90 gün için doluluk tahmininizi ve önerilen fiyatlarınızı görün. Karmaşık kurulum yok, ilk tahmininizi dakikalar içinde alın.",
  trustLine: "Excel'inizi yükleyin, ilk tahmininizi 10 dakikada görün.",
  cta: ctaLabel,
};

export const problemSolution = {
  title: "Boş oda mı, düşük fiyat mı? İkisi de para kaybettirir.",
  problemTitle: "Bugün nasıl oluyor?",
  problems: [
    "Fiyatları çoğu zaman \"geçen yıl ne yapmıştık\" hissiyle belirliyorsunuz.",
    "Yoğun günleri geç fark edip odayı olması gerekenden ucuza satıyorsunuz.",
    "Sakin dönemleri göremeyip son dakika indirimlerine mecbur kalıyorsunuz.",
  ],
  solutionTitle: "Otellio ile",
  solutions: [
    "Önümüzdeki 30-90 günün doluluğunu önceden görüyorsunuz.",
    "Dolu geçecek günlerde fiyatınızı zamanında yukarı çekiyorsunuz.",
    "Sakin günleri erkenden görüp satışı planlı şekilde artırıyorsunuz.",
  ],
};

export const howItWorks = {
  title: "Üç adımda, dakikalar içinde.",
  steps: [
    {
      number: 1,
      title: "Verinizi yükleyin",
      description: "Elinizdeki Excel veya CSV rezervasyon dosyasını yükleyin.",
    },
    {
      number: 2,
      title: "Tahmininizi alın",
      description: "Önümüzdeki 30-90 gün için doluluk tahmininizi görün.",
    },
    {
      number: 3,
      title: "Fiyatınızı ayarlayın",
      description: "Önerilen fiyatlarla her günü değerine göre satın.",
    },
  ],
};

export const features = {
  title: "İşinizi kolaylaştıran, sade özellikler.",
  items: [
    {
      title: "Doluluk Tahmini",
      description:
        "Gelecek 30-90 gün için gün gün doluluk beklentinizi, tahmin aralığıyla birlikte görün.",
    },
    {
      title: "Fiyat Önerisi",
      description:
        "Her gün için önerilen satış fiyatını alın. Son kararı siz verirsiniz, dilediğinizde değiştirirsiniz.",
    },
    {
      title: "Pazar / Sezon Trend Analizi",
      description:
        "Sezonluk ve haftalık talep hareketlerini görün, yoğun ve sakin dönemleri önceden planlayın.",
    },
    {
      title: "Haftalık E-posta Raporu",
      description:
        "Gelecek dönemin tahmini ve fiyat önerileri her hafta özet halinde e-postanıza gelsin.",
    },
  ],
};

export const founder = {
  title: "Bu aracı, otelin içinden biri geliştirdi.",
  body: "Otellio'yu, Antalya'da iki otelde saha deneyimi olan bir endüstri mühendisi olarak geliştirdim. Doluluğun ve fiyatın ne kadar önemli, tahmin etmenin ne kadar zor olduğunu bizzat yaşadım. Amacım basitti: büyük zincirlerin pahalı sistemlerinde olan tahmin gücünü, sizin de birkaç dakikada kullanabileceğiniz sade bir araca dönüştürmek.",
};

export const pricing = {
  title: "İhtiyacınıza göre, şeffaf paketler.",
  note: "Gösterge fiyatlardır, KDV hariçtir.",
  plans: [
    {
      name: "Başlangıç",
      target: "30 odaya kadar",
      price: "~750–1.000 TL/ay",
      features: ["Doluluk tahmini", "Fiyat önerisi", "Aylık rapor"],
      cta: "Demo İste",
      highlighted: false,
    },
    {
      name: "Standart",
      badge: "En Popüler",
      target: "31–100 oda",
      price: "~1.500–2.500 TL/ay",
      features: [
        "Başlangıç'taki her şey",
        "Pazar/sezon trend analizi",
        "Haftalık e-posta raporu",
      ],
      cta: "Demo İste",
      highlighted: true,
    },
    {
      name: "Kurumsal",
      target: "100+ oda veya çoklu tesis",
      price: "~4.000–6.000 TL/ay veya Bize Ulaşın",
      features: [
        "Standart'taki her şey",
        "Çoklu tesis desteği",
        "Öncelikli destek",
      ],
      cta: "Bize Ulaşın",
      highlighted: false,
    },
  ],
};

export const faq = {
  title: "Sık sorulan sorular",
  items: [
    {
      question: "Kurulum ne kadar sürer?",
      answer:
        "Ayrı bir kurulum gerekmez. Elinizdeki Excel veya CSV dosyasını yüklediğinizde ilk tahmininizi genellikle dakikalar içinde görürsünüz.",
    },
    {
      question: "Verim gerçekten artar mı, nasıl ölçerim?",
      answer:
        "Otellio size gelecekteki doluluğu ve önerilen fiyatları gösterir; kararı siz verirsiniz. Faydayı en iyi, önerilen fiyatları uyguladığınız dönemlerdeki doluluk ve gelirinizi, önceki dönemlerle karşılaştırarak görürsünüz. Kesin gelir garantisi vermiyoruz; size daha iyi karar verme imkânı sunuyoruz.",
    },
    {
      question: "Verilerim güvende mi?",
      answer:
        "Verilerinizi yalnızca size tahmin üretmek için kullanırız. Kişisel ve ticari verileriniz üçüncü kişilerle paylaşılmaz. Talebiniz üzerine verilerinizin silinmesini sağlarız.",
    },
    {
      question: "Mevcut sistemimle / PMS'imle çalışır mı?",
      answer:
        "Başlamak için tek ihtiyacınız geçmiş rezervasyon verinizi Excel veya CSV olarak dışa aktarabilmeniz. Çoğu otel yönetim sistemi bu aktarımı destekler.",
    },
    {
      question: "Teknik bilgim yok, kullanabilir miyim?",
      answer:
        "Evet. Otellio bilerek sade tutuldu. Dosyanızı yüklüyorsunuz, tahmininizi ve fiyat önerinizi anlaşılır bir ekranda görüyorsunuz. Karmaşık dashboard yok.",
    },
  ],
};

export const demo = {
  title: "Otelinize özel bir demo görün.",
  subtitle:
    "Bilgilerinizi bırakın, size uygun bir zamanda Otellio'yu otelinizin verisiyle gösterelim.",
  submitLabel: "Talep Gönder",
  successMessage: "Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.",
  kvkkText:
    "Kişisel verilerimin, demo talebimi değerlendirmek amacıyla işlenmesini kabul ediyorum.",
  kvkkLinkText: "Aydınlatma Metni",
  kvkkError: "Devam etmek için KVKK onayını işaretlemelisiniz.",
  fields: {
    hotelName: {
      label: "Otel adı",
      placeholder: "Örn. Deniz Manzara Otel",
      errorRequired: "Lütfen otel adını girin.",
      errorLength: "Otel adı 2-100 karakter arasında olmalı.",
    },
    roomCount: {
      label: "Oda sayısı",
      placeholder: "Örn. 45",
      errorRequired: "Lütfen oda sayısını girin.",
      errorRange: "Oda sayısı 1-2000 arasında bir tam sayı olmalı.",
    },
    email: {
      label: "E-posta",
      placeholder: "ornek@otel.com",
      errorRequired: "Lütfen e-posta adresinizi girin.",
      errorInvalid: "Lütfen geçerli bir e-posta girin.",
    },
    phone: {
      label: "Telefon",
      placeholder: "Örn. 0532 000 00 00",
      errorRequired: "Lütfen telefon numaranızı girin.",
      errorInvalid: "Lütfen geçerli bir telefon numarası girin.",
    },
    message: {
      label: "Mesaj (opsiyonel)",
      placeholder: "Eklemek istediğiniz bir not var mı?",
      errorLength: "Mesaj en fazla 500 karakter olabilir.",
    },
  },
};

export const footer = {
  tagline:
    "Otellio — küçük ve orta ölçekli oteller için sade doluluk tahmini ve fiyat önerisi.",
  email: siteConfig.email,
  links: navLinks,
  legalLinks: [
    { label: "KVKK Aydınlatma Metni", href: "#" },
    { label: "Gizlilik Politikası", href: "#" },
  ],
  copyright: "© 2026 Otellio. Tüm hakları saklıdır.",
};
