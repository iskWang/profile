import { blogRss } from '../../../lib/rss.js';

export async function GET(context) {
  return blogRss('en', context);
}
