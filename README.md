# SKA OSO SHIFT LOG TOOL UI

This project is the User Interface for the SHIFT LOG TOOL. The Shift Log Tool (OSD) is envisioned as both an “on-line” tool, used in real-time by the operators at the two telescope sites, and as an “off-line” tool,
used at any of the three SKA sites. Its intention is to collate and then provide access to a record of the major events occurring during an operator’s shift.

## Quickstart

To clone this repository, run

```
git clone --recurse-submodules git@gitlab.com:ska-telescope/ost/ska-ost-osd-ui.git
```

To refresh the GitLab Submodule, execute below commands:

```
git submodule update --recursive --remote
git submodule update --init --recursive
```

## Local development and testing

### Config SKA repositories to be a part of the React packages search path

To allow for the SKA libraries to be picked up when you re-install packages,
run `yarn config set @ska-telescope:registry https://artefact.skao.int/repository/npm-internal/`

### Update to the latest SKA repositories in the project

Run `yarn skao:update` to pull in latest SKA repository dependencies to the project

### Installing project dependencies

Run `yarn install` to install the latest project dependencies from package.json and yarn.lock

### Running a front-end development server

Run `yarn start` for a dev server. Navigate to `http://localhost:8090/`. The
app will automatically reload if you change any of the source files.

### Running tests

Run `yarn test:headless` to execute the Cypress tests.

### Running static code analysis

Run `yarn lint` to lint the code.

## Deploying to Kubernetes

The full production system will consist of the OSD UI using the OSD Services, which are
configured to connect to the OSD REST API which connects with a PostgreSQL instance.
To deploy all of these services, run:

```
make oci-build
```

The umbrella Helm chart can then be deployed with

```
make k8s-install-chart
```

and uninstalled with

```
make k8s-uninstall-chart
```

Once installed, the UI should then be available externally at http://<MINIKUBE_IP>/<KUBE_NAMESPACE>/osd/

If using minikube, run `minikube ip` to find the host IP. `KUBE_NAMESPACE` is set to `ska-ost-osd-ui` by default.  
The backend component will also be deployed to a separate pod, which the web application will make requests to.

## Documentation

[![Documentation Status](https://readthedocs.org/projects/ska-telescope-ska-ost-osd-ui/badge/?version=latest)](https://developer.skao.int/projects/ska-ost-osd-ui/en/latest/?badge=latest)

Documentation can be found in the `docs` folder. To build docs, install the
documentation specific requirements:

```
pip3 install -r docs/requirements.txt
```

and build the documentation (will be built in docs/build folder) with

```
make docs-build html
```
