# Technical Blog

A Jekyll-based technical blog designed for GitHub Pages with a modern card-based layout.

## Commands

```bash
# Launch the blog on http://localhost:4000
make start

# Stop the blog
make stop
```

## Adding Posts

1. Add your markdown file: `_posts/YYYY-MM-DD-your-post-slug.md`
2. Add the hero image: `assets/images/your-post-slug/hero.png`

### Post Front Matter

```yaml
---
layout: post
title: "Your Post Title"
date: 2023-12-01
read_time: "5 min read"
---
```

The excerpt (shown on homepage) should be followed by `<!--more-->` to indicate where the preview ends.

The hero image will automatically be used as the card header based on the folder name.