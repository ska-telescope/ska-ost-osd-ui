#!/bin/bash
# This script is used to replace relative paths in index.html with absolute paths
# that include a dynamic Kubernetes namespace. This is required in order to enable
# direct loading of subpaths e.g.`https://<hostname>/{NAMESPACE}/mid/`
# This script is run at container startup time when the image is deployed
# in Kubernetes/Docker environment.

OUTPUT_FILE="${INDEX_FILE:-/usr/share/nginx/html/index.html}"

# Fail on container start if BASE_URL is not defined
[[ -z ${BASE_URL} ]] && { echo "Environment variable BASE_URL is not defined" ; exit 1; }

# Replace any relative paths with the BASE_URL
sed -i -E 's@((src|href)=")./@\1'${BASE_URL}'@g' "${OUTPUT_FILE}"