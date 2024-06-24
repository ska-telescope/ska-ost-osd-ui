{{/*
Common labels
*/}}
{{- define "ska-oso-slt-ui.labels" }}
app: {{ .Chart.Name }}
chart: {{ template "ska-oso-slt-ui.chart" . }}
release: {{ .Release.Name }}
{{- end }}

{{/*
set the ingress url path
*/}}
{{- define "ska-oso-slt-ui.ingress" -}}
{{- if .Values.ingress.prependByNamespace -}}
/{{ .Release.Namespace }}/{{ .Values.ingress.path }}
{{- else if .Values.ingress.path -}}
/{{ .Values.ingress.path }}
{{- else -}}

{{- end}}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "ska-oso-slt-ui.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}
