const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
  quantityType: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  dateLastChanged: {
    type: Date,
    default: new Date(),
  },
  checked: {
    type: Boolean,
    default: false,
  },
  groceryExtra: {
    type: Boolean,
    default: false,
  },
});

const Ingredient = mongoose.model('ingredient', IngredientSchema);

module.exports = {
  Ingredient,
  IngredientSchema,
};