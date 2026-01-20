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

### First Time Setup (Add Yourself as an Author)

Edit `_data/authors.yml` and add your entry:

```yaml
your.email@tint.ai:
  name: Your Name
  title: Your Title
  bio: Your bio (optional)
  gravatar_hash: your_md5_hash  # MD5 hash of your lowercased email
```

- The `gravatar_hash` is the MD5 hash of your lowercased email address (used to fetch your profile picture from gravatar.com)
- To set up your profile picture: Create an account at [gravatar.com](https://gravatar.com) with your email and upload your photo
- Generate MD5 hash:
  ```bash
  echo -n "your.email@tint.ai" | md5sum | awk '{print $1}'
  ```
  Or use any online MD5 generator with your email in lowercase

### Creating a New Post

1. Add your markdown file: `_posts/YYYY-MM-DD-your-post-slug.md`
2. Add hero images:
   - `assets/images/your-post-slug/hero.png` - Main hero image for the blog post
   - `assets/images/your-post-slug/hero-social.png` - Social media preview image (1200x630px for OpenGraph/Twitter cards)

### Post Front Matter

**IMPORTANT: Use your email address for author, NOT your name**

```yaml
---
layout: post
title: "Your Post Title"
date: 2023-12-01
author: your.email@tint.ai
hero_image: "/assets/images/your-post-slug/hero.png"
---
```

The excerpt (shown on homepage) should be followed by `<!--more-->` to indicate where the preview ends.

The `author` field must match an email key in `_data/authors.yml`, not the display name.