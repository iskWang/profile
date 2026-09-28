import { CONTENT } from '../generated/content.js';

// Highlights that open the home page, found by a figure they contain so the
// wording always comes straight from the resume. Order = display order.
const KEY_OUTCOME_MARKERS = ['90%', '50+', '1.5'];

/**
 * Seal for a role, from the Chinese resume period ("2021/10 – 2023/06" or
 * "2023/06 – 至今"); its numeric form is language-neutral.
 */
export function sealForPeriod(zhPeriod) {
  const [start, end] = zhPeriod.split('–').map((part) => part.trim());
  const current = !/^\d{4}\/\d{2}$/.test(end);
  return { kind: current ? 'progress' : 'delivered', date: (current ? start : end).replace('/', '.') };
}

/**
 * Experience as numbered acceptance items. Numbers run across all roles so
 * every highlight has a stable anchor (#item-01, #item-02…).
 */
export function experienceRecord(lang) {
  const zhJobs = CONTENT.zh.experience.items;
  let counter = 0;
  return CONTENT[lang].experience.items.map((job, jobIndex) => ({
    role: job.role,
    company: job.company,
    period: job.period,
    seal: sealForPeriod(zhJobs[jobIndex].period),
    groups: job.subProjects.map((group) => ({
      title: group.title,
      items: group.highlights.map((text) => {
        counter += 1;
        const no = String(counter).padStart(2, '0');
        return { no, id: `item-${no}`, text };
      }),
    })),
  }));
}

/** The highlighted deliveries for the first viewport, each tied to its item number. */
export function keyOutcomes(lang) {
  const record = experienceRecord(lang);
  return KEY_OUTCOME_MARKERS.map((marker) => {
    for (const job of record) {
      for (const group of job.groups) {
        const item = group.items.find((candidate) => candidate.text.includes(marker));
        if (item) return { ...item, marker, context: group.title, company: job.company, period: job.period, seal: job.seal };
      }
    }
    throw new Error(`keyOutcomes(${lang}): no resume highlight contains "${marker}"`);
  });
}

/** Skill categories in display order, paired with their printed labels. */
export function skillInventory(lang) {
  const { skillsData, skills } = CONTENT[lang];
  const labels = skills.categories;
  return [
    ['frontend', labels.frontend],
    ['backend', labels.backend],
    ['devops', labels.testing],
    ['ai', labels.ai],
    ['testing', labels.testing_extra],
    ['mobile', labels.mobile],
  ].map(([key, label]) => ({ key, label, items: skillsData[key] }));
}
