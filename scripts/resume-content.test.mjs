import { describe, expect, test } from "bun:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPosts } from "./blog-content-rules.mjs";
import { loadResumes, parseResumeMarkdown, renderLlmsMarkdown, toWebContent } from "./resume-content.mjs";

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
    const llms = renderLlmsMarkdown(resumes);
    const web = `${JSON.stringify(toWebContent(resumes.zh))}${JSON.stringify(toWebContent(resumes.en))}`;
    expect(llms).not.toContain("Contract-based");
    expect(web).not.toContain("Contract-based");
  });

  test("includes public blog resources without exposing private metadata", () => {
    const llms = renderLlmsMarkdown(resumes);
    expect(llms).toContain("https://joshwang.dev/zh-tw/blog/index.md");
    expect(llms).toContain("https://joshwang.dev/en/blog/index.md");
    expect(llms).toContain("https://joshwang.dev/zh-tw/blog/rss.xml");
    expect(llms).toContain("https://joshwang.dev/en/blog/rss.xml");
    expect(llms).toContain("## Recent blog posts");
    expect(llms).not.toContain("vault_path");
    expect(llms).not.toContain("30_Resources/");
    const { posts } = loadPosts();
    for (const post of posts.filter(post => post.data.draft)) expect(llms).not.toContain(post.data.title);
  });

  test("rejects missing front matter", () => {
    expect(() => parseResumeMarkdown("no frontmatter")).toThrow("missing YAML front matter");
  });
});
