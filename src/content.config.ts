import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { createBlogSchema, postIdentity } from '../scripts/blog-content-rules.mjs';

const blog = defineCollection({
  loader: glob({
    base: './content/blog',
    pattern: ['**/*.md', '!**/_*.md'],
    generateId: ({ entry, data }) => {
      const file = `content/blog/${entry}`;
      const identity = postIdentity(file);
      const result = createBlogSchema(z, file).safeParse(data);
      if (!result.success) {
        throw new Error(`blog: ${file}: ${result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`);
      }
      return `${identity.slug}.${identity.lang}`;
    },
  }),
  schema: createBlogSchema(z),
});

export const collections = { blog };
