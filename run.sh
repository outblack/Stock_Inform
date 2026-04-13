#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-4321}"
HOST="${HOST:-127.0.0.1}"
APP_URL="http://${HOST}:${PORT}"

cd "$ROOT_DIR"

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  npm install
fi

npm run build

cleanup() {
  if [ -n "${SERVER_PID:-}" ] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

HOST="$HOST" PORT="$PORT" npm run start &
SERVER_PID=$!

for _ in $(seq 1 40); do
  if curl -fsS "${APP_URL}/api/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

open "$APP_URL" >/dev/null 2>&1 || true

echo "Codex Research Room running at ${APP_URL}"
wait "$SERVER_PID"
