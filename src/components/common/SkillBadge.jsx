import React from 'react';

const SkillBadge = ({ name }) => {
  return (
    <span className="spring-hover px-3 py-1 rounded-full text-sm border border-line bg-paper text-ink-soft font-mono inline-block m-1 cursor-default hover:border-teal hover:text-teal hover:bg-teal-soft">
      {name}
    </span>
  );
};

export default SkillBadge;
