import { Router } from "express";
import { listDirectory, getFileInfo } from "../controllers/fileController";

const router = Router();

router.get("/files", listDirectory);
router.get("/file", getFileInfo);

export default router;
