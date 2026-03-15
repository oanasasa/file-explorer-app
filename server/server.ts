import express from "express";
import "dotenv/config";
import cors from "cors";

import router from "./src/routes/files";

const app = express();
const PORT = process.env.FILE_EXPLORER_PORT || 3000;
const ROOT_DIR = process.env.FILE_EXPLORER_ROOT || process.cwd();

console.log(`Root directory: ${ROOT_DIR}`);

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Root directory: ${ROOT_DIR}`);
});
