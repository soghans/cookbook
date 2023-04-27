"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "recipe-ingredients.json");

class RecipeIngredientDao {
  constructor(storagePath) {
    this.recipeStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async createRecipeIngredient(recipeIngredient) {
    let recipeIngredientList = await this._loadAllRecipeIngredients();
    recipeIngredient.id = crypto.randomUUID();
    recipeIngredient.created_at = new Date()
    recipeIngredientList.push(recipeIngredient);
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeIngredientList, null, 2)
    );
    return recipeIngredient;
  }

  async getRecipeIngredient(id) {
    let recipeIngredient = await this._loadAllRecipeIngredients();
    return recipeIngredient.findIndex((b) => b.id === id);
  }

  async updateRecipeIngredient(recipeIngredient) {
    let recipeIngredientList = await this._loadAllRecipeIngredients();
    const recipeIngredientIndex = recipeIngredientList.findIndex(
      (b) => b.id === recipeIngredient.id
    );
    if (recipeIngredientIndex < 0) {
      throw new Error(
        `ingredient with given id ${recipeIngredient.id} not found`
      );
    } else {
      recipeIngredientList[recipeIngredientIndex] = {
        ...recipeIngredientList[recipeIngredientIndex],
        ...recipeIngredient,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeIngredientList, null, 2)
    );
    return recipeIngredientList[recipeIngredientIndex];
  }

  async deleteRecipeIngredient(id) {
    let recipeIngredientList = await this._loadAllRecipeIngredients();
    const recipeIngredientIndex = recipeIngredientList.findIndex((b) => b.id === id);
    if (recipeIngredientIndex >= 0) {
      recipeIngredientList.splice(recipeIngredientIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeIngredientList, null, 2)
    );
    return {};
  }

  async listRecipeIngredients() {
    return await this._loadAllRecipeIngredients();
  }

  async listRecipeIngredientsByRecipeId(recipeId) {
    let recipeIngredient = await this._loadAllRecipeIngredients();
    return recipeIngredient.findIndex((b) => b.id === id);
  }

  async listRecipeIngredientsByIngredientId(ingredientId) {
    let recipeIngredient = await this._loadAllRecipeIngredients();
    return recipeIngredient.findIndex((b) => b.id === id);
  }

  async _loadAllRecipeIngredients() {
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

module.exports = RecipeIngredientDao;
