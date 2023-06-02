"use strict";
const fs = require("fs");
const path = require("path");
const RecipeIngredientDao = require("./recipe-ingredient-dao");
let riDao = new RecipeIngredientDao(
    path.join(__dirname, "..", "storage", "recipe_ingredients.json")
);
const IngredientDao = require("./ingredient-dao");
let iDao = new IngredientDao(
    path.join(__dirname, "..", "storage", "ingredients.json")
);
const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "recipes.json");

class RecipeDao {
  constructor(storagePath) {
    this.recipeStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async createRecipe(recipe) {
    let recipeList = await this._loadAllRecipes();
    const ingredientList = []
    if (recipe.ingredients.length < 1) {
      throw new Error( `recipe must have at least one ingredient`);
    }
    for (let i = 0; i < recipe.ingredients.length; i++) {
      let ingredient = await iDao.getIngredient(recipe.ingredients[i].id)
      ingredient.amount = recipe.ingredients[i].amount
      ingredient.unit = recipe.ingredients[i].unit
      ingredientList.push(ingredient)
      if (!ingredient) {
        throw new Error( `ingredient with given id ${recipe.ingredients[i].id} not found`);
      }
    }
    recipe.id = crypto.randomUUID();
    recipe.created_at = new Date()
    for (let i = 0; i < ingredientList.length; i++) {
      let ingredientRecipe = {}
      ingredientRecipe.id = crypto.randomUUID()
      ingredientRecipe.created_at = new Date()
      ingredientRecipe.recipe_id = recipe.id
      ingredientRecipe.ingredient_id = ingredientList[i].id
      ingredientRecipe.amount = ingredientList[i].amount
      ingredientRecipe.unit = ingredientList[i].unit
      await riDao.createRecipeIngredient(ingredientRecipe)
    }
    delete recipe.ingredients
    recipeList.push(recipe);
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeList, null, 2)
    );
    return recipe;
  }

  async getRecipe(id) {
    let recipes = await this._loadAllRecipes();
    let recipe = recipes.find((b) => b.id === id);
    const riList = await riDao.listRecipeIngredientsByRecipeId(recipe.id)
    let ingredientList = []
    for (let i = 0; i < riList.length; i++) {
      ingredientList[i] = await iDao.getIngredient(riList[i].ingredient_id)
    }
     recipe.ingredients = ingredientList
    return recipe
  }

  async updateRecipe(recipe) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex(
      (b) => b.id === recipe.id
    );
    if (recipeIndex < 0) {
      throw new Error(
        `recipe with given id ${recipe.id} not found`
      );
    } else {
      recipeList[recipeIndex] = {
        ...recipeList[recipeIndex],
        ...recipe,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeList, null, 2)
    );
    return recipeList[recipeIndex];
  }

  async deleteRecipe(id) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === id);
    if (recipeIndex >= 0) {
      recipeList.splice(recipeIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeList, null, 2)
    );
    return {};
  }

  async listRecipesWithIngredient() {
    let recipes = await this._loadAllRecipes();
    let recipesList = []
    for (let i = 0; i < recipes.length; i++) {
      recipesList[i] = await this.getRecipe(recipes[i].id)
    }
    return recipesList
  }

  async listRecipes() {
    return await this._loadAllRecipes();
  }

  async _loadAllRecipes() {
    let recipeList;
    try {
      recipeList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        recipeList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return recipeList;
  }

  _getStorageLocation() {
    return this.recipeStoragePath;
  }
}

module.exports = RecipeDao;
