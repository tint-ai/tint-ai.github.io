---
layout: post
title: "How AI Redefined Our Engineering Roles?"
date: 2025-09-22
author: jonathan@tint.ai
hero_image: "/assets/images/how-ai-redefined-our-engineering-roles/hero.png"
---

The most uncomfortable question we faced during our AI transformation wasn't technical — it was existential. If AI can write code 3x faster than us, what exactly is our job now? Are we training our replacements? The answer wasn't what most people expected: we're not being replaced, we're being promoted.

<!--more-->

This is the second post in our series about Tint's AI transformation journey. In our [first post](https://tech.tint.ai/3-5x-factor-measuring-real-impact-ai-engineering-teams/) , we shared the metrics — a 3-5x productivity increase backed by hard data. Today, we'll talk about the human side: how our roles evolved, why engineers now own more responsibility than ever, and how we've learned to orchestrate AI agents instead of writing every line ourselves.

## The Day Everything Changed

We were migrating our entire build pipeline to use ECR image builds — 15+ services with well-tested processes we needed to maintain. The complexity was staggering. Every service had its quirks, GitHub Actions had its own specificities, and we could only test in real conditions on our staging environments (we tried `act` locally, but it required so many workarounds for infrastructure permissions that it became pointless).

Then came the breakthrough moment. After a failed deployment, instead of spending ages digging through logs, we tried something different. We copy-pasted the link of the failed run into Claude. Within minutes, it had identified the issue, documented it as a ticket, and proposed a fix. We only had to review and re-deploy.

![GitHub Actions debug example](/assets/images/how-ai-redefined-our-engineering-roles/github-actions-debug.png)

What would have been a lengthy troubleshooting session — checking logs, examining YAML configurations, testing permission chains, etc. — became a 10-minute review session. That moment crystallized something we'd been gradually realizing: the valuable part wasn't debugging the pipeline; it was understanding the problem, knowing which solution to implement, and validating it worked correctly.

This shift didn't happen overnight. We went through stages of denial ("AI can't understand our complex codebase"), bargaining ("Maybe we just use it for tests?"), and eventually acceptance. But acceptance came with a revelation: our jobs became more interesting, not less.

## From Typing to Thinking: The New Engineering Mindset

### What We Used to Do

Let's look at how engineers actually spent their time pre-AI. A [2019 Microsoft study](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/04/devtime-preprint-TSE19.pdf) — conducted well before AI coding assistants existed — provides hard data on engineering time allocation:

* **42% on implementation tasks** - Writing code (15%), debugging (14%), testing (8%), and code review (5%)
* **34% on collaboration** - Meetings (15%), email (10%), helping others (5%), and interruptions (4%)
* **9% on strategic work** - Design/planning (6%) and learning (3%)
* **15% miscellaneous** - Admin tasks (2%), breaks (8%), and various other activities (5%)

Looking at these numbers, something becomes clear: engineers spent over 40% of their time on mechanical implementation tasks — the very tasks AI now handles effectively. Meanwhile, the strategic work that requires human judgment — design, planning, and learning — occupied just 9% of the day.

### What We Do Now

With AI taking over much of that 42% implementation work, our time distribution has fundamentally shifted:

* **Implementation tasks: from 42% to ~15%** - Heavily focused on AI code review, as engineers still own every line shipped to production
* **Strategic work: from 9% to ~40%** - Architecture decisions, system design, and experimentation (implementation cost is now so low we can test ideas directly instead of writing RFCs to get a time slot to experiment)
* **Collaboration: from 34% to ~25%** - Reduced as AI can answer some basic questions ("how is authentication handled?" or "why did we add this condition?") but meetings, mentoring, and team discussions still matter
* **Miscellaneous: ~20%** - Admin, breaks, and other activities

The transformation is striking. We've more than quadrupled our time on strategic work while maintaining essential human collaboration. The mechanical tasks haven't disappeared entirely — we still debug complex issues and carefully review every piece of code — but they no longer dominate our day.

## The 100% Ownership Principle

Early in our AI adoption, we made a critical decision that shaped everything else: **engineers remain 100% responsible for code shipped to production**. AI writes it, but we own it — bugs and all.

