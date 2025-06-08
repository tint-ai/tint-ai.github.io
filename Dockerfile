FROM ruby:3.1-alpine

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    linux-headers \
    git

# Set working directory
WORKDIR /app

# Copy Gemfile first for better caching
COPY Gemfile* ./

# Install gems
RUN bundle install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 4000

# Start Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--livereload"] 