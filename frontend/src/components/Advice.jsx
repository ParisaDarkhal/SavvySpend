import React, { useState, useEffect } from "react";
import axios from "axios";

function Advice() {
  const [adviceData, setAdviceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:3001/advice");
        setAdviceData(response.data);
        console.log("adviceData :>> ", adviceData);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div>
      {isLoading && <p>AI is generating your advice...</p>}
      {error && <p>Error! :{error.message}</p>}
      {adviceData && (
        <div>
          <p>Your Shopping Pattern: {adviceData.predicted_shopping_pattern}</p>
          <p>Biggest Expenses: {adviceData.most_spent_category}</p>
          <p>Advice: {adviceData.money_saving_advice}</p>
        </div>
      )}
    </div>
  );
}

export default Advice;
