import React from 'react';
import { UI } from '../../i18n/ui.js';
import { skillInventory } from '../../lib/record.js';
import { Ledger, SectionBar } from '../../components/form';

export default function Skills({ lang }) {
  const ui = UI[lang];
  const inventory = skillInventory(lang);
  return (
    <section id="skills" className="record-part" aria-labelledby="skills-title">
      <SectionBar titleId="skills-title" title={ui.skills.title} count={ui.skills.count(inventory.length)} />
      <Ledger
        caption={ui.skills.caption}
        className="ledger--inventory"
        columns={[
          { key: 'category', label: ui.skills.colCategory, className: 'ledger__category' },
          { key: 'items', label: ui.skills.colItems },
        ]}
        rows={inventory.map((group) => ({
          cells: {
            category: group.label,
            items: (
              <ul className="inventory">
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ),
          },
        }))}
      />
    </section>
  );
}
