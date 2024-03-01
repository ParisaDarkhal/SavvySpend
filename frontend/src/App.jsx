import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import Navbar from "./components/Navbar";
import Advice from "./components/Advice";

function App() {
  return (
    <>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/upload" element={<FileUploader />} />
          <Route path="/advice" element={<Advice />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
