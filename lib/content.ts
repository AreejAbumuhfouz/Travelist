import { query } from './db';
import type { Locale } from './i18n';

export type ContentField = {
  key: string;
  label: string;
  group: string;
  multiline?: boolean;
  shared?: boolean; // same value for both languages (URLs, numbers, contact info)
  en: string;
  ar: string;
};

/** Every editable piece of site text. Defaults are used until the admin saves a new value. */
export const CONTENT_FIELDS: ContentField[] = [
  { key: 'hero_title', group: 'Home – Hero', label: 'Hero title', en: 'Travel stories that move audiences.', ar: 'قصص سفر تُلهم الملايين.' },
  {
    key: 'hero_subtitle', group: 'Home – Hero', label: 'Hero subtitle', multiline: true,
    en: "I'm Abdallah Yacoub Alzyoud, the Jordanian travel creator behind Travelist_2. I explore destinations, hotels and experiences around the world and turn them into practical, Arabic-first travel stories.",
    ar: 'أنا عبدالله يعقوب الزيود، صانع محتوى سياحي أردني وصاحب حساب Travelist_2. أستكشف الوجهات والفنادق والتجارب حول العالم وأحوّلها إلى قصص سفر عملية بالعربية.',
  },
  { key: 'hero_image', group: 'Home – Hero', label: 'Hero photo URL', shared: true, en: '/images/gallery/bali-lempuyang-gate.jpg', ar: '/images/gallery/bali-lempuyang-gate.jpg' },

  { key: 'stat_followers', group: 'Numbers', label: 'Total followers (all platforms)', shared: true, en: '290K+', ar: '290K+' },
  { key: 'stat_views', group: 'Numbers', label: 'Monthly views', shared: true, en: '12M+', ar: '12M+' },
  { key: 'stat_million', group: 'Numbers', label: 'Videos over 1M views', shared: true, en: '70+', ar: '70+' },
  { key: 'ig_followers', group: 'Numbers', label: 'Instagram followers', shared: true, en: '219K+', ar: '219K+' },
  { key: 'fb_followers', group: 'Numbers', label: 'Facebook followers', shared: true, en: '39K+', ar: '39K+' },
  { key: 'threads_followers', group: 'Numbers', label: 'Threads followers', shared: true, en: '33K+', ar: '33K+' },

  {
    key: 'about_title', group: 'About page', label: 'About title',
    en: 'Exploring the world — and sharing it the way travelers need it.',
    ar: 'أستكشف العالم، وأشاركه كما يحتاجه المسافر.',
  },
  {
    key: 'about_body', group: 'About page', label: 'About text', multiline: true,
    en: "I'm Abdallah Yacoub Alzyoud, a Jordanian travel content creator, digital influencer and travel media presenter, known online as Travelist_2.\n\nI specialise in exploring destinations around the world and documenting travel experiences in a style that combines useful travel information, professional photography and digital storytelling.\n\nMy content helps travelers discover destinations, hotels and experiences. I also collaborate with tourism organisations and brands, and provide media coverage of international exhibitions and events. I'm a member of the Arab Tourism Media Club.",
    ar: 'أنا عبدالله يعقوب الزيود، صانع محتوى سياحي أردني ومؤثر رقمي ومقدم تغطيات سياحية وإعلامية، وأُعرف على المنصات باسم Travelist_2.\n\nأتخصص في استكشاف الوجهات السياحية حول العالم وتوثيق تجارب السفر بأسلوب يجمع بين المعلومات السياحية والتصوير الاحترافي وصناعة المحتوى الرقمي.\n\nأقدّم محتوى يساعد المسافرين على اكتشاف الوجهات والفنادق والتجارب السياحية، وأتعاون مع المؤسسات السياحية والعلامات التجارية، إلى جانب التغطية الإعلامية للمعارض والفعاليات الدولية. وأنا عضو في نادي الإعلام السياحي العربي.',
  },
  { key: 'about_image', group: 'About page', label: 'About photo URL', shared: true, en: '/images/abdallah.jpg', ar: '/images/abdallah.jpg' },

  { key: 'contact_phone', group: 'Contact & social', label: 'Phone / WhatsApp (international format)', shared: true, en: '+962 79 795 5218', ar: '+962 79 795 5218' },
  { key: 'contact_email', group: 'Contact & social', label: 'Business email (leave empty to hide)', shared: true, en: 'travilistturkey@gmail.com', ar: 'travilistturkey@gmail.com' },
  { key: 'instagram_url', group: 'Contact & social', label: 'Instagram URL', shared: true, en: 'https://www.instagram.com/travelist_2/', ar: 'https://www.instagram.com/travelist_2/' },
  { key: 'facebook_url', group: 'Contact & social', label: 'Facebook URL', shared: true, en: 'https://www.facebook.com/share/1EPUMi3TkY/', ar: 'https://www.facebook.com/share/1EPUMi3TkY/' },
  { key: 'threads_url', group: 'Contact & social', label: 'Threads URL', shared: true, en: 'https://www.threads.com/@travelist_2', ar: 'https://www.threads.com/@travelist_2' },
  { key: 'linkedin_url', group: 'Contact & social', label: 'LinkedIn URL (leave empty to hide)', shared: true, en: 'https://www.linkedin.com/in/abdallah-yacoub-travelist', ar: 'https://www.linkedin.com/in/abdallah-yacoub-travelist' },
  { key: 'media_kit_url', group: 'Contact & social', label: 'Media kit PDF URL', shared: true, en: '/media-kit/Travelist_2_Media_Kit_2026.pdf', ar: '/media-kit/Travelist_2_Media_Kit_2026.pdf' },
];

