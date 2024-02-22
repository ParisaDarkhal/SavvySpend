const express = require("express");
const multer = require("multer");
const path = require("path");
const tesseract = require("tesseract.js");
const { createWorker } = require("tesseract.js");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const openai = new OpenAI(process.env.OPENAI_API_KEY);
app.use(cors());
app.use(bodyParser.json());
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
    res.json({ message: "Receipt uploaded successfully!", filename: filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

//categorize items in receipt
const categorizeItems = async (text) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `I have this walmart receipt. I want you to show the date of receipt and also categorize the items in 3 categories: food, clothing, cleaning, others. make sure to include the price of each item as well. your response must be in markdown.\n\n${text}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  console.log("chatCompletion :>> ", chatCompletion.choices[0].message.content);
  return chatCompletion.choices[0].message.content;
};
// Text extraction route
app.post("/extract-text", async (req, res) => {
  try {
    const { filename } = req.body;

    const imagePath = path.join(__dirname, "images", filename);

    const worker = await createWorker("eng");
    const ret = await worker.recognize(imagePath);
    const text = ret.data.text;
    await worker.terminate();
    const receiptInfo = await categorizeItems(text);

    // Send the extracted text to the frontend
    res.json({
      message: "Text extracted successfully!",
      receiptInfo: receiptInfo,
    });
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
