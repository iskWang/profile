import React from 'react';

const SectionHeader = ({ kicker, title, summary }) => {
  return (
    <div className="mb-8 grid gap-5 border-t border-black pt-5 min-[560px]:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[430px_minmax(0,1fr)]">
      <div className="w-full max-w-[430px]">
        <p className="section-kicker">{kicker}</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{title}</h2>
      </div>
      {summary ? (
        <p className="max-w-2xl text-base font-medium leading-7 text-black/62 min-[560px]:pt-2 sm:text-lg sm:leading-8">
          {summary}
        </p>
      ) : (
        <div aria-hidden="true" />
      )}
    </div>
  );
};

export default SectionHeader;
