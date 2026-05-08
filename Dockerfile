FROM ruby:3.1-alpine

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    linux-headers \
    git

# Set working directory
WORKDIR /app

# Copy Gemfile first for better caching
COPY --link Gemfile* ./

# Install gems
RUN bundle install

# Copy the rest of the application
COPY --link . .

# Expose port
EXPOSE 4000

# Start Jekyll server
CMD ["sh", "-c", "CONFIG=_config.yml; [ -f _config.ga.yml ] && CONFIG=_config.yml,_config.ga.yml; bundle exec jekyll serve --host 0.0.0.0 --port ${PORT:-4000} --livereload --config $CONFIG"]