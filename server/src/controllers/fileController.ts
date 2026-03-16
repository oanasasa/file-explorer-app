import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.env.FILE_EXPLORER_ROOT || process.cwd();

console.log("File controller initialized, root directory:", ROOT_DIR);
function resolveSafePath(userPath: string): string {
  const resolved = path.resolve(ROOT_DIR, userPath.replace(/^\//, ""));

  if (!resolved.startsWith(ROOT_DIR)) {
    throw new Error("FORBIDDEN");
  }

  return resolved;
}
export const listDirectory = (req: Request, res: Response) => {
  console.log("Request received, path:", req.query.path);
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
};

export const getFileInfo = (req: Request, res: Response) => {
  console.log("Request received, path:", req.query.path);
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
};
