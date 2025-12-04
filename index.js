const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Create uploads folder if not exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    file: req.file.filename,
  });
});

// Get uploaded file
app.get("/files/:name", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }
  res.sendFile(filePath);
});

// Delete uploaded file
app.delete("/files/:name", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  fs.unlinkSync(filePath);
  res.json({ message: "File deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
