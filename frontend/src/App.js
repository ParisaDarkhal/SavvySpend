import logo from "./logo.svg";
import "./App.css";
import ReceiptUpload from "./components/ReceiptUpload";

function App() {
  return (
    <div className="App">
      <div>
        <h1>SavvySpend</h1>
        <ReceiptUpload />
      </div>
    </div>
  );
}

export default App;
