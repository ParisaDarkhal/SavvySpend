const express = require("express");
const multer = require("multer");
const path = require("path");
const tesseract = require("tesseract.js");
const { createWorker } = require("tesseract.js");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const OpenAI = require("openai");
const { Sequelize } = require("sequelize");
const sequelize = require("./config/connection");
const Receipt = require("./db/models/Receipt");

const app = express();
const openai = new OpenAI(process.env.OPENAI_API_KEY);
app.use(cors());
app.use(bodyParser.json());
const port = 3001;

const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
  }
);

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
        content: `I have this walmart receipt. I want you to show the date of receipt and also categorize the items in 3 categories: food, clothing, cleaning, miscellaneous. make sure to include the price of each item as well. make sure that the subtotal, tax and total should not be in any of the aforementioned categories. your response must be in markdown.\n\n${text}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  // console.log("chatCompletion :>> ", chatCompletion.choices[0].message.content);
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
    const receipt = req.body.text;
    const JsonReceipt = await convertToJson(receipt);

    // Extract date
    const date = JsonReceipt["Date"];

    // Define a function to insert items
    const insertItems = async (items, category) => {
      if (!items) {
        return;
      }
      for (const item of items) {
        const name = item.name;
        const price = item.price;

        try {
          await Receipt.create({
            category,
            name,
            price,
            date,
          });
          // console.log(`Inserted item: ${name} with price ${price}`);
        } catch (err) {
          console.error(`Failed to insert item: ${name}. Error: ${err}`);
        }
      }
    };

    // Insert items by category
    await insertItems(JsonReceipt["CategorizedItems"]["Food"] || [], "food");
    await insertItems(
      JsonReceipt["CategorizedItems"]["Clothing"] || [],
      "clothing"
    );
    await insertItems(
      JsonReceipt["CategorizedItems"]["Cleaning"] || [],
      "cleaning"
    );
    await insertItems(
      JsonReceipt["CategorizedItems"]["Miscellaneous"] || [],
      "miscellaneous"
    );
    // Handle other categories similarly

    res.json({ message: "success", sendData: JsonReceipt });
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

  return JSON.parse(chatCompletion.choices[0].message.content);
};

///////////
//receive data from database and give advice to the user
app.get("/advice", async (req, res) => {
  try {
    const receipts = await Receipt.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.literal("*")), "expenses"],
        [sequelize.fn("SUM", sequelize.col("price")), "total"],
        "category",
      ],
      group: ["category"],
    });
    // console.log("receipts :>> ", receipts);
    const adviceData = await giveAdvice(receipts);
    res.json(adviceData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching receipts" });
  }
});

// give advice to the user
const giveAdvice = async (receiptData) => {
  const expenses = receiptData.map((receipt) => receipt.dataValues);
  console.log("expenses :>> ", expenses);
  const AIanalize = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `I have  the list of my shopping during the last month here: ${expenses}\n\n in which "expences" is the number of occurance of that shopping category, "total" is in dollar and shows the amount of money spent in that category.\n\n I want you to review my shopping list and predict my shopping pattern and tell me about it (predicted_shopping_pattern) return the answer in this shape in four categories including: food, clothing, cleaning, miscellaneous: for example: predicted_shopping_pattern: { ${expenses[0].category}:  ${expenses[0].total} , ${expenses[1].category}:  ${expenses[1].total} , ${expenses[2].category}:  ${expenses[2].total}, ${expenses[3].category}:  ${expenses[3].total}}. don't round the numbers . Then tell me what I spend the most on (most_spent_category). Then give me 3 advice based on my shopping pattern to help me save money, based on my shopping pattern (money_saving_advice). only return JSON`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  // console.log("AIanalize :>> ", AIanalize);
  const AIresponse = JSON.parse(AIanalize.choices[0].message.content);
  console.log("AIresponse :>> ", AIresponse);
  return AIresponse;
  // res.json(AIresponse);
};
///////////

// Serve static files from the "build" directory (assuming your React app is built there)
app.use(express.static("build"));

// Starts the server to begin listening: first we need to connect to the database and then run the server
// false can be turned to true ONLY first time when I want to make the database
sequelize.sync({ force: false }).then(() => {
  database.sync();
  app.listen(port, () => {
    console.log(`🐱 Server listening on port ${port}`);
  });
});
