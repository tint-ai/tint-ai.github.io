#!/bin/bash

# Script to generate 1200x630 social media images from existing hero images
# Requires ImageMagick (install with: sudo apt-get install imagemagick or brew install imagemagick)

echo "Generating social media images (1200x630) from hero images..."
echo ""

# Find all hero.png files
for hero_img in assets/images/*/hero.png; do
    # Get the directory
    dir=$(dirname "$hero_img")

    # Output path for social image
    social_img="${dir}/hero-social.png"

    # Check if ImageMagick is installed
    if ! command -v convert &> /dev/null; then
        echo "ERROR: ImageMagick is not installed."
        echo "Install it with:"
        echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
        echo "  macOS: brew install imagemagick"
        exit 1
    fi

    # Generate 1200x630 image (crop and resize to fit)
    # This will center crop the image to 1.91:1 ratio, then resize to 1200x630
    convert "$hero_img" -resize '1200x630^' -gravity center -extent 1200x630 "$social_img"

    echo "✓ Created: $social_img"
done

echo ""
echo "Done! Created $(find assets/images -name "hero-social.png" | wc -l) social media images."
echo "Each image is 1200x630 pixels, optimized for Facebook, LinkedIn, and Twitter."
