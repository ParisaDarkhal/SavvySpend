// Use a function expression to define a method that calls the addEventListener method
const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("menu");

const script = {
  menuButton,
  menu,
  // Define a method that calls the addEventListener method
  addMenuListener: function () {
    this.menuButton.addEventListener("click", () => {
      this.menu.classList.toggle("hidden");
    });
  },
};

export default script;

// Call the method on the script object
script.addMenuListener();
