import { test, expect } from 'bun:test';

for (const [lang, prefix] of [['en', 'en'], ['zh', 'zh-tw']]) {
  test(`${lang} Markdown preserves entity offsets and code`, () => {
    const script = `
      import { mock } from 'bun:test';
      import assert from 'node:assert/strict';
      const post = { id: 'hello-blog.${lang}', data: { title: 'Hello', date: '2026-01-01', topics: ['writing'], summary: 'Summary', lang: '${lang}' } };
      mock.module('astro:content', () => ({ getCollection: async () => [post] }));
      const { GET } = await import('./src/pages/${prefix}/blog/[slug].md.ts');
      const body = 'A &amp; [[hello-blog]] and ' + String.fromCharCode(96) + '[[literal]]' + String.fromCharCode(96);
      const result = await GET({ props: { post: { ...post, body } } });
      assert.equal(result.status, 200);
      assert.ok((await result.text()).includes('A &amp; [hello-blog](https://joshwang.dev/${prefix}/blog/hello-blog) and ' + String.fromCharCode(96) + '[[literal]]' + String.fromCharCode(96)));
      const encoded = await GET({ props: { post: { ...post, body: '[[hello&#45;blog]]' } } });
      assert.ok((await encoded.text()).includes('[hello-blog](https://joshwang.dev/${prefix}/blog/hello-blog)'));
      for (const count of [1, 2, 3, 4]) {
        const prefix = String.fromCharCode(92).repeat(count);
        const escaped = await GET({ props: { post: { ...post, body: prefix + '[[hello-blog]]' } } });
        const expected = count % 2 ? prefix + '[[hello-blog]]' : prefix + '[hello-blog](https://joshwang.dev/${prefix}/blog/hello-blog)';
        assert.ok((await escaped.text()).includes(expected));
      }
      await assert.rejects(GET({ props: { post: { ...post, body: '[[missing]]' } } }), /Unresolved wikilink/);
    `;
    const result = Bun.spawnSync([process.execPath, '-e', script], { cwd: new URL('../', import.meta.url).pathname });
    expect(result.exitCode).toBe(0);
  });
}
