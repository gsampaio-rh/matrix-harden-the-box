#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

RELEASE="${RELEASE:-harden-the-box}"
NAMESPACE="${NAMESPACE:-workshop-content}"

if [[ -f "$PROJECT_ROOT/.env" ]]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

VALUES_ARGS=""
if [[ -n "${IMAGE:-}" ]]; then
  VALUES_ARGS="$VALUES_ARGS --set image=$IMAGE"
fi

echo "Deploying Harden the Box exercise..."
helm upgrade --install "$RELEASE" "$PROJECT_ROOT/chart" \
  -n "$NAMESPACE" \
  --create-namespace \
  $VALUES_ARGS \
  --wait

echo "Deploy complete."
echo "Route: $(oc get route harden-the-box -n "$NAMESPACE" -o jsonpath='{.spec.host}' 2>/dev/null || echo 'pending')"
