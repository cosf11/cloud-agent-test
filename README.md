# cloud-agent-test

A small full-stack **Task Board** app used to validate the Cloud Agent development environment end to end. It has a Node/Express JSON API and a dependency-free browser frontend.

## Requirements

- Node.js >= 20 (Node 22 recommended)
- npm

## Getting started

```bash
npm ci          # install dependencies
npm run dev     # start the dev server with auto-reload on http://localhost:3000
```

Then open http://localhost:3000 and add, complete, and delete tasks.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the server (`node server.js`). |
| `npm run dev` | Run the server with `--watch` auto-reload. |
| `npm test` | Run the unit tests (`node --test`). |
| `npm run lint` | Lint the project with ESLint. |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check. |
| `GET` | `/api/tasks` | List tasks. |
| `POST` | `/api/tasks` | Create a task (`{ "title": "..." }`). |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle completion. |
| `DELETE` | `/api/tasks/:id` | Delete a task. |
| `POST` | `/api/tasks/clear-completed` | Remove all completed tasks. |

## Project layout

```
server.js        Express app + server bootstrap
src/store.js     In-memory task store (unit-tested)
public/          Static frontend (HTML/CSS/JS)
test/            Unit tests (node:test)
```

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm ci` and runs the dev
server in a `dev-server` terminal so the app is available while an agent works.
