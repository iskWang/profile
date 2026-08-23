#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";

const LANGS = ["zh", "en"];
const REQUIRED_META = ["schema", "lang", "name", "title"];
const DATA_HEADING = /^##\s+Resume Data\s*$/m;
const JSON_BLOCK = /```(?:json|resume-json)\s*\n([\s\S]*?)\n```/m;

function parseFrontMatter(source, filePath) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) throw new Error(`${filePath}: missing YAML front matter`);
  const values = {};
  for (const [index, line] of match[1].split(/\r?\n/).entries()) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`${filePath}: invalid front matter line ${index + 1}`);
    values[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
  }
  return values;
}

export function parseResumeMarkdown(source, filePath = "resume.md") {
  const meta = parseFrontMatter(source, filePath);
  for (const key of REQUIRED_META) if (!meta[key]) throw new Error(`${filePath}: missing front matter field '${key}'`);
  if (meta.schema !== "resume") throw new Error(`${filePath}: unsupported schema '${meta.schema}'`);
  if (!LANGS.includes(meta.lang)) throw new Error(`${filePath}: lang must be zh or en`);
  if (!DATA_HEADING.test(source)) throw new Error(`${filePath}: missing '## Resume Data' heading`);
  const block = source.match(JSON_BLOCK);
  if (!block) throw new Error(`${filePath}: missing JSON resume data block`);
  let data;
  try { data = JSON.parse(block[1]); } catch (error) { throw new Error(`${filePath}: invalid resume data JSON: ${error.message}`); }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(`${filePath}: resume data must be an object`);
  if (data.name !== meta.name || data.title !== meta.title) throw new Error(`${filePath}: front matter and resume data disagree`);
  return { ...data, lang: meta.lang, schema: meta.schema };
}
export function readResumeFile(filePath) { return parseResumeMarkdown(fs.readFileSync(filePath, "utf8"), filePath); }
export function loadResumes(contentDir) {
  const resumes = {};
  for (const lang of LANGS) {
    const filePath = path.join(contentDir, `resume.${lang}.md`);
    const resume = readResumeFile(filePath);
    if (resume.lang !== lang) throw new Error(`${filePath}: filename language does not match front matter`);
    resumes[lang] = resume;
  }
  return resumes;
}
export function toWebContent(resume) {
  if (resume.web) return resume.web;
  const { lang, schema, ...data } = resume;
  const isZh = lang === "zh";
  const labels = isZh
    ? { about: "關於", experience: "經歷", projects: "專案", skills: "技能", contact: "聯繫", experienceTitle: "工作經歷", skillsTitle: "技能樹", contactTitle: "聯繫方式", projectsTitle: "個人專案", highlightsTitle: "特色亮點" }
    : { about: "about", experience: "experience", projects: "projects", skills: "skills", contact: "contact", experienceTitle: "Experience", skillsTitle: "Skill Tree", contactTitle: "Contact Me", projectsTitle: "Projects", highlightsTitle: "Highlights" };
  const categories = Object.fromEntries(data.skills.map(({ cat, val }) => [cat.toLowerCase().split(" ")[0], val.split(" / ")]));
  return {
    nav: { about: labels.about, experience: labels.experience, projects: labels.projects, skills: labels.skills, contact: labels.contact },
    hero: { name: data.name, title: data.title, experience: data.summaryLines[0]?.match(/\d+\+ years|\d+\+ 年/)?.[0] ?? "", focus: "React / AI Workflow", location: data.location, welcome: isZh ? `您好，我是 ${data.name.split(" ")[0]}!` : `Hi, I'm ${data.name.split(" ")[0]}!`, description: data.summaryLines.join(" "), tags: [], resumeBtn: isZh ? "查看完整履歷 (PDF)" : "View Full Resume (PDF)", resumeUrl: isZh ? "/JoshWang_ZH_Resume.pdf" : "/JoshWang_EN_Resume.pdf" },
    experience: { title: labels.experienceTitle, subtitle: "// Recent positions", earlyExperience: "", items: data.jobs.map(job => ({ company: job.company, role: job.title, period: job.period, highlights: job.groups.flatMap(group => group.bullets), subProjects: job.groups.map(group => ({ title: group.subhead ?? "", highlights: group.bullets })) })) },
    skills: { title: labels.skillsTitle, subtitle: "// Tech stack overview", categories: { frontend: "Frontend", backend: "Back-End", ai: "AI Workflow", mobile: "Mobile", testing: "Architecture & Infra", testing_extra: "Testing" } },
    contact: { title: labels.contactTitle, subtitle: "// Feel free to contact me 🐱", quote: isZh ? "樂於參與討論分享觀點，通常不是會議中最安靜的那位" : "Passionate about sharing perspectives; rarely the quietest one in the room.", downloadBtn: isZh ? "下載完整履歷" : "Download Full Resume" },
    highlights: { title: labels.highlightsTitle, items: data.achievements.flatMap(([left, right], i) => [{ emoji: ["🚀", "🤖", "⚙️", "🔐"][i], title: left, description: right, color: ["cyan", "amber", "emerald", "cyan"][i] }]) },
    projects: { title: labels.projectsTitle, subtitle: "// Side projects & Open source", items: [{ title: data.project.title, url: data.project.href, tags: ["AI Agent", "E2E Testing", "LLM", "Open Source"], highlights: data.project.bullets }] },
    skillsData: { frontend: categories.frontend ?? [], backend: categories.backend ?? [], devops: categories.architecture ?? [], ai: categories.ai ?? [], mobile: categories.mobile ?? [], testing: categories.testing ?? [] },
  };
}
export function renderIndexMarkdown(resumes) {
  const links = "- [English resume](/resume.en.md)\n- [中文履歷](/resume.zh.md)\n- [English PDF](/JoshWang_EN_Resume.pdf)\n- [中文 PDF](/JoshWang_ZH_Resume.pdf)";
  const sections = ["en", "zh"].map((lang) => {
    const resume = resumes[lang];
    const jobs = resume.jobs.map((job) => `- **${job.title}** — ${job.company} (${job.period})`).join("\n");
    return `## ${lang === "en" ? "English" : "中文"}\n\n**${resume.name} — ${resume.title}**\n\n${resume.location}\n\n${resume.summaryLines.join(" ")}\n\n### Experience\n${jobs}`;
  }).join("\n\n");
  return `# Josh Wang — Resume\n\nCanonical Markdown resumes:\n\n${links}\n\n${sections}\n`;
}
export function generate({ contentDir, generatedFile, publicDir }) {
  const resumes = loadResumes(contentDir);
  const web = { zh: toWebContent(resumes.zh), en: toWebContent(resumes.en) };
  fs.mkdirSync(path.dirname(generatedFile), { recursive: true });
  fs.writeFileSync(generatedFile, `// Generated by scripts/resume-content.mjs. Do not edit.\nexport const CONTENT = ${JSON.stringify(web, null, 2)};\n`);
  fs.mkdirSync(publicDir, { recursive: true });
  for (const lang of LANGS) {
    fs.copyFileSync(path.join(contentDir, `resume.${lang}.md`), path.join(publicDir, `resume.${lang}.md`));
  }
  fs.writeFileSync(path.join(publicDir, "index.md"), renderIndexMarkdown(resumes));
  return { resumes, web };
}
if (import.meta.main) {
  const profileDir = path.resolve(import.meta.dir, "..");
  const result = generate({ contentDir: path.join(profileDir, "content"), generatedFile: path.join(profileDir, "src/generated/content.js"), publicDir: path.join(profileDir, "public") });
  console.log(`Generated Web content and Markdown index for ${Object.keys(result.resumes).join(", ")}.`);
}
