import json
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer

SERVICES = {
    "Auth": "http://film-auth:8080/swagger/v1/swagger.json",
    "Movies": "http://film-movies:8080/swagger/v1/swagger.json",
    "Comments": "http://film-comments:8080/swagger/v1/swagger.json",
    "Search": "http://film-search:8080/swagger/v1/swagger.json",
    "Collections": "http://film-collections:8080/swagger/v1/swagger.json",
}


def fetch(url):
    with urllib.request.urlopen(url, timeout=10) as r:
        return json.loads(r.read())


def rewrite_schema_refs(node, prefix, schema_names):
    if isinstance(node, dict):
        for key, value in node.items():
            if key == "$ref" and isinstance(value, str) and value.startswith("#/components/schemas/"):
                name = value.rsplit("/", 1)[-1]
                if name in schema_names:
                    node[key] = f"#/components/schemas/{prefix}_{name}"
            else:
                rewrite_schema_refs(value, prefix, schema_names)
    elif isinstance(node, list):
        for item in node:
            rewrite_schema_refs(item, prefix, schema_names)


def build_merged():
    merged_paths = {}
    merged_schemas = {}
    security_schemes = {}
    errors = []

    for service, url in SERVICES.items():
        try:
            doc = fetch(url)
        except Exception as e:
            errors.append(f"{service}: {e}")
            continue

        schemas = doc.get("components", {}).get("schemas", {}) or {}
        schema_names = set(schemas.keys())

        rewrite_schema_refs(doc, service, schema_names)

        for path, methods in (doc.get("paths") or {}).items():
            for method, op in methods.items():
                if isinstance(op, dict):
                    original_tags = op.get("tags") or [service]
                    op["tags"] = [f"{service}: {t}" for t in original_tags]
            merged_paths[path] = methods

        for name, schema in schemas.items():
            merged_schemas[f"{service}_{name}"] = schema

        for name, scheme in (doc.get("components", {}).get("securitySchemes") or {}).items():
            security_schemes.setdefault(name, scheme)

    merged = {
        "openapi": "3.0.1",
        "info": {
            "title": "Filmograf API (объединённый)",
            "version": "1.0",
            "description": "Автоматически собран из swagger.json всех сервисов."
            + (f" Не удалось получить: {', '.join(errors)}" if errors else ""),
        },
        "paths": merged_paths,
        "components": {
            "schemas": merged_schemas,
            "securitySchemes": security_schemes,
        },
    }
    if security_schemes:
        merged["security"] = [{name: []} for name in security_schemes]

    return merged


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/merged.json":
            try:
                body = json.dumps(build_merged()).encode()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            except Exception as e:
                body = str(e).encode()
                self.send_response(500)
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    HTTPServer(("0.0.0.0", 8081), Handler).serve_forever()
