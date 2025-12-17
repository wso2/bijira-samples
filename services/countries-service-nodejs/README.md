# Countries GraphQL Service (Node.js)

## Overview

This is a simple GraphQL service implementation for the Countries schema used by the `countries-api` sample.

It serves a GraphQL endpoint at:

- `POST /graphql`
- `GET /healthz`

The service uses an in-memory dataset and implements the schema defined in `../../countries-api/schema.graphql`.

## Repository File Structure

| Filepath      | Description |
|--------------|-------------|
| `app.mjs`     | Express app + GraphQL endpoint implementation |
| `index.mjs`   | Service entrypoint |
| `Dockerfile`  | Container build for deployment |
| `package.json`| Dependencies and scripts |

## Run locally

From this directory:

```bash
npm install
npm start
```

Then invoke:

```bash
curl -sS http://localhost:8080/graphql \
  -H 'content-type: application/json' \
  --data-binary '{"query":"{ countries { code name continent { code name } } }"}'
```


