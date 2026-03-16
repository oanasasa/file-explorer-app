# File Explorer

A full-stack file explorer built with Node.js + TypeScript on the backend and React + Vite + TypeScript on the frontend, styled with Tailwind CSS.

---

## Running locally

You need **Node.js v18+** and **npm v9+** installed.

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/file-explorer.git
cd file-explorer
```

### 2. Configure the server

```bash
cd server
cp .env
```

Open `server/.env` and set the two variables:

```env
PORT=3000
FILE_EXPLORER_ROOT=/Users/your-username
```

- `PORT` — port the backend listens on (defaults to 3000)
- `FILE_EXPLORER_ROOT` — the folder you want to browse on your machine

### 3. Start the backend

```bash
cd server
npm install
npm run dev
```

API is now running at `http://localhost:3000`.

### 4. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

App is now running at `http://localhost:5173`.

> Both terminals need to stay open at the same time.

---

## Running with Docker

```bash
docker-compose up --build
```

- Frontend → `http://localhost:5173`
- Backend → `http://localhost:3000`

---

## Running tests

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

---

## Features

- Browse directories and files starting from your configured root folder
- Click any folder to navigate into it and see its metadata in the detail panel
- Click any file to see its metadata in the detail panel
- Breadcrumb bar showing your current location — click any segment to jump back
- Detail panel showing name, type, size, created date and last modified date
- File size displayed in readable format (B, KB, MB, GB)
- Dates formatted in a readable locale format
- Loading spinner while fetching directory contents
- Error message displayed if something goes wrong

---

## What it's built with

**Backend**

- Node.js + TypeScript
- Express — HTTP server and routing
- `fs` and `path` — built-in Node modules for reading the filesystem
- `dotenv` — loads environment variables from `.env`
- Vitest + Supertest — unit tests for the API endpoints

**Frontend**

- React 18 + TypeScript
- Vite — dev server and build tool
- Tailwind CSS — styling
- Vitest + Testing Library — unit tests for components and hooks

---

## Project structure

```
file-explorer/
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   └── files.ts            # Route definitions
│   │   ├── controllers/
│   │   │   └── fileController.ts   # Filesystem logic
│   │   ├── types/
│   │   │   └── index.ts            # Shared TypeScript interfaces
│   │   ├── utils/
│   │   │   └── pathUtils.ts        # Path validation
│   │   └── tests/
│   │       ├── fileController.test.ts
│   │       └── fixtures/           # Test files used by server tests
│   ├── .env                        # Your local config (not committed)
│   ├── server.ts               # Express app setup
│   ├── vitest.config.ts
│   └── Dockerfile
│
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── FileList.tsx
│   │   │   ├── FileListItem.tsx
│   │   │   └── DetailPanel.tsx
│   │   ├── hooks/
│   │   │   └── useFileExplorer.ts  # All state and navigation logic
│   │   ├── api/
│   │   │   └── filesApi.ts         # Fetch functions for the two endpoints
│   │   ├── types/
│   │   │   └── index.ts            # FileInfo interface
│   │   └── tests/
│   │       ├── setup.ts
│   │       ├── useFileExplorer.test.ts
│   │       ├── FileListItem.test.tsx
│   │       ├── FileList.test.tsx
│   │       └── Breadcrumb.test.tsx
│   ├── vite.config.ts
│   └── Dockerfile
│
└── README.md
```

---

## API

### `GET /api/files?path={path}`

Returns a list of files and directories at the given path.

```json
[
  {
    "name": "documents",
    "type": "directory",
    "size": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "modifiedAt": "2024-03-01T08:45:00.000Z"
  },
  {
    "name": "notes.txt",
    "type": "file",
    "size": 2048,
    "createdAt": "2024-02-10T14:00:00.000Z",
    "modifiedAt": "2024-02-10T14:00:00.000Z"
  }
]
```

### `GET /api/file?path={path}`

Returns metadata for a single file or directory.

**Error responses**

| Status | Reason                           |
| ------ | -------------------------------- |
| `400`  | Missing path parameter           |
| `403`  | Path is outside the allowed root |
| `404`  | File or directory not found      |
| `500`  | Unexpected server error          |

---

## Design decisions

**No path in the URL**
Navigation is driven entirely by React state. The browser URL does not change when you navigate into folders — no `pushState`, no routing library needed. This keeps the implementation simple and avoids browser security errors from pushing filesystem paths into the URL.

**Directory interaction**
Single click on a directory navigates into it and shows its metadata in the detail panel at the same time. Single click on a file shows its metadata without navigating. This felt like the most natural behaviour for a file explorer.

**Path traversal protection**
Every incoming path is resolved with `path.resolve()` and checked against `FILE_EXPLORER_ROOT` before any filesystem operation. Anything outside the root returns `403`.

**`FILE_EXPLORER_ROOT` via environment variable**
The browsable root is configured per developer via `.env`. The file is never committed — only `.env.example` is, so each developer sets their own path without touching the code.

**Vite proxy**
The Vite dev server proxies all `/api/*` requests to the backend. The client only uses relative URLs — no CORS configuration needed in development.

**Dates and sizes on the client**
Raw ISO dates and byte sizes come from the API. All formatting (locale dates, KB/MB conversion) happens on the client side in utility functions.

**Directories return `null` for size**
Computing recursive directory sizes on every listing request would be slow for large trees. Directories return `null` and display `—` in the UI.

---

## Challenges

| Challenge                                      | Solution                                                                                                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Path traversal attacks                         | `path.resolve()` + `startsWith(ROOT_DIR)` check before any `fs` call                                                                                                                                         |
| Path resolution across different input formats | Paths arrived from the client in three formats — full absolute, absolute without root prefix, and relative. Each case is detected and handled explicitly in `resolveSafePath` before the security check runs |
| `ROOT_DIR` read too early in tests             | Moved to `getRootDir()` function so it reads fresh on every request                                                                                                                                          |
| CORS in development                            | Vite proxy forwards `/api/*` to the backend — no CORS headers needed                                                                                                                                         |
