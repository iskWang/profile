import { describe, expect, test } from "bun:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadResumes, renderIndexMarkdown, toWebContent } from "./resume-content.mjs";

const profileDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resumes = loadResumes(path.join(profileDir, "content"));

describe("resume Markdown source", () => {
  test("loads both languages with the canonical job title", () => {
    expect(resumes.zh.title).toBe("Software Developer");
    expect(resumes.en.title).toBe("Software Developer");
    expect(resumes.zh.jobs[0].title).toBe("Full-Stack Engineer");
    expect(resumes.en.jobs[0].title).toBe("Full-Stack Engineer");
  });

  test("does not retain the removed contract qualifier", () => {
    const index = renderIndexMarkdown(resumes);
    const web = `${JSON.stringify(toWebContent(resumes.zh))}${JSON.stringify(toWebContent(resumes.en))}`;
    expect(index).not.toContain("Contract-based");
    expect(web).not.toContain("Contract-based");
  });
});
