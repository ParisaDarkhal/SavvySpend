import React, { useState, useEffect } from "react";
import axios from "axios";
import expenses from "./images/expenses.jpg";
import grocerries from "./images/grocerries.png";
import clothing from "./images/clothing.png";
import cleaning from "./images/cleaning.png";
import miscellaneous from "./images/miscellaneous.png";
import savvyspend from "./images/savvyspend-logo.png";
import { DNA } from "react-loader-spinner";
import { Chart } from "react-google-charts";

function Advice() {
  const [advicesData, setAdvicesData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/advice");
        console.log("response.data:>> ", response.data.adviceData);

        const adviceArray = [];
        Object.entries(response.data.adviceData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index++) {
              adviceArray.push(`${value[i].key}: ${value[i].value}`);
            }
          }
          adviceArray.push(`${key}: ${value}`);
        });
        console.log("adviceArray :>> ", adviceArray);
        // console.log("advicesData :>> ", advicesData);

        setAdvicesData(adviceArray);
        const chData = [
          ["Category", "NumOfShopped"],
          [
            response.data.expenses[0].category,
            response.data.expenses[0].total || 0,
          ],
          [
            response.data.expenses[1].category,
            response.data.expenses[1].total || 0,
          ],
          [
            response.data.expenses[2].category,
            response.data.expenses[2].total || 0,
          ],
          [
            response.data.expenses[3].category,
            response.data.expenses[3].total || 0,
          ],
        ];

        // console.log("chData :>> ", chData);

        await setChartData(chData);
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
        {advicesData && (
          <>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden md:max-w-5xl m-3">
              <div className="md:flex md:items-center">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48 me-20"
                    src={expenses}
                    alt="expenses"
                  />
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white uppercase tracking-wide font-semibold text-l text-center md:text-left px-5">
                    Your Shopping Pattern
                  </div>

                  <p className="py-3">{advicesData[0]}</p>
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
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-5xl m-3">
                <div className="md:flex md:items-center">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover md:w-48"
                      src={savvyspend}
                      alt="savvyspand"
                    />
                  </div>
                  <div className="p-8">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white uppercase tracking-wide font-semibold text-l text-center  px-5 ">
                      AI Advice
                    </div>
                    <div className="mt-3">
                      <ol>
                        {advicesData.slice(1).map((item, i) => (
                          <li key={i}>{item}</li>
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