This wasn't just a policy decision; it was a philosophical stance. We've all seen the [horror stories of blindly copied Stack Overflow code](https://www.zdnet.com/article/the-most-copied-stackoverflow-java-code-snippet-contains-a-bug/) . That's why every line of AI-generated code must be understood, validated, and approved by a human engineer before it reaches our customers.

This ownership principle forced us to develop new skills. Reading code became more important than writing it. Understanding system interactions mattered more than syntax memorization. We shifted from asking "How do I implement this?" to "Is this the right implementation?"

The principle also had an unexpected benefit: it made engineers more confident about using AI. When you know you're still accountable, you're paradoxically more willing to let AI help. It's not about trusting AI blindly; it's about trusting your ability to validate its work.

We enforce this through both culture and process:

* Code reviews explicitly check for understanding, not just correctness
* Engineers must be able to explain any code they submit — while they can use AI's explanations to learn, they need to double-check its answers
* Post-mortems treat AI-generated bugs exactly like human-generated ones
* Performance reviews reward good system design and code review quality, not volume

The result? Higher quality code than before. When every engineer reviews code with the scrutiny we used to reserve for copy-pasted solutions, standards naturally rise.

## Orchestrating the AI Symphony

The real productivity breakthrough came when we stopped thinking linearly. Traditional development is sequential: write function A, test it, write function B, test it, integrate them, debug the integration. With AI, we learned to parallelize everything.

### The Old Way: Sequential Development

Before AI, multitasking meant context-switching between tasks, losing productivity with each switch. Starting a second task while waiting for tests to run usually meant forgetting where you were on the first task. We optimized for focus — one task, completed fully, then the next.

### The New Way: Parallel Orchestration

Now, we orchestrate multiple AI agents simultaneously, and the tasks rarely need to be related. We might have Claude implementing a Stripe webhook handler while we review a database schema for our usage visualization tool. Another agent fixes a production bug in the email service while a fourth explores migrating from Redis to Valkey. One writes tests for notification endpoints while another refactors our legacy PDF generation module. Each operates independently, allowing us to context-switch productively rather than destructively.

![AI orchestration workflow](/assets/images/how-ai-redefined-our-engineering-roles/ai-orchestration.png)

The process is fluid and dynamic. When one agent finishes quickly with test cases, we review them and identify gaps. When another hits an architectural decision point, we pause to make that call. When a third discovers undocumented dependencies, we reassess our approach. But importantly, a delay or blocker in one task doesn't stop progress on the others.

The cognitive shift is significant. We're no longer developers; we're development managers. We maintain mental models of multiple evolving codebases simultaneously. We make rapid decisions about architectural direction. We spot integration issues before they manifest.

This isn't easier — it's differently challenging. Mental fatigue shifted from repetitive typing to continuous decision-making. But it's also more engaging. Every day feels like solving puzzles rather than following recipes.

## The Junior Engineer Question: Growth in the Age of AI

One of the biggest concerns we faced came from an unexpected direction — not from junior engineers worried about their jobs, but from senior engineers worried about junior growth. "If AI writes all the code, how will juniors learn?" "Isn't it tempting to just approve AI's code without understanding it?" "Won't AI replace entry-level positions entirely?"

These concerns are valid. We've all learned by writing that fifteenth CRUD endpoint, by debugging that obscure error message, by struggling through implementing our first authentication system. If AI handles all of this, what happens to the learning journey?

### The Temptation Trap

Let's address the elephant in the room first: yes, it's tempting for juniors to just approve AI's suggestions. When overwhelmed by complex features, junior engineers can fall into rubber-stamping AI output. The code works, tests pass, but during code review, they can't explain basic architectural decisions.

This risk requires evolving mentorship approaches. We've seen teams implementing "explanation-driven development" for juniors:

* Requiring explanations for every architectural decision in PRs
* Including "teaching moments" in code reviews where juniors walk through implementations
* Randomly selecting code sections for deep-dive discussions
* Setting the bar not just at "does it work?" but "could you rebuild this from scratch?"

Interestingly, this approach can accelerate learning rather than slow it down. Instead of fighting with syntax errors, juniors spend time understanding why AI chose particular patterns. They see multiple implementation approaches for the same problem. They learn to evaluate trade-offs rather than just finding one solution that works.

### What Juniors Actually Learn Now

The learning curve has shifted dramatically. Traditional junior growth involved months of fighting with syntax and development environments before contributing meaningfully. With AI assistance, juniors ship real features from day one while learning to evaluate architectural approaches and understand system-wide implications. The focus shifts from "how do I write this loop?" to "what's the best way to structure this service?" — a fundamentally more valuable learning experience that accelerates their progression toward architectural thinking.

### Why AI Accelerates Rather Than Stunts Learning

Several factors explain why AI tools can actually accelerate junior development:

**Exposure to Excellence**: Juniors see well-structured code from day one. Claude doesn't write perfect code, but it consistently follows good patterns. Juniors absorb these patterns through repetition, similar to how we learn language by exposure.

**Immediate Productivity**: Nothing kills motivation like spending your first month unable to contribute meaningfully. With AI, juniors contribute real features immediately, building confidence and engagement.

**Focus on Concepts**: Instead of memorizing syntax, juniors learn both technical and business concepts. They understand for instance why we use dependency injection and what problem it solves for our specific product. They grasp business domain concepts like booking workflows or usage metrics before getting bogged down in implementation details. When they understand the why — both technical and business — the how becomes trivial.

**Rapid Iteration**: Juniors can try multiple approaches quickly. "What if we used a factory pattern here?" becomes a 5-minute experiment, not a day-long rewrite. This experimental learning is incredibly powerful.

### The New Entry Bar

We haven't lowered our hiring bar — we've shifted it. We used to test for syntax knowledge and algorithm implementation. Now we test for:

* **Problem decomposition**: Can they break complex problems into AI-manageable chunks?
* **Code review skills**: Can they spot issues in seemingly correct code?
* **System thinking**: Do they understand how components interact?
* **Learning velocity**: How quickly do they absorb new concepts?

Our interview process evolved accordingly. Instead of a classical coding challenge requiring lots of code, candidates review AI-generated code. We give them a PR with subtle bugs and/or architectural issues. We ask them to explain trade-offs between different implementations. We test their ability to guide AI toward better solutions.

This actually made hiring easier. We're not looking for people who memorized LeetCode solutions. We're looking for critical thinkers who can evaluate and improve solutions, regardless of who (or what) wrote them.

## The Trust Factor That Changed Everything

The pivotal moment in our transformation came when we shifted from "Can we trust AI?" to "How do we validate AI's work?" This subtle reframing changed everything.

With early AI coding assistants, engineers hesitated to step away even for coffee. The tool might generate something wrong, or worse, something that looked right but wasn't. With more advanced agents, we learned to give clear instructions and trust them to follow — while maintaining robust validation processes.

This trust isn't blind faith. It's more like delegating to a talented but inexperienced junior developer. You give clear requirements, check in periodically, and thoroughly review the output. You expect some mistakes, but you also expect rapid progress.

The trust equation has three components:

1. **Clear Communication**: We learned to write better specifications. Ambiguity that humans navigate intuitively confuses AI. This forced us to be clearer about requirements, which improved our human-to-human communication too.
2. **Progressive Validation**: We don't wait for complete implementation to review. We check in early and often, course-correcting before problems compound.
3. **Safety Nets**: Comprehensive test suites, staging environments, and code review processes ensure nothing harmful reaches production. AI might write bugs, but so do humans. Our processes catch both.

## The Transformation Continues

Six months ago, if you'd told us engineers would celebrate writing less code, we'd have been skeptical. Engineers pride themselves on craftsmanship, on elegant solutions, on code that reads like poetry. Letting AI write our code felt like letting a machine paint our art.

But we discovered something profound: the art was never in the typing. It was in understanding the problem, designing the solution, and ensuring it serves users well. AI didn't replace our creativity; it removed the barriers to expressing it.

Here's what skeptics miss: AI didn't replace our engineering skills — it amplified them. Every engineer effectively became more senior, focused on architecture and strategy rather than implementation details. The tasks AI handles well — boilerplate, syntax, standard patterns — were never the valuable part of engineering. They were the necessary evil. We didn't lose jobs; we lost job aspects nobody enjoyed. Who genuinely loved writing their fifteenth CRUD endpoint or fixing typos that took hours to find?

Today, our engineers solve more problems, ship more features, and have greater impact than ever before. They're not writing more code — they're delivering more value. They're not typing faster — they're thinking deeper. They're not being replaced — they're being elevated to do the work that actually matters.

The transformation isn't complete. We're still learning how to better orchestrate AI, how to validate its output more efficiently, how to teach it our patterns more effectively. But one thing is clear: this isn't about humans versus machines. It's about humans with machines, achieving what neither could accomplish alone.

In our next post, we'll dive into the practical side: specific Claude Code commands and workflows that actually work, how we structure our context files, and how we use Linear as our context database to give AI the full picture of what we're building. We'll share tips for making AI pair programming more effective and the patterns we've discovered that consistently deliver results.

Have you experienced this role transformation in your own work? How has AI changed what you focus on day-to-day? We'd love to hear your stories — reach out on [X/Twitter](https://twitter.com/TintEngineering) or [LinkedIn](https://www.linkedin.com/company/heytint/).