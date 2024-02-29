import React, { useEffect } from "react";
import savvyspend from "../assets/images/savvyspend-logo.png";

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
    <nav className="sticky top-0 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-between p-4">
      {/* Logo */}
      <div className="flex items-center ">
        {/* <img src="savvyspend" alt="SavvySpend logo" class="h-8 mr-2" /> */}
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
      {/* <div id="menu" class="hidden md:flex space-x-4">
        <a href="#" class="hover:bg-pink-400 px-3 py-2 rounded">
          Home
        </a>
        <a href="#" class="hover:bg-pink-400 px-3 py-2 rounded">
          About
        </a>
        <a href="#" class="hover:bg-pink-400 px-3 py-2 rounded">
          Services
        </a>
        <a href="#" class="hover:bg-pink-400 px-3 py-2 rounded">
          Contact
        </a>
      </div> */}
    </nav>
  );
}

export default Navbar;
