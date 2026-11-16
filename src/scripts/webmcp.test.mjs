import { test, expect } from 'bun:test';

test('WebMCP validates tool inputs and rolls back rejected registration', () => {
  const script = `
    import assert from 'node:assert/strict';
    const tools = [];
    globalThis.document = { modelContext: { registerTool: async tool => { tools.push(tool); } } };
    globalThis.fetch = async () => Response.json([{ title: 'Hello', summary: 'Test', topics: ['writing'], lang: 'en' }]);
    await import('./src/scripts/webmcp.ts?success');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(tools.length, 2);
    const result = await tools[0].execute({ lang: 'en', topic: 'writing' });
    assert.equal(JSON.parse(result.content[0].text)[0].title, 'Hello');
    for (const input of [{ lang: 'bad' }, { query: 3 }, { limit: 0 }, { extra: true }]) await assert.rejects(tools[0].execute(input));
    await assert.rejects(tools[1].execute({ resource: 'invalid' }));
    let signal; let calls = 0; let reported = false;
    console.error = () => { reported = true; };
    document.modelContext.registerTool = async (_tool, options) => { signal = options.signal; if (++calls === 2) throw new Error('rejected'); };
    await import('./src/scripts/webmcp.ts?failure');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(signal.aborted, true);
    assert.equal(reported, true);
    globalThis.document = {};
    await import('./src/scripts/webmcp.ts?unsupported');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(calls, 2);
  `;
  const result = Bun.spawnSync([process.execPath, '-e', script], { cwd: new URL('../../', import.meta.url).pathname });
  expect(result.exitCode).toBe(0);
});
