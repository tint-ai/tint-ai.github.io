---
layout: post
title: "We Tried to Standardise How Our Engineers Use AI. Here's What Happened."
date: 2026-11-03
author: kanwaljit@tint.ai
hero_image: "/assets/images/standardising-how-our-engineers-use-ai/hero.png"
---

We wanted to make AI-assisted development more consistent across our engineering teams. We'd seen how different approaches could lead to inconsistent testing, reviews and code quality, so we built shared tooling around a common workflow.

<!--more-->

What we learnt was that standardising the tooling was the easy part. Getting it to work across different codebases, respecting how experienced engineers work, and figuring how to deal with the new bottlenecks took longer.

Our Principal Software Architect Jonathan has written about our early results and the tooling behind them in [his series on measuring AI's impact](/3-5x-factor-measuring-real-impact-ai-engineering-teams/). This is the story from the engineering management side, a year on.

## How we got here

As Claude Code became our team's main AI tool, engineers had developed their own configurations and habits, making consistency difficult. In September 2025, we created a shared claude-config repo, followed by a plugin in early 2026.

We standardised a shared library of skills and review agents, a recommended `/implement` workflow covering planning through to PR creation, and a few enforced checks. We piloted the approach with one team first, knowing that consistency would come at the cost of some individual autonomy.

<!-- TODO: Add a diagram of the /implement workflow (plan → develop → QA → review → PR). -->

## What we learnt from feedback

Adoption wasn't immediate. It was also hard to measure, we still lack good data on who uses which tools. The workflow was slower by design, with extra review and QA passes. It didn't suit every codebase, particularly those with slow test suites, and some engineers were reluctant to abandon configurations they'd spent months refining.

We used feedback to improve the tooling. One issue came up during a large project, Claude silently dropped requirements and deferred work to tickets that didn't exist or had already been completed. The code could look finished while still missing parts of the agreed scope. It was a reminder that AI can accelerate productivity, but it can also accelerate the introduction of bugs and technical debt if the right guardrails aren't in place. Faster implementation only helps if quality keeps pace.

The next day, we updated the shared workflow so Claude checks for unfinished tasks, skipped tests, placeholder logic and unmet acceptance criteria before opening a PR. Any deferred work must link to a ticket that Claude verifies exists, and the PR must list what's been deferred. Claude also checks the code on main rather than relying on potentially outdated ticket statuses.

<!-- TODO: Add a screenshot of a PR description showing the "Deferred work" section. -->

This didn't remove the need for human review, but it made omissions easier to spot. Every PR now gets an AI review, and we match human review to its impact: a review agent decides whether a change needs a human, and we enforce one when it touches sensitive areas such as payments or authorisation.

We also found that AI performed better in cleaner, well-documented codebases. In older parts of our codebase, it struggled to keep track of the relevant context, and engineers trusted it less. Several described it as a "slot machine", the same request could produce very different results.

Older codebases also exposed hidden assumptions in our shared tooling. One still uses `master` as its default branch rather than `main`. Some automation assumed `main` and silently skipped steps in that repository, reporting success despite doing nothing. Low adoption sometimes said more about the codebase than the engineer.

## How my role changed

I spend less time coaching engineers through implementation details and more time helping them understand the problem, business context and implications of different solutions before they start building. More of the critical work now happens upfront: researching the problem and defining the solution before writing code.

We introduced five guardrails to establish a baseline for working with AI:

- **Understand before you build.** Understand the codebase, read it directly or through Claude. Try the current behaviour as a user, and use Claude as a research partner. Before coding, be able to explain what we're changing, why, how it works today and what exactly will change.
- **You're the author.** Whether you wrote the code or Claude did, the code in your PR is yours.
- **Test meaningfully.** Write unit and integration tests, add end-to-end tests for core user flows, and test manually in an environment close to production.
- **Review your own diff first.** Read the whole change as if someone else had written it before opening a PR.
- **Check it in staging.** Once merged, confirm it works beyond your own machine.

These principles set the baseline, while the shared workflow continues to evolve. We wanted everyone to use a standard workflow, but one approach won't always suit every engineer, ticket or codebase. The standard needs to be revisited as we learn what works and where improvements can be made.

## Are we more productive?

Throughput increased by around 130% between spring 2025 and summer 2026. That's broadly in line with the early measurements in our first posts, now across the whole engineering team rather than a small group of early adopters.

<!-- TODO: Add a throughput graph from spring 2025 to summer 2026. -->

This metric doesn't measure value or prove AI alone caused the increase. But the change in throughput was substantial, and it brought new bottlenecks: as implementation got faster, code review and QA became constraints. We responded by improving our review workflow and adding a QA skill to support quality checks.

## What I'd tell another engineering manager

- **It's worth it.** Overall we've seen good results. I no longer need to check with individual engineers that they've written tests and documentation, because the workflow covers these steps. It has made our day-to-day work smoother.
- **Standardising has drawbacks.** Engineers may feel they've lost the freedom to work the way they'd like, so be ready for some deeper conversations.
- **Allow exceptions.** Sometimes an engineer needs to step outside the shared tooling, and that's fine. Standardising shouldn't stop experimentation either.
- **Shared tooling needs ongoing investment.** It doesn't maintain itself, it needs to be owned, fixed and kept up to date as the models evolve. When one engineer finds a better way of working, the whole team benefits, not just them. For example, one engineer turned 12 months of PR review feedback into around 55 new rules for our Claude config.
- **Expect understanding the problem upfront to take real effort.** It sometimes needs in-depth research. When we skip it, results get worse.
- **Support the mental load, not just delivery.** Some engineers reported feeling distanced from their craft when they're no longer writing the code. One told our AI channel that using AI made him worry about his professional growth.
- **Expect people to be at different stages, even with a standard.** Some of our engineers run automations or experiment with remote development environments. Others prefer to delegate less, especially where close oversight matters, such as billing and payments.
- **Expect the bottleneck to move.** As output rose, the constraint shifted first to code review, then to QA. AI helped there too, we introduced a review workflow that runs specialist reviewers on every change, plus a dedicated QA skill. When a step becomes a bottleneck or something we keep repeating, we automate it. Increasingly, engineering here means improving the AI workflow that builds features, not only building them.

We're not finished. Our tooling changes most weeks, and the models underneath it change faster still. The next challenge is measuring how much AI improves the quality and value of what we deliver, not just how much we produce.