export type SiteContent = Record<string, string>;

export async function getAllContentRows() {
  try {
    return await query<{ key: string; value_en: string; value_ar: string }>('SELECT key, value_en, value_ar FROM site_content');
  } catch (e) {
    console.error('[content] falling back to defaults:', (e as Error).message);
    return [];
  }
}

export async function getContent(locale: Locale): Promise<SiteContent> {
  const rows = await getAllContentRows();
  const saved = new Map(rows.map((r) => [r.key, r]));
  const out: SiteContent = {};
  for (const f of CONTENT_FIELDS) {
    const row = saved.get(f.key);
    const value = row ? (locale === 'ar' && !f.shared ? row.value_ar : row.value_en) : locale === 'ar' ? f.ar : f.en;
    out[f.key] = value ?? '';
  }
  return out;
}

type L = Record<Locale, string>;

/** Brand programs and collaborations, described exactly as Abdallah describes them. */
export const PROGRAMS: { name: string; desc: L }[] = [
  {
    name: 'Skyscanner',
    desc: {
      en: 'Affiliate program promoting flight search, hotels and travel bookings.',
      ar: 'برنامج التسويق بالعمولة للترويج لخدمات البحث عن رحلات الطيران والفنادق وحجوزات السفر.',
    },
  },
  {
    name: 'Holafly',
    desc: {
      en: 'Promoting travel internet and eSIM plans, with a special discount code for followers.',
      ar: 'الترويج لخدمات الإنترنت وشرائح eSIM للمسافرين، مع رمز خصم خاص للمتابعين.',
    },
  },
  {
    name: 'GetYourGuide',
    desc: {
      en: 'Promoting tours, activities and travel experiences through the partner program.',
      ar: 'الترويج للأنشطة والجولات والتجارب السياحية من خلال برنامج الشركاء.',
    },
  },
  {
    name: 'Temu',
    desc: {
      en: 'Member of the Temu Influencer Program for advertising and product marketing.',
      ar: 'عضو في برنامج المؤثرين (Temu Influencer Program) للتعاون الإعلاني والتسويق للمنتجات.',
    },
  },
  {
    name: 'Hotels & restaurants',
    desc: {
      en: 'Coverage and promotional content for hotels and restaurants in destinations around the world.',
      ar: 'تغطيات ومحتوى ترويجي لفنادق ومطاعم في وجهات سياحية مختلفة.',
    },
  },
];

export const PARTNER_NAMES = ['Skyscanner', 'Holafly', 'GetYourGuide', 'Temu'];

