/* eslint-disable @next/next/no-img-element */

/**
 * Photo banner for inner pages.
 * Travel photos are portrait, so on desktop the full photo sits in a framed card beside the text,
 * over a blurred copy of itself. On mobile the photo is the background.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  position = 'center',
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  position?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep">
      {/* background: sharp on mobile, blurred on desktop */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover md:blur-2xl md:brightness-75"
        style={{ objectPosition: position }}
      />
      <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />

      <div className="container grid items-end gap-10 pb-12 pt-24 md:min-h-[480px] md:grid-cols-[1.4fr_1fr] md:items-center md:py-16 lg:gap-16">
        <div className="flex flex-col gap-5">
          <span className="glass inline-flex w-fit items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white rtl:text-sm rtl:tracking-normal">
            {eyebrow}
          </span>
          <h1 className="text-shadow text-balance text-4xl font-extrabold leading-[1.08] text-white md:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && <p className="text-shadow max-w-2xl text-lg leading-relaxed text-white/85">{subtitle}</p>}
          {children}
        </div>

        <div className="relative hidden justify-self-end md:block">
          <div className="absolute -inset-3 -z-10 rotate-3 rounded-[2rem] bg-orange/30" aria-hidden="true" />
          <div className="aspect-[4/5] w-[260px] overflow-hidden rounded-[1.75rem] border border-white/20 shadow-2xl lg:w-[320px]">
            <img src={image} alt="" className="h-full w-full object-cover" style={{ objectPosition: position }} />
          </div>
        </div>
      </div>
    </section>
  );
}
