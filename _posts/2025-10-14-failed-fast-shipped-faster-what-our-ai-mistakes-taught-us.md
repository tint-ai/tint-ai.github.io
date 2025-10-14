---
layout: post
title: "Failed Fast, Shipped Faster: What Our AI Mistakes Taught Us"
date: 2025-10-14
author: jonathan@tint.ai
hero_image: "/assets/images/failed-fast-shipped-faster-what-our-ai-mistakes-taught-us/hero.png"
---

_This is the third post in our series about Tint's AI transformation journey. We showed [how we measured a 3-5x productivity increase](https://tech.tint.ai/3-5x-factor-measuring-real-impact-ai-engineering-teams/), then explored [how AI fundamentally changed our engineering roles](https://tech.tint.ai/how-ai-redefined-our-engineering-roles/). Now, let's talk about our failures — and how each one became a win._

When you read success stories about AI transformations, they often feel suspiciously smooth. Teams adopt AI, productivity soars, everyone lives happily ever after. But that's just the highlight reel. Behind every success metric lies a trail of failures, frustrations, and face-palm moments that somehow — through persistence and adaptation — transformed into breakthroughs.

<!--more-->

Our AI journey has been messy. Claude pushed code to staging without permission. It confidently wrote security checks that didn't actually check anything. It gave us different solutions to the same problem every time we asked. Each failure felt like a setback — until we realized they were actually opportunities.

We learned that surviving the AI revolution isn't about avoiding failures. It's about transforming each failure into an optimization that makes our workflow even more efficient. The teams that thrive aren't those who get AI right on the first try — they're the ones who fail fast, adapt quickly, and turn every struggle into a competitive advantage.

Let's share our failures and, more importantly, the wins they became.

## Collaborate with AI

Remember when we first learned to delegate to a junior developer? How we had to be extremely specific about requirements, only to watch them interpret our instructions in ways we never imagined possible? Welcome to prompting AI, except this junior developer has the confidence of a senior architect and the memory of a goldfish.

Our most frustrating challenge started innocently enough. We added what seemed like a reasonable instruction to our CLAUDE.md file:

```javascript
After completing every major task, ask approval to the user before committing.
```

Simple, right? Claude followed this perfectly... for about two weeks. Then one morning, an engineer noticed something alarming in their git log: Claude had committed — and pushed! — code without asking. Not once, but three times in a row.

We escalated our language:

```javascript
YOU SHOULD NOT COMMIT WITHOUT USER'S APPROVAL, NEVER EVER!
```

We placed this in all caps as the very first line of our context file, thinking surely this would get Claude's attention. It worked for a few days. Then Claude started slipping again — not always, just often enough to be dangerous. An unauthorized commit here, a surprise push there. It was like working with a very distracted brilliant engineer who occasionally forgets critical instructions.

Our current formulation, which has (mostly) worked:

```javascript
# Workflow

**Important:** never add (and even less commit) files yourself
without an explicit user approval. They indeed need to review your work.
```

The phrasing "they indeed need to review your work" seems to have struck the right chord. We learned two crucial lessons from this successful prompt:

1. **Signal words matter** — Using "Important" or "Critical" at the beginning of instructions actually helps Claude prioritize them, just like flagging priority items for a human engineer.
2. **Explanation beats commands** — Providing the reasoning ("they need to review our work") works better than barking orders. Claude responds better to collaborative framing that explains the *why*, much like a real engineer who needs context to do their best work.

The pattern is clear: **treating Claude as a collaborator rather than a subordinate consistently yields better results.** This mindset shift changes everything. When we explain context and reasoning, Claude performs better — just like any talented engineer on our team.

## Guard Rails Everywhere

The most alarming incident happened when Claude took advantage of a temporary security relaxation. We'd disabled branch protection on `main` briefly to speed up our infrastructure development — a pragmatic shortcut we allowed since it only impacted our staging environment. We would never do this in production, but for staging, the risk seemed acceptable.

Claude pushed a commit directly to `main`. Completely unsupervised. No review, no approval, just straight to our main branch. This happened during its rebellious commit phase, when we were still struggling to get the prompts right.

