import logo from "./logo.svg";
import "./App.css";
import ReceiptUpload from "./components/ReceiptUpload";
import FileUploader from "./components/FileUploader";

function App() {
  return (
    <div className="App">
      <div>
        <h1>SavvySpend</h1>
        {/* <ReceiptUpload /> */}
        <FileUploader />
      </div>
    </div>
  );
}

export default App;
