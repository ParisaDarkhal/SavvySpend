import React from "react";
import assistant from "./images/assistant.png";

function About() {
  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden md:max-w-5xl m-3">
        <div className="md:flex md:items-center">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48 me-20"
              src={assistant}
              alt="assistant"
            />
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white uppercase tracking-wide font-semibold text-l text-center md:text-center px-5 py-1 rounded">
              Our Mission
            </div>

            <p className="py-3">
              Our AI-powered budgeting web application aims to empower users by
              providing actionable insights, personalized tips, and smart
              spending recommendations.{" "}
              <span className="font-semibold">SavvySpend</span> is user-friendly
              web application that leverages artificial intelligence (AI) to{" "}
              <span className="font-semibold">Analyze</span> user's expenditure
              based on uploaded receipts,{" "}
              <span className="font-semibold">Predict</span> their shopping
              pattern and <span className="font-semibold">Advise</span> them
              like an intelligent assistant.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden md:max-w-5xl m-3">
        <div className="md:flex md:items-center">
          <div className="md:flex-shrink-0">
            {/* <img
              className="h-48 w-full object-cover md:w-48 me-20"
              src={expenses}
              alt="expenses"
            /> */}
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white uppercase tracking-wide font-semibold text-l text-center md:text-center px-5 py-1 rounded">
              How it works?
            </div>
            <div>
              <h3 className="font-bold py-3">Uploading your Receipts</h3>
              <ol className="list-decimal md:text-left px-4 py-2">
                <li>
                  In the <span className="font-semibold">Home </span>page, click
                  on <span className="font-semibold">Choose File</span> and
                  choose your receipt image. OR{" "}
                  <span className="font-semibold">Drag and drop</span> your
                  receipt image into the assigned box.
                </li>
                <li>
                  Click <span className="font-semibold">Upload Receipt </span>{" "}
                  and confirm upload in the allert box.
                </li>
                <li>
                  Artificial intelligence starts to extract the text from your
                  receipt. When the extracted text appears, click{" "}
                  <span className="font-semibold">Save </span> and confirm
                  saving in the allert box.
                </li>
                <li>Upload all your receipts to get best results.</li>
              </ol>
              <h3 className="font-bold py-3">Getting Advice form AI</h3>
              <ol className="list-decimal md:text-left px-4 py-2">
                <li>
                  Click on <span className="font-semibold">Advise Me </span>{" "}
                  button at the top left of the screen.
                </li>
                <li>
                  Artificial intelligence{" "}
                  <span className="font-semibold">Reviews </span> your shoppings
                  extracted from your receipts and creates a{" "}
                  <span className="font-semibold">Pie Cart </span> giving you a
                  summary of your expenditure.
                </li>
                <li>
                  Then <span className="font-semibold">Analyzes </span> your
                  shopping pattern and based on that, gives you{" "}
                  <span className="font-semibold">Advice </span> to help you{" "}
                  <span className="font-semibold">Save </span> more money.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
