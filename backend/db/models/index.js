const Category = require("./Category");
const Receipt = require("./Recipt");

Category.hasOne(Receipt);
Receipt.belongsTo(Category);

module.exports = { Category, Receipt };
