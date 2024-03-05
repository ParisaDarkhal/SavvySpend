import React from "react";

function About() {
  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden md:max-w-5xl m-3">
        <div className="md:flex md:items-center">
          <div className="md:flex-shrink-0"></div>
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
    </>
  );
}

export default About;
