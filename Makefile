.PHONY: build
build:
	docker compose -f compose-dev.yaml build

.PHONY: up
up:
	docker compose -f compose-dev.yaml up -d
