const express = require("express");
const multer = require("multer");
const path = require("path");
const tesseract = require("tesseract.js");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3001;

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, "images"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("receiptImage"), async (req, res) => {
  try {
    // Access the uploaded file information
    const uploadedFile = req.file;
    const filename = uploadedFile.filename;
    const filepath = uploadedFile.path;

    // Process the uploaded file here (e.g., save details, trigger text extraction)
    console.log("File uploaded:", filename, filepath);

    // Send a success response to the frontend
    res.json({ message: "Receipt uploaded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

// Text extraction route
app.post("/extract-text", async (req, res) => {
  try {
    const { filename } = req.body;

    const imagePath = path.join(__dirname, "images", filename);

    // Use Tesseract.js to extract text from the image
    const {
      data: { text },
    } = await tesseract.recognize(imagePath);

    // Send the extracted text to the frontend
    res.json({ message: "Text extracted successfully!", text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error extracting text" });
  }
});

// Serve static files from the "build" directory (assuming your React app is built there)
app.use(express.static("build"));

app.listen(port, () => {
  console.log(`🐱 Server listening on port ${port}`);
});
