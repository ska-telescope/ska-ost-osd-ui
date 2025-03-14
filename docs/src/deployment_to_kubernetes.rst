Deployment To Kubernetes
~~~~~~~~~~~~~~~~~~~~~~~~~

The full production system will consist of the OSD accessing OSD REST API.

The umbrella Helm chart can then be deployed with

```
make k8s-install-chart
```

and uninstalled with

```
make k8s-uninstall-chart
```

The `yarn start` script runs two commands: `make set-dev-env-vars` to set the URL for the OSD back-end and `webpack serve` to start the development server.

If using minikube, run `minikube ip` to find the host IP. `KUBE_NAMESPACE` is set to `ska-ost-osd-ui` by default.  
The backend component will also be deployed to a separate pod, which the web application will make requests to.

The UI should then be available externally at `http://<MINIKUBE_IP>/<KUBE_NAMESPACE>/osd/` and the back-end URL will be available at `http://<minikube-ip>/ska-ost-osd/osd/api/v3`
