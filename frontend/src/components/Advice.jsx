import React, { useEffect } from "react";
import axios from "axios";

const handleAdviseMe = async () => {
  try {
    const response = await axios.post("http://localhost:3001/receipts");
    console.log(response.data);
    // Here you can handle the response data
  } catch (error) {
    console.error(error);
    // Here you can handle the error
  }
};

function Advice() {}

export default Advice;
