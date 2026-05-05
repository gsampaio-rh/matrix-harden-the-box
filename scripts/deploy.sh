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

echo "==> Installing Helm chart..."
helm upgrade --install "$RELEASE" "$PROJECT_ROOT/chart" \
  -n "$NAMESPACE" \
  --create-namespace \
  $VALUES_ARGS

BUILD_ENABLED=$(helm get values "$RELEASE" -n "$NAMESPACE" --all -o json 2>/dev/null \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(str(d.get('build',{}).get('enabled', False)).lower())" 2>/dev/null \
  || echo "false")

if [[ "$BUILD_ENABLED" == "true" ]]; then
  echo "==> Starting OpenShift build (binary upload)..."
  oc start-build harden-the-box \
    --from-dir="$PROJECT_ROOT" \
    -n "$NAMESPACE" \
    --follow

  echo "==> Waiting for rollout..."
  oc rollout status deployment/harden-the-box -n "$NAMESPACE" --timeout=180s
fi

ROUTE=$(oc get route harden-the-box -n "$NAMESPACE" -o jsonpath='{.spec.host}' 2>/dev/null || echo 'pending')
echo "==> Deploy complete."
echo "Route: https://$ROUTE"
