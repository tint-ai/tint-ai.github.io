IMAGE_NAME := technical-blog
CONTAINER_NAME := technical-blog-container
PORT := 4000

install:
	docker build -t $(IMAGE_NAME) .

start: install
	@echo "Starting Jekyll blog..."
	@docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):4000 \
		-v $(PWD):/app \
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
