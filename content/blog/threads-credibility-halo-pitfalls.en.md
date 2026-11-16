---
schema: blog-post
lang: en
title: I Thought Threads Was Right Until I Hit a Snag
date: 2026-11-16
summary: I saw confident social-media advice and thought I could copy it. But what looks good on someone else may not fit me, and a smooth read doesn't mean they've tested the pitfalls for me
topics:
  - psychology
  - social-media
  - critical-thinking
  - writing
origin: original
translation: machine-assisted
---

I often scroll through Threads, LinkedIn, or X, and my bookmarks quietly fill up with technical and management advice

Here are two fictional examples of the kind of thing you could probably find in your feed every day:

> “Engineering teams of the future won't need to write basic code themselves. Once they fully adopt AI Agents, engineers will only need to design the architecture and review the results, while Agents handle implementation. Managers will only need to manage requirements and process boundaries”

Or a short post in the voice of someone who's been there:

> “Every truly mature engineering manager knows that technology choices are never the point. Build a team culture, and the architecture problems will take care of themselves”

The formatting is clean, the tone is certain, and there are hundreds of likes underneath. Every time I see something like this, it's easy to think, “Oh, right. Maybe this is how we should do it”

Then I actually try to copy it, and one snag after another blows up

“Let Agents do all the implementation; engineers just review it” sounds as natural as breathing

But when I actually tried it on a project, just dealing with a long Context, complicated cross-file dependencies, or permission roadblocks could take more time than writing the code myself—especially when tracking down which boundary condition the Agent had broken

And in a team, someone still has to take responsibility for code that looks like it works but is hiding technical debt

Looking back at the post I'd saved, I noticed something a little funny: the author had never said they'd run this through a production project, or whether their team had three people or fifty, or whether the system was a new toy or a ten-year-old architecture

I had read those few hundred words and filled in all the blanks for them in my own head

## I thought the problem was people showing off, but I was the one jumping to conclusions

When I first thought about this, I went looking up the “spotlight effect,” assuming it was about people on social media liking to put themselves center stage and present themselves as experts

It turns out I had it completely wrong. The spotlight effect discussed by Gilovich and others is about people overestimating how much others notice their embarrassing moments. That's a completely different thing from how readers misjudge information

When I turned the question back on myself, it became much simpler

In the few seconds we spend scrolling social media, we often merge several completely unrelated things into one:

- This sounds persuasive
- The idea itself is correct
- The author has actually tried it firsthand
- I can take this approach and use it at home as-is

Once the first one—“that sounds so reasonable”—gets through, the other three often pass automatically

It's like seeing someone else's outfit: the same clothes can look great on a model, but that doesn't mean they'll suit me too. The clothes aren't bad, and there's nothing wrong with the person wearing them. Our bodies and the occasions we're dressing for are just different

Technology choices, AI workflows, and management approaches are much the same

## Our brains are busy, so they like shortcuts

In a fast-moving feed, we can't treat every post like an academic paper. Naturally, our brains look for an easier route

If someone has a big-company title, calls themselves an architect, or writes especially crisply, the halo effect described by Thorndike can quietly kick in. We may start assuming they're just as reliable on every subject

Cao has also told us something similar: cues like social media titles, a confident tone, and thousands of likes can substantially raise how credible a post feels to us

But “feels credible” and “works in reality” are still two different things

And when an author compresses a complicated system rewrite or AI rollout into a few sentences, leaving out all the messy work and exception handling, it's easy for us to fall into the “illusion of explanatory depth” described by Rozenblit and Keil. We think we've already understood how to do it, until we try and discover that the devil is in the details that were never written down

## A small filter is enough; no need to hunt for villains

I'm not going to take this too far and demand that every Threads post include KPIs or a control group. That would make social media exhausting to scroll through

Borrowing a little from Sperber and others' idea of “epistemic vigilance,” I now at most sort posts in my head: is this an interesting hypothesis from the author, a local experience in a particular environment, or an approach that actually explains its assumptions and failure conditions?

Sometimes hiding the author's title and the flattering comments below, then reading the post again—or checking whether it says when the advice does not apply—is enough to tell whether this outfit would suit me

If I'm changing just one personal setting, I don't mind copying it and finding out the hard way. But if it affects a team process or system architecture, it's more practical to try it in a small corner where failure is affordable

On the other hand, there's no need to swing to the opposite extreme and hunt down people who are “all talk and no real-world experience”

Someone who hasn't done the work firsthand can sometimes spot blind spots through reasoning. A manager who has led a large team may leave out the practical details because of confidentiality or limited space

Still, here I am dropping names as I write, arranging the sections neatly, and lining up a string of impressive-looking research links from overseas

Wait — you made it all the way down here, so do you believe me?

## References

- [Cao et al.'s meta-analysis of social media credibility](https://doi.org/10.3390/bs16071184)
- [Sperber et al. on epistemic vigilance](https://doi.org/10.1111/j.1468-0017.2010.01394.x) ([UCL open-access version](https://discovery.ucl.ac.uk/id/eprint/1331363/))
- [Rozenblit and Keil on the illusion of explanatory depth](https://doi.org/10.1207/s15516709cog2605_1) ([full text at PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/))
- [Sloman and Rabb on thinking we understand something because others do](https://doi.org/10.1177/0956797616662271)
- [Gilovich et al. on the spotlight effect](https://pubmed.ncbi.nlm.nih.gov/10707330/)
- [Thorndike's original work on the halo effect](https://doi.org/10.1037/h0071663)
