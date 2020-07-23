require('dotenv').config();
const express = require('express');
const router = express.Router();
const isEmpty = require('is-empty');

// @route GET api/groceries
// @desc Obtain ingredients in user's grocery list
// @access Private
router.get('/', async (req, res) => {
  // Obtain user from request
  const foundUser = req.user;

  // Once user is found, send contents of user's grocery list
  if (foundUser) {
    try {
      res.status(200).json({
        message: 'success',
        payload: foundUser.groceries,
      });
    } catch (err) {
      res.status(400).json('An error has occurred. ' + err);
    }
  } else {
    res.status(404).json('No user found in database.');
  }
});

// @route POST api/groceries
// @desc Add ingredients to user's grocery list
// @access Private
router.post('/', async (req, res) => {
  // Obtain user from request
  const foundUser = req.user;

  // Once user value is obtained, add ingredients to user's grocery list
  if (foundUser) {
    try {
      foundUser.groceries.push(req.body);

      await foundUser.save();

      res.status(201).json({
        message: 'success',
        payload: foundUser.groceries,
      });
    } catch (err) {
      res.status(400).json('An error has occurred. ' + err);
    }
  } else {
    res.status(404).json('No user found in database.');
  }
});

// @route PUT api/groceries/:id
// @desc Update ingredient in user's grocery list by id
// @access Private
router.put('/:id', async (req, res) => {
  // Obtain user from request
  const foundUser = req.user;
  const updatedIngredient = req.body;

  // Once user is obtained, update ingredients in user's grocery list
  if (foundUser) {
    try {
      const currentIngredient = foundUser.groceries.id(req.params.id);

      if (!isEmpty(updatedIngredient.quantity)) {
        currentIngredient.quantity = updatedIngredient.quantity;
      }

      if (!isEmpty(updatedIngredient.quantityType)) {
        currentIngredient.quantityType = updatedIngredient.quantityType;
      }

      currentIngredient.dateLastChanged = new Date();

      await foundUser.save();

      res.status(204).json(null);
    } catch (err) {
      res.status(400).json('An error has occurred. ' + err);
    }
  } else {
    res.status(400).json('No user found in database.');
  }
});

// @route DELETE api/groceries/:id
// @desc Delete ingredient from user's grocery list by id
// @access Private
router.delete('/:id', async (req, res) => {
  // Obtain user from request
  const foundUser = req.user;

  // Once user is found, delete ingredients from user's grocery list
  if (foundUser) {
    try {
      foundUser.groceries.remove(req.params.id);
      await foundUser.save();

      res.status(204).json(null);
    } catch (err) {
      res.status(400).json('An error has occurred. ' + err);
    }
  } else {
    res.status(400).json('No user found in database.');
  }
});

module.exports = router;