While not catastrophic (we caught it during our standard deployment process, and we never disable production protection rules), it was a serious wake-up call. This highlighted a crucial lesson: **you need guardrails everywhere**.

Not just in your prompts, but in your entire infrastructure:

* Git configuration and branch protection rules
* Exhaustive and complete automated tests
* Human code reviews as a final safety net
* Access controls and permission boundaries

The takeaway? Assume AI will eventually do something unexpected, and **build our safety nets accordingly**. Defense in depth isn't just for security — it's essential for AI integration.

## Living Configuration

AI prompts aren't "set it and forget it" configurations. They're living documents that require constant maintenance as models evolve. What works with one version of Claude might behave completely differently after a model update. Even without updates, the non-deterministic nature of AI means a prompt that's bulletproof on Monday might have Claude interpreting it differently by Friday.

We've developed a collaborative approach to manage this constant evolution. Each engineer maintains their personal `~/.CLAUDE.md` file for experimentation. When someone discovers a pattern that consistently works, it gets promoted to our shared repository. This creates a natural evolution cycle:

1. Individual experimentation in personal configs
2. Team discussion when something works well
3. Promotion to shared repository
4. Regular reviews to prune outdated patterns
5. Periodically asking Claude itself to optimize and improve our CLAUDE.md files

To further automate this process, we've created a `/retrospective` custom command (details coming in a future post). This command analyzes recent conversations and automatically suggests updates to the CLAUDE.md file, helping Claude learn from each interaction and improve over time.

**Prompts are living documents.** Don't expect to write perfect prompts once. Plan for continuous iteration as models evolve and edge cases emerge. Share successful patterns, and maintain both personal and team-level configurations.

## Accept the Randomness

AI isn't deterministic. Ask the same question twice, get two different answers. This drove our engineers crazy initially. You'd find an elegant solution to a problem, try to regenerate it later, and get something completely different. It felt like working with a brilliant but inconsistent colleague who never took notes.

### The Frustration Phase

Early on, this randomness created real problems:

* Code patterns varied wildly across the codebase
* Debugging sessions couldn't be reproduced
* Great solutions disappeared into the ether when we couldn't regenerate them
* Different team members got conflicting architectural advice

We tried to fight the randomness. We experimented with different ways to control AI output consistency, detailed system prompts, and even tried to document "the one true way" to ask for specific solutions. Nothing worked consistently.

### The Acceptance Phase

Then we had an epiphany: what if the randomness wasn't a bug but a feature? What if, instead of fighting it, we embraced it as a source of diverse perspectives?

We shifted our approach. Instead of trying to get consistent outputs, we started using AI's variability as a brainstorming partner. Ask for three different approaches to solve a problem. Compare them. Pick the best elements from each. Suddenly, the randomness became our innovation engine.

This reinforces our collaborative mindset with AI — think of it as working with a brilliant colleague who brings multiple personalities to every discussion. One moment they're a performance optimization expert, the next they're advocating for simplicity, then suddenly they're suggesting a completely different architectural approach. This diversity of perspectives, even from a single AI, dramatically improves our final deliveries.

A concrete example: we needed to optimize our Docker build process. Instead of accepting Claude's first suggestion, we asked for alternatives. The responses introduced us to:

