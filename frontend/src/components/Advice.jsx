import React, { useState, useEffect } from "react";
import axios from "axios";
import expenses from "./images/expenses.jpg";
import grocerries from "./images/grocerries.png";
import savvyspend from "./images/savvyspend-logo.png";
import { DNA } from "react-loader-spinner";
import { Chart } from "react-google-charts";

function Advice() {
  const [adviceData, setAdviceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/advice");
        setAdviceData(response.data);
        const chData = [
          ["Category", "NumOfShopped"],
          ["Food", response.data.predicted_shopping_pattern.food || 0],
          ["Clothing", response.data.predicted_shopping_pattern.clothing || 0],
          ["Cleaning", response.data.predicted_shopping_pattern.cleaning || 0],
          [
            "Miscellanous",
            response.data.predicted_shopping_pattern.miscellaneous || 0,
          ],
        ];

        setChartData(chData);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <>
      <div>
        {/* {isLoading && <p>AI is generating your advice...</p>} */}
        {isLoading && (
          <>
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
              type="TailSpin"
            />
            <p>AI is generating your advice...</p>
          </>
        )}
        {error && <p>Error! :{error.message}</p>}
        {adviceData && (
          <>
            <div class="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden md:max-w-5xl m-3">
              <div class="md:flex">
                <div class="md:flex-shrink-0">
                  <img
                    class="h-48 w-full object-cover md:w-48 me-20"
                    src={expenses}
                    alt="expenses"
                  />
                </div>
                <div class="p-8">
                  <div class="bg-gradient-to-r from-pink-500 to-purple-500 text-white uppercase tracking-wide font-semibold text-l text-center md:text-left px-5">
                    Your Shopping Pattern
                  </div>
                  <ul>
                    <li> Food: {adviceData.predicted_shopping_pattern.food}</li>
                    <li>
                      {" "}
                      Clothing: {adviceData.predicted_shopping_pattern.clothing}
                    </li>
                    <li>
                      {" "}
                      Cleaning: {adviceData.predicted_shopping_pattern.cleaning}
                    </li>
                    <li>
                      {" "}
                      miscellaneous:
                      {adviceData.predicted_shopping_pattern.miscellaneous}
                    </li>
                  </ul>
                </div>
                <div>
                  {chartData && (
                    <Chart
                      chartType="PieChart"
                      data={chartData}
                      options={{
                        title: "Expenses",
                      }}
                      width={"100%"}
                      height={"200px"}
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <div class="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden md:max-w-2xl m-3">
                <div class="md:flex">
                  <div class="p-8">
                    <div class="bg-gradient-to-r from-pink-500 to-purple-500 text-white uppercase tracking-wide font-semibold text-l text-center md:text-left px-5">
                      Biggest Expenses:
                    </div>
                    <p class="mt-2 text-gray-500">
                      {adviceData.most_spent_category}
                    </p>
                  </div>
                  <div class="md:flex-shrink-0">
                    <img
                      class="h-48 w-full object-cover md:w-48 ms-20"
                      src={grocerries}
                      alt="grocerries"
                    />
                  </div>
                </div>
              </div>
              <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
                <div class="md:flex md:items-center">
                  <div class="md:flex-shrink-0">
                    <img
                      class="h-48 w-full object-cover md:w-48"
                      src={savvyspend}
                      alt="savvyspand"
                    />
                  </div>
                  <div class="p-8">
                    <div class="bg-gradient-to-r from-pink-500 to-purple-500 text-white uppercase tracking-wide font-semibold text-l text-center  px-5 ">
                      AI Advice
                    </div>
                    <div class="mt-3">
                      <ol>
                        {adviceData.money_saving_advice.map((item, i) => (
                          <li key={i}>
                            {i + 1} - {item}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Advice;