export const EXHIBITIONS: { code: string; date: L; name: L; place: L; role: L }[] = [
  {
    code: 'TR',
    date: { en: 'Oct 29, 2025', ar: '29 أكتوبر 2025' },
    name: { en: 'International Antalya Tourism Fair', ar: 'معرض أنطاليا الدولي للسياحة' },
    place: { en: 'Antalya, Türkiye', ar: 'أنطاليا، تركيا' },
    role: { en: 'Exhibitor with Alrehla Paths Media', ar: 'المشاركة بصفة عارض ضمن Alrehla Paths Media' },
  },
  {
    code: 'QA',
    date: { en: 'Oct 12–14, 2025', ar: '12–14 أكتوبر 2025' },
    name: { en: 'Cityscape Qatar 2025', ar: 'معرض Cityscape Qatar 2025' },
    place: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    role: { en: 'Media participation and event coverage', ar: 'المشاركة بصفة إعلامية وتغطية فعاليات المعرض' },
  },
  {
    code: 'EG',
    date: { en: '2025', ar: '2025' },
    name: { en: 'Cityscape Egypt 2025', ar: 'معرض Cityscape Egypt 2025' },
    place: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' },
    role: { en: 'Media participation', ar: 'المشاركة بصفة إعلامية' },
  },
  {
    code: 'AE',
    date: { en: 'Apr 28 – May 1, 2025', ar: '28 أبريل – 1 مايو 2025' },
    name: { en: 'Arabian Travel Market (ATM) Dubai 2025', ar: 'معرض سوق السفر العربي ATM Dubai 2025' },
    place: { en: 'Dubai, UAE', ar: 'دبي، الإمارات العربية المتحدة' },
    role: { en: 'Media coverage with Alrehla newspaper', ar: 'المشاركة بصفة إعلامية وتغطية الفعاليات بالتعاون مع جريدة الرحلة' },
  },
];

export const MEDIA_ORGS: L[] = [
  { en: 'Alrehla newspaper', ar: 'جريدة الرحلة' },
  { en: 'Masahat newspaper', ar: 'جريدة مساحات' },
  { en: 'Arab Tourism Media Club', ar: 'نادي الإعلام السياحي العربي' },
];

/** From the Hospitality Media Kit 2026 (Instagram Insights, October 2026). */
export const AUDIENCE = {
  arabic: '75.3%',
  ages: '70.4%',
  women: '57.3%',
  men: '42.7%',
  markets: [
    { name: { en: 'Iraq', ar: 'العراق' }, value: 21.4 },
    { name: { en: 'Saudi Arabia', ar: 'السعودية' }, value: 7.9 },
    { name: { en: 'Egypt', ar: 'مصر' }, value: 7.9 },
    { name: { en: 'Kuwait', ar: 'الكويت' }, value: 7.4 },
    { name: { en: 'Morocco', ar: 'المغرب' }, value: 6.3 },
  ],
};

export const TOP_CONTENT: { views: string; kind: L; title: L; note: L; image: string }[] = [
  {
    views: '5.34M',
    kind: { en: 'Travel tip', ar: 'نصيحة سفر' },
    title: { en: 'Local price discovery Reel', ar: 'ريل اكتشاف الأسعار المحلية' },
    note: { en: 'Highest-performing Reel', ar: 'الريل الأعلى أداءً' },
    image: '', // add the Reel's cover image path here
  },
  {
    views: '1.04M',
    kind: { en: 'Destination feature', ar: 'ترويج لوجهة' },
    title: { en: 'Hujrah Village', ar: 'قرية حجرة' },
    note: { en: 'Tourism collaboration', ar: 'تعاون سياحي' },
    image: '', // add the Reel's cover image path here
  },
  {
    views: '693.8K',
    kind: { en: 'Travel guide', ar: 'دليل سفر' },
    title: { en: 'Queen Alia Airport', ar: 'مطار الملكة علياء' },
    note: { en: '5.2K sends · 1.2K saves', ar: '5.2 ألف مشاركة · 1.2 ألف حفظ' },
    image: '', // add the Reel's cover image path here
  },
  {
    views: '571.7K',
    kind: { en: 'Hotel review', ar: 'مراجعة فندق' },
    title: { en: 'Damascus stay feature', ar: 'تجربة إقامة في دمشق' },
    note: { en: '6.2K comments', ar: '6.2 ألف تعليق' },
    image: '', // add the Reel's cover image path here
  },
];

export const DESTINATIONS: L[] = [
  { en: 'Bali', ar: 'بالي' },
  { en: 'Istanbul', ar: 'إسطنبول' },
  { en: 'London', ar: 'لندن' },
  { en: 'Cairo', ar: 'القاهرة' },
  { en: 'Dubai', ar: 'دبي' },
  { en: 'Doha', ar: 'الدوحة' },
  { en: 'Antalya', ar: 'أنطاليا' },
  { en: 'Damascus', ar: 'دمشق' },
  { en: 'Amman', ar: 'عمّان' },
];
