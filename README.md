# 📁 File Explorer Application

A full-stack file explorer built with **Node.js + TypeScript** (backend) and **React + Vite + TypeScript** (frontend), styled with **Tailwind CSS**.

---

## 🗂️ Project Structure

```
file-explorer/
├── server/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/
│   │   │   └── files.ts     # Route definitions
│   │   ├── controllers/
│   │   │   └── fileController.ts
│   │   ├── types/
│   │   │   └── index.ts     # Shared TypeScript interfaces
│   │   └── utils/
│   │       └── pathUtils.ts # Path validation & security helpers
│   ├── .env                 # Local environment variables
│   ├── package.json
│   ├── server.ts            # App entry point
│   └── tsconfig.json        # Typescript config file
│
├── client/                  # React + Vite SPA
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── FileList.tsx
│   │   │   ├── FileListItem.tsx
│   │   │   └── DetailPanel.tsx
│   │   ├── hooks/
│   │   │   └── useFileExplorer.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── api/
│   │       └── filesApi.ts
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

## 🚀 Setup & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/file-explorer.git
cd file-explorer
```

### 2. Configure environment variables

The server requires two environment variables. Copy the example file and fill in your own values:

```bash
cd server
cp .env.example .env
```

Then open `server/.env` and set your values:

```env
PORT=3000
FILE_EXPLORER_ROOT=/Users/your-username
```

> **`PORT`** — the port the backend server listens on. Defaults to `3000` if not set.
>
> **`FILE_EXPLORER_ROOT`** — the absolute path to the directory the file explorer is allowed to browse. Set this to any folder on your machine. The server will refuse to serve anything outside this path.

### 3. Start the backend server

```bash
cd server
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.

### 4. Start the frontend client

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** Vite is configured to proxy all `/api/*` requests to `http://localhost:3000`, so no CORS configuration is needed during development.

---

## 🔑 Environment Variables Reference

### `server/.env`

| Variable             | Required | Default         | Description                                   |
| -------------------- | -------- | --------------- | --------------------------------------------- |
| `PORT`               | No       | `3000`          | Port the Express server listens on            |
| `FILE_EXPLORER_ROOT` | Yes      | `process.cwd()` | Absolute path to the browsable root directory |

A `server/.env.example` file is committed to the repository as a template:

```env
PORT=3000
FILE_EXPLORER_ROOT=/Users/your-username
```

> `.env` is listed in `.gitignore` and is never committed. Each developer creates their own local copy from `.env.example`.

---

## 🐳 Running with Docker (Bonus)

Make sure Docker Desktop is running, then from the project root:

```bash
docker-compose up --build
```

Both services will start automatically:

- Frontend → `http://localhost:5173`
- Backend → `http://localhost:3000`

---

## 🔌 API Reference

### `GET /api/files?path={path}`

Returns a list of all files and directories at the given path.

**Response:**

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

Returns detailed metadata for a single file or directory.

**Error responses:**

| Status | Reason                      |
| ------ | --------------------------- |
| `400`  | Malformed or unsafe path    |
| `403`  | Permission denied           |
| `404`  | File or directory not found |
| `500`  | Unexpected server error     |

---

## 🧩 Features

- [x] Directory navigation with clickable breadcrumbs
- [x] File and directory listing with icons
- [x] Detail panel showing name, type, size, and dates
- [x] Navigate into directories by clicking
- [x] Loading and error states
- [x] Keyboard navigation (↑ ↓ to move, Enter to open, Backspace to go up)
- [x] Unit tests
- [x] Docker support

---

## 🏗️ Design Decisions & Assumptions

### Root directory lock

The server is locked to a configurable root directory set via the `FILE_EXPLORER_ROOT` environment variable in `server/.env`. The filesystem above this root is never exposed. This prevents path traversal attacks. If the variable is not set, the server falls back to `process.cwd()`.

### Path traversal protection

All incoming paths are resolved with `path.resolve()` and validated to confirm they start with the allowed root before any `fs` operation is performed.

### Environment variables

Two variables are used — `PORT` for the server port and `FILE_EXPLORER_ROOT` for the browsable directory. Both live in `server/.env` which is not committed. A `server/.env.example` template is committed instead so any developer knows exactly what to configure before running the project.

### Vite proxy

The Vite dev server proxies `/api/*` to `http://localhost:3000`. This means the client always calls relative URLs (`/api/files`) and no CORS headers are needed in development.

### Date format

All dates are returned from the server in **ISO 8601 format** (`toISOString()`). Formatting for display (e.g. locale-friendly strings) is handled purely on the client side.

### File sizes

Raw byte values are returned from the API. The client converts them to human-readable units (KB, MB) using a small utility function.

### No size for directories

Directory entries return `null` for size. Computing recursive directory sizes on every listing request would be a performance problem for large trees.

---

## 🧪 Running Tests

```bash
# Backend tests
cd server
npm run test

# Frontend tests
cd client
npm run test
```

---

## 🛠️ VS Code — Recommended Setup

Install the suggested extensions when prompted, or find them in `.vscode/extensions.json`:

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`
- **TypeScript** — built-in, but keep it updated

The `.vscode/settings.json` in this repo enables format-on-save and sets Prettier as the default formatter automatically.

---

## 📬 Challenges & How They Were Solved

| Challenge                                  | Solution                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| Preventing access outside allowed root     | `path.resolve()` + prefix check against `FILE_EXPLORER_ROOT`                 |
| CORS in development                        | Vite proxy — no extra headers needed                                         |
| Per-developer configuration                | `.env` file for `PORT` and `FILE_EXPLORER_ROOT`, excluded from git           |
| Consistent types between server and client | Separate `types/index.ts` in each package with matching `FileInfo` interface |
| Keyboard nav without focus trapping issues | Global `keydown` listener on `window`, cleaned up in `useEffect` return      |
