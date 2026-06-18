import React from 'react';

export const DetailList = ({ items, renderItem }) => {
  return (
    <div className="grid w-full gap-3">
      {items.map((item, index) => (
        <div
          key={item?.title || item || index}
          className="rounded-2xl border border-black/10 bg-[#f4f1e8] p-4 text-sm font-medium leading-6 text-black/72"
        >
          {renderItem ? (
            renderItem(item, index)
          ) : (
            <p className="flex gap-3">
              <span className="font-black text-black">{String(index + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

const ProfileCard = ({
  kicker,
  title,
  subtitle,
  description,
  tags = [],
  cta,
  children,
}) => {
  return (
    <article className="bento-card grid gap-6 bg-white p-5 min-[560px]:grid-cols-[240px_minmax(0,1fr)] md:p-7 lg:grid-cols-[430px_minmax(0,1fr)]">
      <div className="w-full max-w-[430px]">
        <p className="section-kicker">{kicker}</p>
        <h3 className="mt-4 text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl min-[560px]:text-[1.35rem] lg:text-[clamp(1.5rem,1.8vw,1.9rem)]">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-3 text-base font-black text-black/60">{subtitle}</p>
        )}
        {description && (
          <p className="mt-4 rounded-2xl border border-black/10 bg-[#f4f1e8] p-4 text-sm font-bold leading-6 text-black">
            {description}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/15 bg-[#dff8ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {cta && (
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-black bg-black px-4 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            {cta.label}
          </a>
        )}
      </div>
      {children}
    </article>
  );
};

export default ProfileCard;
