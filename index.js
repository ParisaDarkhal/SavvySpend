import { createWorker } from "tesseract.js";

(async () => {
  const worker = await createWorker("eng");
  const ret = await worker.recognize("./amazonR.jpg");
  console.log(ret.data.text);
  await worker.terminate();
})();
