import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import Navbar from "./components/Navbar";
import Advice from "./components/Advice";
import About from "./components/About";

function App() {
  return (
    <>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/upload" element={<FileUploader />} />
          <Route path="/advice" element={<Advice />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
