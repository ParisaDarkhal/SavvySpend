import React, { useState } from "react";

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setSelectedFile(event.dataTransfer.files[0]);
    setDragOver(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      return alert("Please select a file");
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setSelectedFile(null);
      } else {
        alert("Error uploading file");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="file-uploader">
      <input type="file" onChange={handleFileChange} />
      <div
        className="dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          backgroundColor: dragOver ? "#eee" : "#fff",
          padding: "40px",
          margin: "20px 100px",
          border: "2px dashed #ccc",
          borderRadius: "5px",
        }}
      >
        Drag and drop your file here
      </div>
      <button onClick={handleSubmit}>Upload File</button>
    </div>
  );
}

export default FileUploader;
