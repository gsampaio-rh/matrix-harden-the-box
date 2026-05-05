.PHONY: build push deploy clean dev-controller dev-ui test help

REGISTRY ?= quay.io/matrix-workshop
TAG ?= latest
IMAGE = $(REGISTRY)/harden-the-box:$(TAG)

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build the container image
	podman build -f build/Dockerfile -t $(IMAGE) .

push: build ## Build and push the container image
	podman push $(IMAGE)

deploy: ## Deploy to OpenShift via Helm
	bash scripts/deploy.sh

clean: ## Uninstall Helm release
	helm uninstall harden-the-box -n exercise-system --ignore-not-found || true

dev-controller: ## Run controller locally
	cd controller && uvicorn app.main:app --reload --port 8080

dev-ui: ## Run UI dev server locally
	cd ui && npm run dev

test: ## Run controller tests
	cd controller && python -m pytest tests/ -v
