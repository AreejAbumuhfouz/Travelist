# Travelist — Abdallah Yacoub

Personal website for Jordanian travel content creator **Abdallah Yacoub Alzyoud (Travelist_2)**.

- Pages: **Home, About, Work with me, Blog, Contact** (+ downloadable media kit PDF)
- Two languages: **English (default)** at `/en`, **Arabic (RTL)** at `/ar`
- **Light / dark** theme (follows the device, remembered per visitor)
- Fully responsive, with a **bottom tab bar** on mobile
- **Admin dashboard** at `/admin` with login:
  - Blog posts (English + Arabic, drafts, cover images, categories)
  - Website content (hero text, About text, numbers, contact details, social links)
  - Gallery (travel photos on Home and About, captions in both languages)
  - Contact-form inbox (mark read, reply by email/WhatsApp, delete)
  - Media library (image uploads stored in the database)
  - Change password

Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · PostgreSQL (`pg`) · JWT session cookies (`jose`) · `bcryptjs`.

---

## 1. Run locally

Requirements: Node.js 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env        # then fill in the values
npm run db:setup            # creates tables, the admin account and 2 sample posts
npm run dev                 # http://localhost:3000
```

Admin: http://localhost:3000/admin, using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.
Set `SEED_SAMPLE=false` before `db:setup` if you don't want the sample posts.

## 2. Deploy (Vercel + Neon, both have free plans)

1. Create a database on **neon.tech** (or Supabase) and copy the connection string.
2. Push this folder to a GitHub repository.
3. On **vercel.com** → *Add New Project* → import the repo.
4. Add the environment variables from `.env.example`:
   `DATABASE_URL`, `DATABASE_SSL=true`, `JWT_SECRET` (long random string), `NEXT_PUBLIC_SITE_URL`.
5. Deploy.
6. Create the tables and admin once, from your computer, with the same `DATABASE_URL`:
   ```bash
   npm run db:setup
   ```
7. Connect the domain in Vercel → *Settings → Domains*.

Any Node host works too (Railway, Render, a VPS): `npm run build && npm start`.

## 3. Writing blog posts

Posts use simple formatting:

| Write | Result |
| --- | --- |
| `## Heading` / `### Subheading` | headings |
| `**bold**`, `*italic*` | bold, italic |
| `- item` / `1. step` | lists |
| `> text` | quote |
| `[text](https://…)` | link |
| *Insert image* button | uploads and adds the image |

Leave an empty line between paragraphs. If one language is empty, the other language is shown.

## 4. Project structure

```
app/(site)/[locale]/     public pages (home, about, blog, blog/[slug], contact)
app/admin/               login + dashboard (posts, content, messages, media, settings)
app/api/media/           image upload + serving
components/              header, bottom nav, footer, cards, admin UI
lib/                     i18n texts, content defaults, db, auth, markdown
scripts/setup-db.mjs     database setup
public/brand/            logo files (light + dark versions)
```

- UI texts (buttons, labels) for both languages: `lib/i18n.ts`
- Editable content defaults + exhibitions, programs, audience and top-content figures: `lib/content.ts`
- Media kit PDF: `public/media-kit/` (replace the file, or change its link in Admin → Content)
- Shipped travel photos: `public/images/gallery/` (added to the gallery by `npm run db:setup`)
- Brand colors: `app/globals.css` and `tailwind.config.ts` (navy `#183153`, orange `#F08335`)
