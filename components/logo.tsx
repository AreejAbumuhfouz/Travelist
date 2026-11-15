/* eslint-disable @next/next/no-img-element */

/** Horizontal lockup for the header: the T-plane mark + wordmark. Swaps colors in dark mode. */
export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const h = size === 'lg' ? 'h-11' : 'h-9 md:h-10';
  return (
    <span className="flex items-center gap-2.5" dir="ltr">
      <img src="/brand/logo-icon.png" alt="" className={`${h} w-auto dark:hidden`} />
      <img src="/brand/logo-icon-dark.png" alt="" className={`${h} hidden w-auto dark:block`} />
      <span className="text-[22px] font-extrabold leading-none tracking-tight text-heading md:text-2xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Travel
        <span className="relative inline-block">
          ı
          <span className="absolute left-1/2 top-[0.04em] h-[0.27em] w-[0.27em] -translate-x-1/2 rounded-full bg-orange" aria-hidden="true" />
        </span>
        st
      </span>
    </span>
  );
}

/** Full stacked logo (as designed) for the footer and login page. */
export function LogoFull({ className = 'h-24 w-auto' }: { className?: string }) {
  return (
    <>
      <img src="/brand/logo-full.png" alt="Travelist — Travel Creator" className={`${className} dark:hidden`} />
      <img src="/brand/logo-full-dark.png" alt="Travelist — Travel Creator" className={`${className} hidden dark:block`} />
    </>
  );
}
