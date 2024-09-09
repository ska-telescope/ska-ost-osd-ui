# KUBE_HOST defines the IP address of the Minikube ingress.
KUBE_HOST ?= http://`minikube ip`
# KUBE_NAMESPACE defines the Kubernetes Namespace that will be deployed to
# using Helm.  If this does not already exist it will be created
KUBE_NAMESPACE ?= ska-oso-slt-ui
K8S_CHART ?= ska-oso-slt-ui-umbrella
RELEASE_NAME ?= test

# The default SLT_BACKEND_URL points to the umbrella chart SLT back-end deployment
BACKEND_URL ?= $(KUBE_HOST)/$(KUBE_NAMESPACE)/slt/api/v0
K8S_CHART_PARAMS += \
  --set ska-oso-slt-ui.backendURL=$(BACKEND_URL) \

# include core makefile targets for release management
-include .make/base.mk
-include .make/oci.mk
-include .make/helm.mk
-include .make/k8s.mk

# For the test, dev and integration environment, use the freshly built image in the GitLab registry
ENV_CHECK := $(shell echo $(CI_ENVIRONMENT_SLUG) | egrep 'test|dev|integration')
ifneq ($(ENV_CHECK),)
K8S_CHART_PARAMS += --set ska-oso-slt-ui.image.tag=$(VERSION)-dev.c$(CI_COMMIT_SHORT_SHA) \
	--set ska-oso-slt-ui.image.registry=$(CI_REGISTRY)/ska-telescope/oso/ska-oso-slt-ui
endif

# Set cluster_domain to minikube default (cluster.local) in local development
# (CI_ENVIRONMENT_SLUG should only be defined when running on the CI/CD pipeline)
ifeq ($(CI_ENVIRONMENT_SLUG),)
K8S_CHART_PARAMS += --set global.cluster_domain="cluster.local"
endif

set-dev-env-vars:
	BASE_URL="/" BACKEND_URL=$(BACKEND_URL) ENVJS_FILE=./public/env.js ./scripts/write_env_js.sh
