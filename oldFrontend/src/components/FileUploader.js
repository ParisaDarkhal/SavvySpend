import React, { useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // functions & event handlers
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return alert("Please select a file");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      return alert("Invalid file type. Please upload an image (JPEG or PNG)");
    }

    // Update state with the selected file
    setSelectedFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];

    if (!selectedFile) {
      return alert("Please select a file");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      return alert("Invalid file type. Please upload an image (JPEG or PNG)");
    }

    // Update state with the selected file
    setSelectedFile(selectedFile);

    // display the filename or size in UI
    console.log("Dropped file:", selectedFile.name);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  // check file, create FormData, send request
  const handleSubmit = async () => {
    if (!selectedFile) {
      return alert("Please select a receipt image");
    }

    const formData = new FormData();
    formData.append("receiptImage", selectedFile);
    // Add the filename explicitly
    formData.append("filename", selectedFile.name);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        alert("Receipt uploaded successfully!");
        // Get the filename from the response or server-side code
        const uploadedFilename = response.data.filename;

        // Send another request to your backend to extract text
        const textExtractionResponse = await axios.post("/extract-text", {
          filename: uploadedFilename,
        });

        if (textExtractionResponse) {
          const extractedText = textExtractionResponse.data.receiptInfo;
          setText(extractedText);

          console.log("Extracted text:", extractedText);
        } else {
          console.error("Error extracting text:", textExtractionResponse.data);
          alert("Error extracting text from receipt");
        }
      } else {
        console.error("Error uploading receipt:", response.data);
        alert("Error uploading receipt");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading and processing receipt");
    }
  };

  const handleSave = async () => {
    try {
      const sendData = await axios.post("/save", { text });
      if (sendData) {
        alert("Receipt saved.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving receipt frontend");
    }
  };

  return (
    <div className="file-uploader">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <input type="file" onChange={handleFileChange} />
      <Dropzone
        onDrop={handleDrop}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              backgroundColor: dragOver ? "#eee" : "#fff",
              padding: "40px",
              margin: "20px 100px",
              border: "2px dashed #ccc",
              borderRadius: "5px",
            }}
          >
            <input {...getInputProps()} />
            {dragOver ? (
              <p>Drop your file here</p>
            ) : (
              <p>Drag and drop your receipt image here</p>
            )}
          </div>
        )}
      </Dropzone>
      <button
        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-300"
        onClick={handleSubmit}
      >
        Upload Receipt
      </button>
      <div className="ReceiptText">
        <h3>Text Extracted</h3>
        <div
          style={{
            backgroundColor: dragOver ? "#eee" : "#fff",
            padding: "40px",
            margin: "20px 100px",
            border: "2px dashed #ccc",
            borderRadius: "5px",
          }}
        >
          {text && (
            <div className="extracted-text-box">
              <h2>Extracted Text</h2>
              <p style={{ whiteSpace: "pre", textAlign: "left" }}>{text}</p>
            </div>
          )}
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
