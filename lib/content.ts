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
export const loginLabel = "Giriş Yap";
export const loginHref = "/login";

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
  serverError:
    "Talebiniz gönderilemedi. Lütfen daha sonra tekrar deneyin veya bizi e-posta ile bulun.",
  rateLimitError:
    "Kısa süre içinde çok fazla talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.",
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

export const auth = {
  title: "Otel panelinize giriş yapın",
  subtitle: "E-posta ve şifrenizle giriş yaparak doluluk tahmini ve fiyat önerilerinize ulaşın.",
  emailLabel: "E-posta",
  emailPlaceholder: "ornek@otel.com",
  passwordLabel: "Şifre",
  passwordPlaceholder: "••••••••",
  submitLabel: "Giriş Yap",
  submittingLabel: "Giriş yapılıyor...",
  backToHome: "Anasayfaya dön",
  noAccountText: "Henüz hesabınız yok mu?",
  requestDemoLink: "Demo isteyin",
  errors: {
    emailRequired: "Lütfen e-posta adresinizi girin.",
    passwordRequired: "Lütfen şifrenizi girin.",
    invalidCredentials: "E-posta veya şifre hatalı.",
    generic: "Giriş yapılamadı. Lütfen tekrar deneyin.",
  },
};

export const dashboard = {
  brand: "Otellio",
  navItems: [
    { label: "Genel Bakış", href: "/dashboard" },
    { label: "Veri Yükle", href: "/dashboard/veri-yukle" },
    { label: "Doluluk Tahmini", href: "/dashboard/tahmin" },
    { label: "Fiyat Önerisi", href: "/dashboard/fiyat-onerisi" },
    { label: "Ayarlar", href: "/dashboard/ayarlar" },
  ],
  logoutLabel: "Çıkış Yap",
  welcomePrefix: "Hoş geldiniz",
  openMenuLabel: "Menüyü aç",
  closeMenuLabel: "Menüyü kapat",
};

export const overview = {
  title: "Genel Bakış",
  statRoomCount: "Oda Sayısı",
  statLastUpload: "Son Veri Yüklemesi",
  statAvgOccupancy: "Bu Haftaki Ortalama Doluluk Tahmini",
  statAvgPrice: "Ortalama Önerilen Fiyat",
  noDataTitle: "Başlamak için verinizi yükleyin",
  noDataBody:
    "Geçmiş rezervasyon verinizi yükleyerek doluluk tahmini ve fiyat önerilerinize ulaşabilirsiniz.",
  uploadCta: "Veri Yükle",
};

export const hotelSettings = {
  title: "Otel Bilgileri",
  subtitle:
    "Doluluk tahmini ve fiyat önerisi için otelinize dair birkaç temel bilgiye ihtiyacımız var.",
  firstRunNotice:
    "Panele hoş geldiniz. Devam etmeden önce otel bilgilerinizi tamamlayın.",
  nameLabel: "Otel adı",
  namePlaceholder: "Örn. Deniz Manzara Otel",
  roomCountLabel: "Oda sayısı",
  roomCountPlaceholder: "Örn. 45",
  basePriceLabel: "Taban fiyatınız (gecelik, TL)",
  basePriceHint:
    "Fiyat önerileri bu tutara göre hesaplanır; dilediğinizde güncelleyebilirsiniz.",
  basePricePlaceholder: "Örn. 1500",
  saveLabel: "Kaydet",
  savingLabel: "Kaydediliyor...",
  savedMessage: "Bilgileriniz kaydedildi.",
  errors: {
    nameRequired: "Lütfen otel adını girin.",
    nameLength: "Otel adı 2-100 karakter arasında olmalı.",
    roomCountRequired: "Lütfen oda sayısını girin.",
    roomCountRange: "Oda sayısı 1-2000 arasında bir tam sayı olmalı.",
    basePriceRequired: "Lütfen taban fiyatınızı girin.",
    basePriceRange: "Taban fiyat 0'dan büyük olmalı.",
    generic: "Kaydedilemedi. Lütfen tekrar deneyin.",
  },
};

