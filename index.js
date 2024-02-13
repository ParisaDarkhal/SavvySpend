import { createWorker } from "tesseract.js";

(async () => {
  const worker = await createWorker("eng");
  const ret = await worker.recognize(
    "https://fizzleblog.files.wordpress.com/2010/12/grocery-receipt-2.jpg"
  );
  console.log(ret.data.text);
  await worker.terminate();
})();
