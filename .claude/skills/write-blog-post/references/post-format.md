# Blog Post Technical Format

Jekyll-specific formatting, front matter options, and image requirements for tech.tint.ai posts.

## Front Matter

Every post requires this YAML front matter:

```yaml
---
layout: post
title: "Descriptive Title in Quotes"
date: YYYY-MM-DD
author: email@tint.ai
hero_image: "/assets/images/slug/hero.png"
---
```

### Field Details

| Field | Required | Notes |
|-------|----------|-------|
| `layout` | Yes | Always `post` |
| `title` | Yes | Wrap in quotes. Keep descriptive and specific. |
| `date` | Yes | Format: `YYYY-MM-DD` |
| `author` | Yes | **Must be an email** matching a key in `_data/authors.yml`. Never a display name. |
| `hero_image` | Yes | Path to the main hero image. |

## Author Setup

Authors are defined in `_data/authors.yml`:

```yaml
email@tint.ai:
  name: Full Name
  title: Job Title
  bio: Optional biography
  gravatar_hash: md5_hash_of_lowercase_email
```

Generate the gravatar hash:
```bash
echo -n "email@tint.ai" | md5sum | awk '{print $1}'
```

## File Naming

Post files go in `_posts/` with this naming convention:

```
_posts/YYYY-MM-DD-slug-name.md
```

- Date prefix determines publication order and URL.
- Slug should be lowercase, hyphenated, and descriptive.
- The slug becomes part of the URL: `tech.tint.ai/YYYY/MM/DD/slug-name`.

## Image Requirements

Create a directory at `assets/images/slug-name/` containing:

| File | Purpose | Dimensions |
|------|---------|------------|
| `hero.png` | Main post hero image | No strict size, but use high quality |
| `hero-social.png` | OpenGraph / Twitter card | **1200x630px** (required for proper social sharing) |

Additional images for the post body go in the same directory.

### Referencing Images

```markdown
![Alt text description](/assets/images/slug-name/filename.png)
```

## Excerpt Marker

Place `<!--more-->` after the opening paragraph to control where the homepage preview cuts off:

```markdown
We recently faced a connection pool exhaustion issue that was causing 3-second API latencies...

<!--more-->

## The Problem

Our monitoring dashboard showed...
```

## Formatting Elements

### Info Boxes

```html
<div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 1rem 1.25rem; margin: 1rem 0; border-radius: 4px; font-size: 0.9rem; color: #475569;">
Important note or callout text here.
</div>
```

### Collapsible Sections

For long code blocks or supplementary details:

```html
<details>
<summary>Click to expand full implementation</summary>

```python
# Full code here
def long_function():
    pass
```

</details>
```

### Code Blocks

Always specify the language for syntax highlighting:

````markdown
```python
def example():
    return "highlighted"
```
````

### Diff Blocks

Show before/after changes:

````markdown
```diff
- old_value: 600000
+ new_value: 1800000
```
````

## Deployment

Push to the `main` branch. GitHub Pages builds and deploys automatically -- no manual build step required.

## Local Development

```bash
# Start dev server at http://localhost:4000
make start

# Stop dev server
make stop

# View logs
make logs
```
