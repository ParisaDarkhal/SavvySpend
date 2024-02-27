const Category = require("./Category");
const Receipt = require("./Receipt");

Category.hasOne(Receipt);
Receipt.belongsTo(Category);

module.exports = { Category, Receipt };
