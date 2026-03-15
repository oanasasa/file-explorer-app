import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

const ROOT_DIR = process.cwd();

app.use(cors());
app.use(express.json());

function resolveSafePath(userPath: string): string {
  const resolved = path.resolve(userPath);

  if (!resolved.startsWith(ROOT_DIR)) {
    throw new Error("FORBIDDEN");
  }

  return resolved;
}

app.get("/api/files", (req: Request, res: Response) => {
  const userPath = req.query.path as string;

  if (!userPath) {
    res.status(400).json({ error: "Missing 'path' query parameter" });
    return;
  }

  try {
    const safePath = resolveSafePath(userPath);

    if (!fs.existsSync(safePath)) {
      res.status(404).json({ error: "Path not found" });
      return;
    }

    const entries = fs.readdirSync(safePath);

    const result = entries.map((name) => {
      const fullPath = path.join(safePath, name);
      const stats = fs.statSync(fullPath);

      return {
        name,
        type: stats.isDirectory() ? "directory" : "file",
        size: stats.isFile() ? stats.size : null,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString(),
      };
    });

    res.json(result);
  } catch (err: any) {
    if (err.message === "FORBIDDEN") {
      res.status(403).json({ error: "Access denied" });
    } else if (err.code === "EACCES") {
      res.status(403).json({ error: "Permission denied" });
    } else if (err.code === "ENOTDIR") {
      res.status(400).json({ error: "Path is not a directory" });
    } else {
      res.status(500).json({ error: "Unexpected server error" });
    }
  }
});

app.get("/api/file", (req: Request, res: Response) => {
  const userPath = req.query.path as string;

  if (!userPath) {
    res.status(400).json({ error: "Missing ?path= query param" });
    return;
  }

  try {
    const safePath = resolveSafePath(userPath);

    if (!fs.existsSync(safePath)) {
      res.status(404).json({ error: "Path not found" });
      return;
    }

    const stats = fs.statSync(safePath);

    res.json({
      name: path.basename(safePath),
      type: stats.isDirectory() ? "directory" : "file",
      size: stats.isFile() ? stats.size : null,
      createdAt: stats.birthtime.toISOString(),
      modifiedAt: stats.mtime.toISOString(),
    });
  } catch (err: any) {
    if (err.message === "FORBIDDEN") {
      res.status(403).json({ error: "Access denied" });
    } else if (err.code === "EACCES") {
      res.status(403).json({ error: "Permission denied" });
    } else {
      res.status(500).json({ error: "Unexpected server error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Root directory: ${ROOT_DIR}`);
});
