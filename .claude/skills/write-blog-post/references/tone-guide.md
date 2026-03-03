# Blog Post Tone & Voice Guide

Complete reference for the Tint engineering blog voice. SKILL.md contains the condensed essentials; this file is the authoritative source.

## Core Voice Principles

### 1. Problem-Solving Narrative

- **Start with the problem.** Open posts with the real-world challenge we faced.
- **Journey format.** Walk readers through our discovery process, including dead ends.
- **Resolution arc.** Build toward the solution, showing how we arrived there.

Example opening:
> "Having spent a few hours understanding and properly configuring our Database Connection Pool helped us divide our maximum API latency by three."

### 2. Conversational Yet Professional

- Write like explaining to a colleague -- professional but not stiff.
- Use contractions: "We're", "It's", "We've" to maintain conversational flow.
- Casual observations allowed: "That's definitely a lot of work for a single extra request."
- Avoid overly formal language: say "we chose" instead of "we selected".

### 3. Transparent About the Process

- Share failed attempts: "During our exploration, we evaluated three potential approaches."
- Explain why things didn't work -- be specific about limitations discovered.
- Acknowledge complexity: "This solution introduces a significant drawback."
- Include workarounds: show how we dealt with temporary issues.

### 4. Educational and Humble

- Explain the "why": don't just show what we did, explain our reasoning.
- Admit uncertainties: "To our big surprise, the connection pool was far from being full."
- Share learning moments: "We learned a lot through the process."
- Avoid absolute statements: use "we found" rather than "you must".

### 5. Developer-to-Developer Communication

- Assume technical knowledge -- no need to explain what pytest or Node.js is.
- But explain our specific context: why we chose certain tools or approaches.
- Include technical details: configuration values, performance metrics, error messages.
- Link to documentation: reference official docs for tools mentioned.

## Language Guidelines

### Confidentiality

- Obfuscate production table names, columns, data constraints, and other implementation details that a malicious actor could abuse.
- Never use real customer or brand partner names. Use "customer X" or "one of our customers" instead.

### Team Perspective

- Always use "we": "We discovered", "We implemented".
- Collective ownership: "Our API", "Our investigation".
- Shared learning: "We learned", not "I learned".

### Balanced Informality

| Allowed | Avoid |
|---------|-------|
| "ChatGPT magic" | Slang, memes |
| "Let's dive in" | Overly casual expressions |
| Light, relevant humor | Forced jokes |

### Action-Oriented

- Active voice: "We configured" not "The pool was configured by us".
- Direct instructions: "Run this command" not "You may want to run".
- Clear outcomes: "This reduced latency by 50%."

## Structural Guidelines

### Results-Oriented Opening

- Lead with the outcome when possible.
- Include specific metrics in the introduction.
- Example: "helped us divide our maximum API latency by three."

### Section Organization

Follow this arc for technical posts:

1. **Problem / Symptoms** -- with metrics establishing stakes
2. **Investigation / Understanding** -- the discovery process
3. **Failed attempts** -- if applicable, what we tried and why it didn't work
4. **Solution implementation** -- with working code
5. **Results** -- with before/after data
6. **Key takeaways** -- actionable lessons

### Data-Driven Content

- Before/after metrics: always show the improvement.
- Specific numbers: "from three to one second" not "significantly faster".
- Visual evidence: include graphs, charts, monitoring screenshots.
- Performance benchmarks: response times, error rates, throughput.

### Code Examples

- Practical, runnable code -- not just snippets but working examples.
- Clear comments explaining what's happening.
- Before/after comparisons showing what changed.

```diff
# Before
- idleTimeoutMillis: 600000, // 10 minutes
# After
+ idleTimeoutMillis: 1800000, // 30 minutes
```

## Content Requirements

### Visual Elements

- Architecture diagrams: show system relationships.
- Performance graphs: before/after comparisons.
- Code screenshots: for IDE-specific features.
- Error messages: actual output from terminals.

### Practical Takeaways

- Reproducible solutions: readers should be able to implement what we describe.
- Configuration examples: real values, not placeholders.
- Gotchas and warnings: "Note that we re-created the same function."

### Context Setting

- Tool versions: when relevant to the solution.
- Environment details: cloud provider, OS, etc. when it matters.
- Links to related posts: build on previous content.

## Example Templates

### Opening Paragraph

> "We recently faced [specific problem with metric]. This was impacting [customer/system effect]. After [time period] of investigation, we discovered [root cause] and implemented [solution], resulting in [specific improvement with numbers]."

### Failure Discussion

> "Our first approach was to [attempted solution]. While this seemed promising because [reasoning], we discovered [specific problem]. This failed because [technical explanation]."

### Solution Presentation

> "The solution was to [approach]. Here's how we implemented it:
>
> [Code example]
>
> This works because [technical explanation]. The key insight was [main learning]."

## Pre-Publish Tone Checklist

Before publishing, ensure the post:

- [ ] Opens with concrete results or problem statement
- [ ] Uses "we" throughout
- [ ] Includes specific metrics and data
- [ ] Shows failed attempts (if any)
- [ ] Provides working code examples
- [ ] Maintains conversational but professional tone
- [ ] Includes visual elements (graphs/screenshots)
- [ ] Explains the "why" behind decisions
- [ ] Offers practical takeaways
- [ ] Admits uncertainties or surprises where relevant