export const dataUpload = {
  title: "Veri Yükle",
  subtitle:
    "Geçmiş rezervasyon verinizi Excel (.xlsx) veya CSV dosyası olarak yükleyin.",
  columnsHint:
    "Dosyanızda şu sütunlar olmalı: Tarih, Satılan Oda Sayısı. İsteğe bağlı olarak Gelir sütunu da eklenebilir.",
  dropzoneLabel: "Dosyayı buraya sürükleyin veya seçmek için tıklayın",
  dropzoneHint: "En fazla 5 MB, .xlsx veya .csv, en fazla 5.000 satır",
  chooseFileLabel: "Dosya Seç",
  parsingLabel: "Dosya okunuyor...",
  previewTitle: "Önizleme",
  rowsFoundSuffix: "satır bulundu.",
  skippedRowsSuffix: "satır, eksik/hatalı veri nedeniyle atlandı.",
  saveLabel: "Kaydet",
  savingLabel: "Kaydediliyor...",
  savedPrefix: "Kaydedildi:",
  savedSuffix: "satır güncellendi.",
  columnDate: "Tarih",
  columnRoomsSold: "Satılan Oda",
  columnRevenue: "Gelir",
  errors: {
    fileTooLarge: "Dosya 5 MB sınırını aşıyor.",
    tooManyRows:
      "Dosyada 5.000'den fazla satır var. Lütfen daha küçük bir dosya yükleyin.",
    noValidRows:
      "Dosyada geçerli satır bulunamadı. Sütun adlarını ve veri biçimini kontrol edin.",
    parseFailed:
      "Dosya okunamadı. Lütfen geçerli bir Excel veya CSV dosyası yükleyin.",
    saveFailed: "Veriler kaydedilemedi. Lütfen tekrar deneyin.",
    unsupportedType: "Yalnızca .xlsx veya .csv dosyaları desteklenir.",
  },
};

export const forecastPage = {
  title: "Doluluk Tahmini",
  subtitle: "Önümüzdeki günler için tahmini doluluk oranınız.",
  rangeLabel: "Gösterilecek dönem",
  range30: "30 gün",
  range60: "60 gün",
  range90: "90 gün",
  chartOccupancyLabel: "Tahmini Doluluk (%)",
  chartRangeLabel: "Tahmin Aralığı",
  tableTitle: "Günlük Detay",
  columnDate: "Tarih",
  columnOccupancy: "Tahmini Doluluk",
  columnRange: "Aralık",
  insufficientDataTitle: "Henüz yeterli veri yok",
  insufficientDataBody:
    "Anlamlı bir tahmin oluşturabilmemiz için en az 14 günlük geçmiş rezervasyon verisi gerekiyor. Veri Yükle sayfasından dosyanızı ekleyin.",
  uploadCta: "Veri Yükle",
  disclaimer:
    "Bu rakamlar geçmiş verinize dayalı bir tahmindir; resmi tatiller ve beklenmedik talep değişimlerini yansıtmayabilir.",
};

export const priceSuggestionPage = {
  title: "Fiyat Önerisi",
  subtitle: "Tahmini doluluğunuza göre önerilen gecelik fiyatlar.",
  columnDate: "Tarih",
  columnOccupancy: "Tahmini Doluluk",
  columnSuggestedPrice: "Önerilen Fiyat",
  basePriceLabel: "Taban fiyatınız",
  editBasePriceLink: "Ayarlar'dan düzenleyin",
  disclaimer:
    "Bu fiyatlar bir öneridir, garanti değildir; son kararı her zaman siz verirsiniz.",
  insufficientDataTitle: "Henüz yeterli veri yok",
  insufficientDataBody:
    "Fiyat önerisi oluşturabilmemiz için önce Veri Yükle sayfasından geçmiş rezervasyon verinizi eklemeniz gerekiyor.",
  uploadCta: "Veri Yükle",
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
