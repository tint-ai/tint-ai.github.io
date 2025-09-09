## Project Overview

This is the Tint technical blog built with Jekyll and hosted on GitHub Pages at tech.tint.ai. It's a static site generator that converts Markdown posts into a professional engineering blog.

## Development Commands

### Local Development
```bash
# Start the development server (runs Jekyll in Docker on http://localhost:4000)
make start

# Stop the development server
make stop

# View container logs
make logs
```

### Direct Jekyll Commands (inside container)
```bash
# Build the site
jekyll build

# Serve with live reload
jekyll serve --host 0.0.0.0 --watch --force_polling --livereload
```

## Architecture & Structure

### Key Directories
- `_posts/`: Blog posts in YYYY-MM-DD-slug.md format
- `_layouts/`: HTML templates (default.html wraps all pages, post.html for blog posts)
- `assets/images/`: Hero images organized by post slug
- `assets/css/`: SCSS stylesheets (main.scss imports all partials)

### Adding New Blog Posts

1. Create a new file in `_posts/` with format: `YYYY-MM-DD-your-post-slug.md`
2. Add required front matter:
```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD
author: Author Name
---
```
3. Add hero image at `assets/images/your-post-slug/hero.png`
4. Use `<!--more-->` to separate excerpt from full content

### Important Configuration

- **_config.yml**: Site metadata, plugins, and Jekyll settings
- **Dockerfile**: Ruby 3.1 Alpine container for consistent development environment
- **CNAME**: Custom domain configuration (tech.tint.ai)

### Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the main branch. No manual build step required.

### Styling Guidelines

- Uses Inter and Red Hat Display fonts
- Card-based layout for blog post grid
- Responsive design with mobile-first approach
- Color scheme defined in `_variables.scss`

### Common Tasks

- **Update site metadata**: Edit `_config.yml`
- **Modify layout**: Edit files in `_layouts/`
- **Change styling**: Edit SCSS files in `assets/css/`
- **Add images**: Place in `assets/images/[post-slug]/`