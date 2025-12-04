import express from "express";
import multer from "multer";
import { MongoClient, GridFSBucket } from "mongodb";
import { Readable } from "stream";

const app = express();
const port = 3000;

// MongoDB connection
const mongoURL = "your_mongodb_url_here";  // Replace later
const client = new MongoClient(mongoURL);

let bucket;

async function connectDB() {
  await client.connect();
    const db = client.db("fileDB");
      bucket = new GridFSBucket(db, { bucketName: "uploads" });
        console.log("MongoDB Connected");
        }
        connectDB();

        // Multer Setup
        const storage = multer.memoryStorage();
        const upload = multer({ storage });

        // Upload File
        app.post("/upload", upload.single("file"), (req, res) => {
          if (!req.file) return res.status(400).send("No file uploaded");

            const readableFile = new Readable();
              readableFile.push(req.file.buffer);
                readableFile.push(null);

                  const uploadStream = bucket.openUploadStream(req.file.originalname);

                    readableFile.pipe(uploadStream);

                      uploadStream.on("finish", () => {
                          res.json({
                                message: "File uploaded successfully",
                                      fileId: uploadStream.id
                                          });
                                            });
                                            });

                                            // Get File by ID
                                            app.get("/file/:id", (req, res) => {
                                              const fileId = req.params.id;

                                                const downloadStream = bucket.openDownloadStream(fileId);
                                                  downloadStream.pipe(res);

                                                    downloadStream.on("error", () => {
                                                        res.status(404).send("File not found");
                                                          });
                                                          });

                                                          // Delete File
                                                          app.delete("/file/:id", async (req, res) => {
                                                            const fileId = req.params.id;

                                                              try {
                                                                  await bucket.delete(fileId);
                                                                      res.send("File deleted successfully");
                                                                        } catch (error) {
                                                                            res.status(500).send("Error deleting file");
                                                                              }
                                                                              });

                                                                              app.listen(port, () => {
                                                                                console.log(`Server running on port ${port}`);
                                                                                });


