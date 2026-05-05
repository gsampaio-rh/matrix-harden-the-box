.PHONY: build push deploy build-cluster clean dev dev-controller dev-ui install test help

REGISTRY ?= quay.io/matrix-workshop
TAG ?= latest
IMAGE = $(REGISTRY)/harden-the-box:$(TAG)

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build the container image
	podman build -f build/Dockerfile -t $(IMAGE) .

push: build ## Build and push the container image
	podman push $(IMAGE)

deploy: ## Deploy to OpenShift (Helm + build from source)
	bash scripts/deploy.sh

build-cluster: ## Trigger a new OpenShift build from local source
	oc start-build harden-the-box --from-dir=. -n $${NAMESPACE:-workshop-content} --follow

clean: ## Uninstall Helm release
	helm uninstall harden-the-box -n workshop-content --ignore-not-found || true

install: ## Install all dependencies (Python venv + npm)
	cd controller && python3 -m venv .venv && . .venv/bin/activate && pip install -e ".[dev]"
	cd ui && npm install

dev: ## Run backend + frontend together (open http://localhost:5173)
	@echo "Starting backend on :8080 and frontend on :5173..."
	@cd controller && . .venv/bin/activate && uvicorn app.main:app --reload --port 8080 & \
	 cd ui && npm run dev & \
	 wait

dev-controller: ## Run controller only
	cd controller && uvicorn app.main:app --reload --port 8080

dev-ui: ## Run UI dev server only
	cd ui && npm run dev

test: ## Run all tests (backend + frontend)
	cd controller && python -m pytest tests/ -v
	cd ui && npm test
