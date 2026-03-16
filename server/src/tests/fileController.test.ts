import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import { listDirectory, getFileInfo } from "../controllers/fileController";
import path from "path";

// Use the actual test fixtures folder as root
process.env.FILE_EXPLORER_ROOT = path.resolve(__dirname, "fixtures");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/files", listDirectory);
app.get("/api/file", getFileInfo);

describe("GET /api/files", () => {
  it("returns 400 when path is missing", async () => {
    const res = await request(app).get("/api/files");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing 'path' query parameter");
  });

  it("returns 404 when path does not exist", async () => {
    const res = await request(app).get(
      `/api/files?path=${process.env.FILE_EXPLORER_ROOT}/nonexistent`
    );
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Path not found");
  });

  it("returns 403 when path is outside root", async () => {
    const res = await request(app).get("/api/files?path=../../etc");
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Access denied");
  });

  it("returns an array of FileInfo objects for a valid path", async () => {
    const res = await request(app).get(
      `/api/files?path=${process.env.FILE_EXPLORER_ROOT}`
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const first = res.body[0];
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("type");
    expect(first).toHaveProperty("size");
    expect(first).toHaveProperty("createdAt");
    expect(first).toHaveProperty("modifiedAt");
    expect(["file", "directory"]).toContain(first.type);
  });
});

describe("GET /api/file", () => {
  it("returns 400 when path is missing", async () => {
    const res = await request(app).get("/api/file");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing ?path= query param");
  });

  it("returns 404 when path does not exist", async () => {
    const res = await request(app).get(
      `/api/file?path=${process.env.FILE_EXPLORER_ROOT}/nonexistent`
    );
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Path not found");
  });

  it("returns FileInfo for a valid path", async () => {
    const res = await request(app).get(
      `/api/file?path=${process.env.FILE_EXPLORER_ROOT}`
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("type");
    expect(res.body.type).toBe("directory");
  });
});
