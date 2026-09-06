#!/usr/bin/env bash

HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}

RELOAD_FLAG="--reload"


uvicorn app.main:app --host $HOST --port $PORT --log-level info $RELOAD_FLAG