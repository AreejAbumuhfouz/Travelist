// Creates the database tables, the first admin account and (optionally) two sample posts.
// Run once after setting DATABASE_URL:  npm run db:setup
// Safe to run again: it never deletes data.
import pg from 'pg';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const { DATABASE_URL, DATABASE_SSL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, SEED_SAMPLE } = process.env;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title_en     TEXT NOT NULL DEFAULT '',
  title_ar     TEXT NOT NULL DEFAULT '',
  excerpt_en   TEXT NOT NULL DEFAULT '',
  excerpt_ar   TEXT NOT NULL DEFAULT '',
  content_en   TEXT NOT NULL DEFAULT '',
  content_ar   TEXT NOT NULL DEFAULT '',
  cover_image  TEXT,
  category     TEXT NOT NULL DEFAULT 'Travel',
  published    BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published, published_at DESC);

CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT PRIMARY KEY,
  value_en   TEXT NOT NULL DEFAULT '',
  value_ar   TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename   TEXT NOT NULL,
  mime       TEXT NOT NULL,
  size       INTEGER NOT NULL,
  data       BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery (
  id         SERIAL PRIMARY KEY,
  image      TEXT NOT NULL,
  caption_en TEXT NOT NULL DEFAULT '',
  caption_ar TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

// Photos shipped in public/images/gallery (keep in sync with lib/gallery.ts)
const galleryDefaults = [
  ['/images/gallery/bali-kelingking.jpg', 'Kelingking Beach, Nusa Penida', 'شاطئ كلينكينغ، نوسا بينيدا'],
  ['/images/gallery/istanbul-bosphorus.jpg', 'The Bosphorus at night, Istanbul', 'البوسفور ليلًا، إسطنبول'],
  ['/images/gallery/london-leicester-square.jpg', 'Leicester Square, London', 'ليستر سكوير، لندن'],
  ['/images/gallery/bali-waterfall.jpg', 'Hidden waterfall, Bali', 'شلال مخفي، بالي'],
  ['/images/gallery/istanbul-tram.jpg', 'Taksim–Tünel tram, Istanbul', 'ترام تقسيم، إسطنبول'],
  ['/images/gallery/bali-lempuyang-stairs.jpg', 'Lempuyang Temple, Bali', 'معبد ليمبويانغ، بالي'],
  ['/images/gallery/istanbul-ortakoy.jpg', 'Ortaköy Mosque, Istanbul', 'جامع أورتاكوي، إسطنبول'],
  ['/images/gallery/cairo-airport.jpg', 'Arriving in Cairo', 'الوصول إلى القاهرة'],
  ['/images/gallery/istanbul-galata.jpg', 'Street life, Istanbul', 'من شوارع إسطنبول'],
  ['/images/gallery/amman-airport.jpg', 'Departures, Amman', 'لحظة السفر من عمّان'],
  ['/images/gallery/bali-lempuyang-gate.jpg', 'Gates of Heaven, Bali', 'بوابات السماء، بالي'],
  ['/images/gallery/heritage-visit.jpg', 'Heritage visit', 'زيارة تراثية'],
];

const samples = [
  {
    slug: 'stay-connected-abroad-esim',
    category: 'Tips',
    titleEn: 'How to stay connected abroad with an eSIM',
    titleAr: 'كيف تبقى متصلًا بالإنترنت في السفر باستخدام eSIM',
    excerptEn: 'Skip roaming bills and airport SIM queues. A simple checklist for setting up an eSIM before you fly.',
    excerptAr: 'تخلّص من فواتير التجوال وطوابير شرائح المطار. قائمة بسيطة لتفعيل الـ eSIM قبل السفر.',
    contentEn: `An eSIM is a digital SIM card that lives inside your phone. Instead of buying a physical card at the airport, you install a data plan before you travel and switch it on when you land.

## Before you buy
- Check that your phone supports eSIM and is **carrier-unlocked**.
- Choose a plan that covers every country on your route.
- Compare the data amount with how long you will stay.

## Setting it up
1. Install the eSIM at home while you have Wi-Fi.
2. Keep your main SIM on for calls and WhatsApp verification codes.
3. Turn on data roaming for the eSIM line only when you arrive.

> Tip: take a screenshot of the QR code and installation steps in case you need them offline.`,
    contentAr: `الـ eSIM شريحة رقمية موجودة داخل هاتفك. بدل شراء شريحة من المطار، تثبّت باقة الإنترنت قبل السفر وتفعّلها عند الوصول.

## قبل الشراء
- تأكد أن هاتفك يدعم eSIM و**غير مقفل على شركة اتصالات**.
- اختر باقة تغطي كل الدول في رحلتك.
- قارن حجم الباقة مع مدة إقامتك.

## خطوات التفعيل
1. ثبّت الـ eSIM في البيت وأنت متصل بالواي فاي.
2. أبقِ شريحتك الأساسية مفعّلة للمكالمات ورموز التحقق في واتساب.
3. فعّل التجوال على خط الـ eSIM فقط عند وصولك.

> نصيحة: احفظ صورة لرمز QR وخطوات التثبيت لتستخدمها بدون إنترنت.`,
  },
  {
    slug: 'first-time-wadi-rum-tips',
    category: 'Destinations',
    titleEn: 'First time in Wadi Rum? Read this first',
    titleAr: 'أول زيارة لوادي رم؟ اقرأ هذا أولًا',
    excerptEn: 'What to pack, when to go and how to make the most of a night under the desert stars in southern Jordan.',
    excerptAr: 'ماذا تحزم، ومتى تذهب، وكيف تستمتع بليلة تحت نجوم الصحراء في جنوب الأردن.',
    contentEn: `Wadi Rum is one of Jordan's most iconic landscapes: red sand, huge sandstone mountains and some of the clearest night skies in the region.

## When to go
Spring and autumn bring warm days and cool nights. Summer days are very hot, and winter nights can drop close to freezing.

## What to pack
- A warm layer for the night, even in spring
- Sunscreen, sunglasses and a scarf for the wind and sand
- A power bank — many camps have limited charging

## Make the most of it
Book a jeep tour for sunset, stay at least one night in a camp, and step away from the lights to see the stars.`,
    contentAr: `وادي رم من أشهر المناظر الطبيعية في الأردن: رمال حمراء، وجبال رملية ضخمة، وسماء ليلية من الأصفى في المنطقة.

## متى تذهب
الربيع والخريف أيامهما دافئة ولياليهما لطيفة. الصيف حار جدًا نهارًا، وليالي الشتاء قد تقترب من التجمد.

## ماذا تحزم
- ملابس دافئة لليل حتى في الربيع
- واقي شمس ونظارات شمسية ووشاح للرياح والرمال
- باور بانك، فبعض المخيمات فيها شحن محدود

## استمتع بالتجربة
احجز جولة جيب وقت الغروب، وابقَ ليلة واحدة على الأقل في مخيم، وابتعد عن الأضواء لترى النجوم.`,
  },
];

try {
  await client.connect();
  await client.query(schema);
  console.log('✔ Tables ready');

  const email = (ADMIN_EMAIL || 'admin@travelist.local').toLowerCase().trim();
  let password = ADMIN_PASSWORD;
  const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount === 0) {
    if (!password) {
      password = crypto.randomBytes(9).toString('base64url');
      console.log(`! ADMIN_PASSWORD not set — generated one: ${password}`);
    }
    const hash = await bcrypt.hash(password, 12);
    await client.query('INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3)', [email, ADMIN_NAME || 'Admin', hash]);
    console.log(`✔ Admin created: ${email}`);
  } else {
    console.log(`✔ Admin already exists: ${email} (password unchanged)`);
  }

  if (SEED_SAMPLE !== 'false') {
    const { rows } = await client.query('SELECT count(*)::int AS n FROM posts');
    if (rows[0].n === 0) {
      for (const p of samples) {
        await client.query(
          `INSERT INTO posts (slug, category, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, published, published_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true,now())`,
          [p.slug, p.category, p.titleEn, p.titleAr, p.excerptEn, p.excerptAr, p.contentEn, p.contentAr],
        );
      }
      console.log(`✔ Added ${samples.length} sample posts (edit or delete them from the admin)`);
    }
  }
  const g = await client.query('SELECT count(*)::int AS n FROM gallery');
  if (g.rows[0].n === 0) {
    let i = 0;
    for (const [image, en, ar] of galleryDefaults) {
      await client.query('INSERT INTO gallery (image, caption_en, caption_ar, sort) VALUES ($1,$2,$3,$4)', [image, en, ar, i++ * 10]);
    }
    console.log(`✔ Added ${galleryDefaults.length} gallery photos`);
  }
  console.log('Done.');
} catch (e) {
  console.error('Setup failed:', e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
