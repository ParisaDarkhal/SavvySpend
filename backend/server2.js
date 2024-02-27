const express = require("express");
const multer = require("multer");
const path = require("path");
const tesseract = require("tesseract.js");
const { createWorker } = require("tesseract.js");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const OpenAI = require("openai");
const mysql = require("mysql");

const app = express();
const openai = new OpenAI(process.env.OPENAI_API_KEY);
app.use(cors());
app.use(bodyParser.json());
const port = 3001;

//mysql config
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

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
        content: `I have this walmart receipt. I want you to show the date of receipt and also categorize the items in 3 categories: food, clothing, cleaning, miscellaneous. make sure to include the price of each item as well. your response must be in markdown.\n\n${text}`,
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

//get the markdwon info from frontend
app.post("/save", async (req, res) => {
  try {
    // console.log("req.body :>> ", req.body);
    const receipt = req.body.text;
    const JsonReceipt = await convertToJson(receipt);

    ////
    pool.getConnection((err, connection) => {
      if (err) throw err;

      // Extract date

      console.log("JsonReceipt :>> ", JsonReceipt);
      const date = JsonReceipt["Date"];
      console.log("date :>> ", date);

      // Iterate through Food items
      const foodItems = JsonReceipt["CategorizedItems"]["Food"];
      for (const item of foodItems) {
        const name = item.name;
        const price = item.price;
        const categoryId = 1; // Assuming you have a category ID for "Food"

        // Insert each item into receipt table
        const insertItem = `INSERT INTO receipt (category_id, name, price, date) VALUES (?, ?, ?, ?)`;
        connection.query(
          insertItem,
          [categoryId, name, price, date],
          (err, result) => {
            if (err) throw err;
            console.log(`Inserted item: ${name} with price ${price}`);
          }
        );
      }

      // Iterate through Clothing items
      const clothingItems = JsonReceipt["CategorizedItems"]["Clothing"];
      for (const item of clothingItems) {
        const name = item.name;
        const price = item.price;
        const categoryId = 2; // Assuming you have a category ID for "Clothing"

        // Insert each item into receipt table
        const insertItem = `INSERT INTO receipt (category_id, name, price, date) VALUES (?, ?, ?, ?)`;
        connection.query(
          insertItem,
          [categoryId, name, price, date],
          (err, result) => {
            if (err) throw err;
            console.log(`Inserted item: ${name} with price ${price}`);
          }
        );
      }

      // Iterate through Cleaning items
      const cleaningItems = JsonReceipt["CategorizedItems"]["Cleaning"];
      for (const item of cleaningItems) {
        const name = item.name;
        const price = item.price;
        const categoryId = 3; // Assuming you have a category ID for "Cleaning"

        // Insert each item into receipt table
        const insertItem = `INSERT INTO receipt (category_id, name, price, date) VALUES (?, ?, ?, ?)`;
        connection.query(
          insertItem,
          [categoryId, name, price, date],
          (err, result) => {
            if (err) throw err;
            console.log(`Inserted item: ${name} with price ${price}`);
          }
        );
      }

      // Iterate through Miscellaneous items
      const miscellaneousItems =
        JsonReceipt["CategorizedItems"]["Miscellaneous"];
      for (const item of miscellaneousItems) {
        const name = item.name;
        const price = item.price;
        const categoryId = 4; // Assuming you have a category ID for "Miscellaneous"

        // Insert each item into receipt table
        const insertItem = `INSERT INTO receipt (category_id, name, price, date) VALUES (?, ?, ?, ?)`;
        connection.query(
          insertItem,
          [categoryId, name, price, date],
          (err, result) => {
            if (err) throw err;
            console.log(`Inserted item: ${name} with price ${price}`);
          }
        );
      }
      // Handle other categories similarly
      // ...

      connection.release();
      // }
      // );
    });
    res.json({ message: "success", sendData: JsonReceipt });
    ////
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving receipt backend." });
  }
});

//convert markdown response to json
const convertToJson = async (receipt) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `I have this markdown data and I want you to turn it into json format. 
        ## Date of Receipt
        The receipt is dated 06/26/23.
        
        ## Categorized Items
        ### Food
        1. BELL PEPPER - $6.34
        2. CILANTRO - $0.58
        3. CHARD - $1.47
        4. RED ONION - $1.67
        5. BROC CROWNS - $1.53
        6. ORG CELERY - $1.76
        7. BULK PEARS - $1.28
        
        ### Others
        - SUBTOTAL - $13.17
        - TAX - $7.50
        - TOTAL - $120.6
        
        example response:
        {
        "Date":"2023-06-26", "CategorizedItems":{"Food":[{"name":"Bell Pepper","price":6.34},{"name":"Cilantro","price":0.58}]}}.\n\n${receipt}\n\n only return JSON`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  console.log("chatCompletion :>> ", chatCompletion.choices[0].message.content);
  return JSON.parse(chatCompletion.choices[0].message.content);
};

// Serve static files from the "build" directory (assuming your React app is built there)
app.use(express.static("build"));

app.listen(port, () => {
  console.log(`🐱 Server listening on port ${port}`);
});