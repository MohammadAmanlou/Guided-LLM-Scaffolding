#!/bin/sh
set -eu

exec gunicorn \
    --bind "${GUNICORN_BIND:-0.0.0.0:5000}" \
    --workers "${GUNICORN_WORKERS:-2}" \
    --threads "${GUNICORN_THREADS:-4}" \
    --timeout "${GUNICORN_TIMEOUT:-300}" \
    --access-logfile - \
    --error-logfile - \
    wsgi:app
