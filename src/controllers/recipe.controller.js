const Recipe = require("../model/recipe.model");
const logger = require("../utils/logger");

// create recipe
const createRecipe = async (req, res) => {
  try {
    // snsure the title is unique
    const { title } = req.body

    // find a recipe   findOne()
    const foundRecipe = await Recipe.findOne({ title })

    //conditions for found recipe
    if (foundRecipe) {
      return res.status(409).json({
        status: 'error',
        message: `Recipe with ${title} already exist.`,
      })
    }
    // create a recipe object
    // note the req.body
    const newRecipe = new Recipe({
      title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      prepTimeInMinutes: req.Recipe.prepTimeInMinutes,
      cookTimeInMinutes: req.Recipe.cookTimeInMinutes,
      numberOfServings: req.Recipe.numberOfServings,
      category: req.Recipe.category,
      cuisine: req.Recipe.cuisine,
      difficulty: req.Recipe.difficulty,
      image: req.body.image,
      createdBy: req.user._id,
    })

    //save to the database
    const recipe = await Recipe.create(newRecipe)

    // const recipe = await Recipe.create(newRecipe)

    // return a 201(created)
    return res.status(201).json({
      status: 'success',
      message: 'Recipe created successfully',
      data: recipe,
    })
  } catch (error) {
    logger.error(error.message)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal Server Error' })
  }
}

// get all recipes logic
const getAllRecipes = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      title,
      cookingTimeLow,
      minPrepTime,
      maxPrepTime,
      random,
      ingredients,
    } = req.query

    let filter = {}

    if (category) {
      filter.category = category
    }

    if (difficulty) {
      filter.difficulty = difficulty
    }

    if (title) {
      filter.title = new RegExp(title, 'i')
    }
    if (cookingTimeLow) {
      filter.cookTimeInMinutes = { $gte: +cookingTimeLow }
    }
    if (cookingTimeHigh) {
      filter.cookTimeInMinutes = {
        ...(filter.cookTimeInMinutes || {}),
        $lte: +cookingTimeHigh,
      }
    }
    if (minPrepTime) {
      filter.prepTimeInMinutes = { $gte: +minPrepTime }
    }
    if (maxPrepTime) {
      filter.prepTimeInMinutes = {
        ...(filter.prepTimeMinutes || {}),
        $lt: +maxPrepTime,
      }
    }

    if (ingredients) {
      const ingredients = ingredients.split(',')
      filter['ingredients.mame'] = {
        $all: ingredientsList.map(
          (ingredients) => new RegExp(ingredient.trim(), 'i'),
        ),
      }
    }
    if (random) {
      const count = await Recipe.countDocuments(filter)
      const randomIndex = Math.floor(Math.random() * count)
      const randomRecipe = await Recipe.findOne(filter).skip(randomIndex)
      return res.status(200).json({
        status: 'success',
        message: 'fetched random recipe successfully',
        data: randomRecipe,
      })
    }

    const recipes = await Recipe.find(filter)

    return res.status(200).json({
      status: 'success',
      message: 'Fetched Recipes successfully',
      count: recipes.length,
      data: recipes,
    })
  } catch (error) {
    logger.error(error.message)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal Server Error' })
  };
};

// get a particular recipe
const getRecipeById = async (req, res) => {
    try {
      const { recipeId } = req.params;
      const recipe = await Recipe.findById(recipeId);

      if (!recipe) {
        return res.status(404).json({
          status: "error",
          message: `Recipe wiht ID: ${recipeId} not found.`
        });
      };

      return res.status(200).json ({
        status: "success",
        message: `Fetched Recipe ID: ${recipeID} successfully`,
        data: recipe
      })              
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({ status: "error", message:"Internal Server Error"})
    }
};

// update recipe by ID
const updateRecipeById = async (req, res) => {
  try {
      const { recipeId } = req.params;
      const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true, runValidators: true });

      if (!updatedRecipe) {
          return res.status(404).json({
              status: "error",
              message: `Recipe with ID: ${recipeId} not found.`
          })
      };

      return res.status(200).json({
          status: "success", 
          data: updatedRecipe
      });

  } catch (error) {
      logger.error(error.message);
      return res.status(500).json({ status: "error", message:"Internal Server Error" })
  }
};

//delete recipe by ID
const deleteRecipeById = async (req, res) => {
  try {
      const { recipeId } = req.params;
      const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);

      if (!deleteRecipe) {
          return res.status(404).json({
              status: "error",
              message: `Recipe with ID: ${recipeId} not found`
          })
      };

      return res.status(200).json({
          status: "success",
          message: "Recipe deleted successfully"
      });

  } catch (error) {
      logger.error(error.message);
      return res.status(500).json({ status: "error", message: "Internal Server Error" })
  }
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
}
