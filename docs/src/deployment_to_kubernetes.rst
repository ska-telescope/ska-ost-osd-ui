Deployment To Kubernetes
~~~~~~~~~~~~~~~~~~~~~~~~~

The full production system will consist of the SLT accessing SLT REST API which connects with a PostgreSQL instance.

The umbrella Helm chart can then be deployed with

```
make k8s-install-chart
```

and uninstalled with

```
make k8s-uninstall-chart
```

The `yarn start` script runs two commands: `make set-dev-env-vars` to set the URL for the SLT back-end and `webpack serve` to start the development server.

If using minikube, run `minikube ip` to find the host IP. `KUBE_NAMESPACE` is set to `ska-oso-slt-ui` by default.  
The backend component will also be deployed to a separate pod, which the web application will make requests to.

The UI should then be available externally at `http://<MINIKUBE_IP>/<KUBE_NAMESPACE>/slt/` and the back-end URL will be available at `http://<minikube-ip>/ska-oso-slt-services/slt/api/v0`
