import React, { useEffect } from "react";
import axios from "axios";
// import savvyspend from "../assets/images/savvyspend-logo.png";
import savvyspend from "./images/savvyspend-logo_prev_ui.png";
import { Link } from "react-router-dom";

function Navbar() {
  // This function will run when the component mounts and unmounts
  //   useEffect(() => {
  //     // Create a script element
  //     const script = document.createElement("script");
  //     // Set the script source to your external script
  //     script.src = "/static/libs/your_script.js";
  //     // Set the script to load asynchronously
  //     script.async = true;
  //     // Append the script to the document body
  //     document.body.appendChild(script);
  //     // Return a cleanup function to remove the script
  //     return () => {
  //       document.body.removeChild(script);
  //     };
  //   }, []); // Pass an empty array to run the effect only once

  // Return your navbar JSX
  return (
    <nav className="sticky top-0 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-between p-1 z-index-100">
      {/* Logo */}
      <div className="flex items-center ">
        <img src={savvyspend} alt="SavvySpend logo" className="size-16 mr-2" />
        <h1 className="font-bold text-xl">SavvySpend</h1>
      </div>
      {/* Menu button */}
      {/* <div class="md:hidden">
        <button id="menu-button" class="focus:outline-none">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div> */}
      {/* Links */}
      <div id="menu" className="hidden md:flex space-x-4">
        <a
          href="/upload"
          className="bg-white-100 hover:bg-pink-300 px-3 py-2 rounded"
        >
          Home
        </a>
        <a href="#" className="hover:bg-pink-300 px-3 py-2 rounded">
          About
        </a>
        <Link to="/advice" className="hover:bg-pink-200 px-3 py-2 rounded">
          <button
            // onClick={handleAdviseMe}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 "
          >
            Advise Me
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