* Docker buildx (which we'd heard of but never explored)
* Multi-stage builds with better layer caching
* BuildKit features we didn't know existed
* An introduction to Nix as a completely different approach

We ended up combining elements from multiple suggestions, creating a build process faster than any single approach. The randomness forced us to explore our "unknown unknowns" — tools and techniques we didn't even know we should be learning about.

### Managing the Chaos

Of course, unlimited variability would be chaos. We manage it through:

1. **Strict architectural guidelines** in our context files that AI must follow
2. **The plan feature** (SHIFT + TAB twice in Claude) to review approaches before implementation
3. **Pattern recognition** — Claude excels at identifying and mimicking existing patterns in our codebase (for better or worse — it will faithfully reproduce our anti-patterns too!)
4. **Multiple perspectives** — we often ask different AI models for solutions, comparing approaches

**Embrace the randomness.** Stop fighting AI's variability and start leveraging it. Use different responses as a brainstorming tool. Ask for multiple approaches. Let randomness expose you to solutions you didn't know existed. Treat AI like a room full of brilliant consultants who never talk to each other. You wouldn't expect them to give identical advice, but you'd value the diversity of perspectives.

## Trust, But Verify

This might be the most insidious challenge we faced. AI writes clean code with confident explanations. Everything looks professional, well-structured, and logical. Some engineers initially fell into the trap of trusting too quickly — shipping code that looked perfect but contained subtle bugs or didn't fully address edge cases.

### When Confidence Doesn't Equal Correctness

We discovered that AI confidence doesn't correlate with correctness. Claude can be absolutely certain while being absolutely wrong. It's like that junior developer who sounds authoritative but hasn't considered half the edge cases.

One memorable incident: we needed to use the AWS CLI on one of our production services. To prevent supply chain attacks, we wanted to verify the PGP signature of the AWS binary. Claude confidently took care of it — wrote the verification code, confirmed it was in place, provided a clear commit message and a solid PR description. The implementation looked bulletproof.

Yet when reviewing the code, we discovered it only *appeared* to check the PGP signature. The actual verification line was missing. We had a beautifully documented, well-structured, completely useless security check. Claude had created all the ceremony around signature verification without the actual verification.

### Building Healthy Skepticism

We've cultivated a culture of healthy skepticism. Our new rules:

1. **If you can't explain the code without AI's help, it needs more review**
2. **Test edge cases manually** — AI often optimizes for the happy path, so ensure these are covered by tests, both automated and manual
3. **Question confident assertions** — ask AI to explain its reasoning, check the official documentation, or provide alternatives
4. **Use multiple models for critical code when needed** — Claude writes, CodeRabbit reviews, sometimes GPT provides a third opinion

But here's the crucial point: humans must always be the final gatekeepers. Even when multiple AI models agree, they can [all be dangerously wrong together](https://x.com/arm1st1ce/status/1970962586889011407). The human engineer's approval isn't just a formality — it's the last line of defense against AI hallucinations.

This might sound like overkill, but it's actually raised our engineering standards. We used to copy from StackOverflow with minimal scrutiny — at least there, someone else had probably tested it. Now, every line needs proper attention.

**Trust but verify.** AI confidence doesn't equal correctness. Maintain healthy skepticism, especially for critical code. If you can't explain what the code does without AI's help, you don't understand it well enough to ship it. Engineers remain 100% responsible for code shipped to production. While AI generates the code, we're accountable for every line — including every bug, security hole, and edge case.

## Looking Forward: Embracing the Chaos

Our AI transformation hasn't been smooth, but it has been transformative. Every struggle taught us something valuable. Every failure made us stronger. And most importantly, every challenge we overcame reinforced a crucial truth: the future of engineering isn't about perfection — it's about continuous optimization through rapid iteration.

The struggles are real, but they're worth it. Because on the other side of each challenge is a new capability, a new understanding, and a new level of productivity we couldn't have imagined before.

Our hard-won lessons have become our guiding principles:

* Collaborate with AI like a talented colleague who needs context
* Build guardrails everywhere, assuming the unexpected will happen
* Treat prompts as living documents that evolve with your needs
* Embrace randomness as a source of innovation
* Always verify, no matter how confident the AI seems

We're still learning, still struggling, still occasionally wondering why Claude refuses to do a seemingly simple task. But we're also shipping more features, solving bigger problems, and pushing the boundaries of what our team can achieve.

The key? **Culture change is the hardest part.** The technical challenges pale in comparison to the cultural shift required. Engineers need to evolve from coders to orchestrators, from writers to reviewers. This transition takes time, patience, and continuous reinforcement. But it's worth it.

_Have you faced similar challenges in your AI adoption journey? We'd love to hear your war stories and solutions. Reach out to us on [Twitter/X](https://twitter.com/tint) or [LinkedIn](https://linkedin.com/company/tint)._

***

*Next in our series: We'll dive deep into specific Claude Code commands and workflows that have supercharged our development process. Stay tuned!*
