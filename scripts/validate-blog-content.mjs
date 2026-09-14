import { buildIndex, loadPosts, validatePost } from './blog-content-rules.mjs';

const { posts, errors } = loadPosts();
try {
  const index = buildIndex(posts);
  for (const post of posts) {
    try { validatePost(post, index); } catch (error) { errors.push(error.message); }
  }
} catch (error) { errors.push(error.message); }
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`blog: validated ${posts.length} posts`);
}
