import React from 'react';

const SkillBadge = ({ name, level = "primary" }) => {
  const colors = {
    primary: "skill-badge-emerald bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    secondary: "skill-badge-cyan bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    tertiary: "skill-badge-amber bg-amber-500/20 text-amber-300 border-amber-500/30"
  };
  
  return (
    <span className={`skill-badge px-3 py-1 rounded-full text-sm border ${colors[level]} font-mono inline-block m-1 cursor-default`}>
      {name}
    </span>
  );
};

export default SkillBadge;
