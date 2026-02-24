---
description: 'This skill should be used when the user wants to "write a blog post", "draft a blog post", "create a new post", "write for the tech blog", "blog about", "new blog entry", or needs guidance on blog post structure, tone, and formatting for tech.tint.ai. Covers voice guidelines, post structure, front matter setup, and the complete blog creation workflow.'
---

# Write Blog Post

## Workflow

1. **Confirm author exists** in `_data/authors.yml`. If missing, add the entry (email key, name, title, gravatar_hash).
2. **Choose a slug** -- lowercase, hyphenated, descriptive (e.g., `optimizing-connection-pool`).
3. **Create the post file** at `_posts/YYYY-MM-DD-slug.md` using today's date.
4. **Create the image directory** at `assets/images/slug/`. Two hero images are required:
   - `hero.png` -- main post image
   - `hero-social.png` -- 1200x630px for OpenGraph/Twitter cards
5. **Write front matter** (see Front Matter section below).
6. **Draft the post** following the voice and structure guidelines below.
7. **Validate** against the Quick Checklist at the bottom.

## Front Matter

```yaml
---
layout: post
title: "Descriptive Title in Quotes"
date: YYYY-MM-DD
author: email@tint.ai
hero_image: "/assets/images/slug/hero.png"
---
```

**Critical:** The `author` field must be an email address matching a key in `_data/authors.yml`, never a display name.

## Voice Essentials

Write as a team member explaining to a colleague -- professional but not stiff. Full voice reference in `references/tone-guide.md`.

### Team perspective
- Always use "we": "We discovered", "We implemented", "Our API".
- Shared learning: "We learned", not "I learned".

### Problem-solving narrative
- Open with the real-world challenge we faced and its impact.
- Walk through the discovery process, including dead ends.
- Build toward the solution, showing how we arrived there.

### Conversational tone
- Use contractions: "We're", "It's", "We've".
- Casual observations allowed: "That's definitely a lot of work for a single extra request."
- Say "we chose" instead of "we selected". Avoid overly formal language.

### Transparent about process
- Share failed attempts: "Our first approach was to [X]. While promising, we discovered [Y]."
- Acknowledge complexity: "This solution introduces a significant drawback."
- Admit uncertainties: "To our big surprise, the connection pool was far from being full."

### Data-driven
- Lead with specific metrics: "from three to one second", not "significantly faster".
- Before/after comparisons with real numbers.
- Include configuration values, performance benchmarks, error messages.

### Educational and humble
- Explain the "why" behind every decision, not just the "what".
- Use "we found" rather than "you must". Avoid absolute statements.
- Assume technical knowledge (no need to explain pytest or Node.js), but explain our specific context.

## Post Structure

### 1. Opening paragraph
Hook the reader with a concrete result or problem statement. Include specific metrics.

**Template:**
> "We recently faced [specific problem with metric]. This was impacting [customer/system effect]. After [time period] of investigation, we discovered [root cause] and implemented [solution], resulting in [specific improvement with numbers]."

### 2. Excerpt marker
Place `<!--more-->` after the opening paragraph. This controls where the homepage preview cuts off.

### 3. Problem / Symptoms
Describe what we observed, with metrics and error messages. Set the stakes.

### 4. Investigation
Walk through the discovery process. Include monitoring screenshots, logs, and diagrams where helpful.

### 5. Failed attempts (if applicable)
**Template:**
> "Our first approach was to [attempted solution]. While this seemed promising because [reasoning], we discovered [specific problem]. This failed because [technical explanation]."

### 6. Solution implementation
Show working code with clear comments. Use before/after comparisons:

```diff
# Before
- idleTimeoutMillis: 600000, // 10 minutes
# After
+ idleTimeoutMillis: 1800000, // 30 minutes
```

### 7. Results
Before/after metrics with visual evidence (graphs, charts, monitoring screenshots).

### 8. Key takeaways
Numbered principles or actionable lessons. Leave the reader with something they can apply.

## Formatting Conventions

- **Headings:** `##` for main sections, `###` for subsections.
- **Code blocks:** Use syntax-highlighted fenced blocks with language tags.
- **Collapsible sections:** Wrap long code with `<details><summary>...</summary>...</details>`.
- **Info boxes:**
  ```html
  <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 1rem 1.25rem; margin: 1rem 0; border-radius: 4px; font-size: 0.9rem; color: #475569;">
  Note text here
  </div>
  ```
- **Images:** `![Description](/assets/images/slug/filename.png)`
- **Tables:** For comparisons and data summaries.

## Quick Checklist

### Setup
- [ ] Author exists in `_data/authors.yml` with email key
- [ ] Post file named `_posts/YYYY-MM-DD-slug.md`
- [ ] `assets/images/slug/hero.png` exists
- [ ] `assets/images/slug/hero-social.png` (1200x630px) exists
- [ ] Front matter includes `layout`, `title`, `date`, `author` (email), `hero_image`

### Voice
- [ ] Opens with concrete results or problem statement
- [ ] Uses "we" throughout -- never "I"
- [ ] Conversational tone with contractions
- [ ] Explains the "why" behind decisions
- [ ] Admits uncertainties or surprises where relevant

### Content
- [ ] `<!--more-->` excerpt marker after opening paragraph
- [ ] Specific metrics and data (not vague qualifiers)
- [ ] Working code examples with clear comments
- [ ] Before/after comparisons where applicable
- [ ] Failed attempts discussed (if any)
- [ ] Visual elements (diagrams, graphs, screenshots)
- [ ] Practical, reproducible takeaways

### Tone
- [ ] No absolute statements ("you must") -- use "we found"
- [ ] No overly formal language
- [ ] Technical depth assumes developer audience
- [ ] Active voice throughout

## Additional Resources

For the complete voice and tone reference, consult:
- **`references/tone-guide.md`** -- Full voice principles, language guidelines, and example templates
- **`references/post-format.md`** -- Detailed Jekyll formatting, front matter options, and image requirements
