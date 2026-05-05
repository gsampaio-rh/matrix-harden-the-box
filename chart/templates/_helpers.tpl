{{- define "htb.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: harden-the-box
{{- end -}}

{{- define "htb.selectorLabels" -}}
app: harden-the-box
{{- end -}}
