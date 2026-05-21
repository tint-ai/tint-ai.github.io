IMAGE_NAME := technical-blog
CONTAINER_NAME := technical-blog-container
PORT ?= 4000

TEST_CONTAINER_NAME := technical-blog-test
TEST_PORT ?= 4001

vendor:
	cp node_modules/vanilla-cookieconsent/dist/cookieconsent.esm.js assets/js/cookieconsent.esm.js
	cp node_modules/vanilla-cookieconsent/dist/cookieconsent.css assets/css/cookieconsent.css

install:
	docker build -t $(IMAGE_NAME) .

start: install
	@echo "Starting Jekyll blog..."
	@docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):$(PORT) \
		-v $(PWD):/app \
		-e PORT=$(PORT) \
		$(IMAGE_NAME)
	@echo "Blog is running at http://localhost:$(PORT)"

stop:
	@echo "Stopping Jekyll blog..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "Blog stopped"

logs:
	docker logs -f $(CONTAINER_NAME)

shell:
	docker exec -it $(CONTAINER_NAME) /bin/sh

test-start: install
	@echo "Starting test server on port $(TEST_PORT)..."
	@docker stop $(TEST_CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(TEST_CONTAINER_NAME) 2>/dev/null || true
	@docker run -d \
		--name $(TEST_CONTAINER_NAME) \
		-p $(TEST_PORT):$(TEST_PORT) \
		-v $(PWD):/app \
		-e PORT=$(TEST_PORT) \
		-e JEKYLL_ENV=test \
		$(IMAGE_NAME)
	@echo "Test server running at http://localhost:$(TEST_PORT)"

test-stop:
	@echo "Stopping test server..."
	@docker stop $(TEST_CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(TEST_CONTAINER_NAME) 2>/dev/null || true
	@echo "Test server stopped"

test: test-start
	@echo "Waiting for test server to be ready..."
	@i=0; until curl -sf http://localhost:$(TEST_PORT) > /dev/null || [ $$i -ge 30 ]; do sleep 2; i=$$((i+1)); done; \
		curl -sf http://localhost:$(TEST_PORT) > /dev/null || { echo "Server failed to start"; $(MAKE) test-stop; exit 1; }
	@echo "Running Playwright tests..."
	@pnpm exec playwright test; STATUS=$$?; $(MAKE) test-stop; exit $$STATUS
