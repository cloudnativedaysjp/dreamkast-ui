.PHONY: build
build:
	SENTRY_AUTH_TOKEN=$(SENTRY_AUTH_TOKEN) docker compose -f compose-dev.yaml build

.PHONY: up
up:
	docker compose -f compose-dev.yaml up -d
