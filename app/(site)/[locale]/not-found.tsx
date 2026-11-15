import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-7xl font-extrabold text-orange">404</p>
      <h1 className="text-2xl font-bold text-heading">Page not found · الصفحة غير موجودة</h1>
      <div className="flex gap-3">
        <Link href="/en" className="btn-navy">Home</Link>
        <Link href="/ar" className="btn-ghost">الرئيسية</Link>
      </div>
    </section>
  );
}
