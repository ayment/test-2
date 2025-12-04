import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const app = express();
app.use(express.static("."));
const uploadDir = "./uploads";

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const random = crypto.randomBytes(4).toString("hex");
    const newName = `${Date.now()}-${random}-${file.originalname}`;
    cb(null, newName);
  }
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  const url = `${req.protocol}://${req.get("host")}/download/${encodeURIComponent(file.filename)}`;
  res.json({ url });
});

app.get("/download/:name", (req, res) => {
  const filePath = path.join(uploadDir, req.params.name);
  if (fs.existsSync(filePath)) {
    return res.download(filePath);
  }
  return res.status(404).send("File expired or not found.");
});

setInterval(() => {
  const files = fs.readdirSync(uploadDir);
  const now = Date.now();

  files.forEach(file => {
    const fullPath = path.join(uploadDir, file);
    const stats = fs.statSync(fullPath);
    const ageHours = (now - stats.mtimeMs) / (1000 * 60 * 60);

    if (ageHours > 4) {
      fs.unlinkSync(fullPath);
      console.log("Deleted expired file:", file);
    }
  });
}, 60 * 60 * 1000);

app.listen(3000, () => console.log("Server running on port 3000"));
