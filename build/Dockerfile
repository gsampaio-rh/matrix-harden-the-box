FROM node:22-alpine AS ui-build
WORKDIR /build
COPY ui/package.json ui/package-lock.json* ./
RUN npm ci --ignore-scripts || npm install --ignore-scripts
COPY ui/ ./
RUN npm run build

FROM registry.access.redhat.com/ubi9/python-312:latest
WORKDIR /app
COPY controller/pyproject.toml ./
RUN pip install --no-cache-dir . 2>/dev/null || pip install --no-cache-dir -r <(python -c "
import tomllib, pathlib
d = tomllib.loads(pathlib.Path('pyproject.toml').read_text())
for dep in d['project']['dependencies']:
    print(dep)
")
COPY controller/app ./app
COPY --from=ui-build /build/dist ./static

EXPOSE 8080
USER 1001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
