# KUBE_HOST defines the IP address of the Minikube ingress.
KUBE_HOST ?= http://`minikube ip`
# KUBE_NAMESPACE defines the Kubernetes Namespace that will be deployed to
# using Helm.  If this does not already exist it will be created
KUBE_NAMESPACE ?= ska-oso-slt-ui
K8S_CHART ?= ska-oso-slt-ui-umbrella

# The default SLT_BACKEND_URL points to the umbrella chart SLT back-end deployment
BACKEND_URL ?= $(KUBE_HOST)/$(KUBE_NAMESPACE)/slt/api/v0
REACT_APP_USE_LOCAL_DATA = true
K8S_CHART_PARAMS += \
  --set ska-oso-slt-ui.backendURL=$(BACKEND_URL) \
  --set ska-oso-ptt.runtimeEnv.useLocalData=$(REACT_APP_USE_LOCAL_DATA)

# JS Template Variables
JS_E2E_TEST_BASE_URL ?= $(KUBE_HOST)/$(KUBE_NAMESPACE)/slt/
JS_E2E_COVERAGE_COMMAND_ENABLED = false
JS_ESLINT_CONFIG ?= .eslintrc.js

JS_COMMAND_RUNNER ?= yarn
JS_TEST_COMMAND ?= jest

# include core makefile targets for release management
-include .make/base.mk
-include .make/oci.mk
-include .make/helm.mk
-include .make/k8s.mk
-include .make/js.mk


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


js-do-test:
	@mkdir -p $(JS_BUILD_REPORTS_DIRECTORY)
	@rm -rf ./build/tests/unit*.xml
	@{ \
		. $(JS_SUPPORT); \
		$(JS_COMMAND_RUNNER) cypress run \
			--component --headless --browser chrome --config video=false \
			--reporter junit --reporter-options mochaFile=build/tests/unit-tests-[hash].xml; \
		EXIT_CODE=$$?; \
    	echo "js-do-test: Exit code $$EXIT_CODE"; \
		JS_PACKAGE_MANAGER=$(JS_PACKAGE_MANAGER) jsMergeReports ${JS_BUILD_REPORTS_DIRECTORY}/unit-tests.xml "build/tests/unit*.xml"; \
		cp ${JS_BUILD_REPORTS_DIRECTORY}/cobertura-coverage.xml ${JS_BUILD_REPORTS_DIRECTORY}/code-coverage.xml; \
		exit $$EXIT_CODE; \
	}
