"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "ingredients.json");

class IngredientDao {
  constructor(storagePath) {
    this.ingredientStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async createIngredient(ingredient) {
    let ingredientList = await this._loadAllIngredients();
    ingredient.id = crypto.randomUUID();
    ingredient.created_at = new Date()
    ingredientList.push(ingredient);
    await wf(
      this._getStorageLocation(),
      JSON.stringify(ingredientList, null, 2)
    );
    return ingredient;
  }

  async getIngredient(id) {
    let ingredient = await this._loadAllIngredients();
    const result = ingredient.find((b) => b.id === id);
    return result;
  }

  async updateIngredient(ingredient) {
    let ingredientList = await this._loadAllIngredients();
    const ingredientIndex = ingredientList.findIndex(
      (b) => b.id === ingredient.id
    );
    if (ingredientIndex < 0) {
      throw new Error(
        `ingredient with given id ${ingredient.id} not found`
      );
    } else {
      ingredientList[ingredientIndex] = {
        ...ingredientList[ingredientIndex],
        ...ingredient,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(ingredientList, null, 2)
    );
    return ingredientList[ingredientIndex];
  }

  async deleteIngredient(id) {
    let ingredientList = await this._loadAllIngredients();
    const ingredientIndex = ingredientList.findIndex((b) => b.id === id);
    if (ingredientIndex >= 0) {
      ingredientList.splice(ingredientIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(ingredientList, null, 2)
    );
    return {};
  }

  async listIngredients() {
    return await this._loadAllIngredients();
  }

  async _loadAllIngredients() {
    let ingredientList;
    try {
      ingredientList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        ingredientList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return ingredientList;
  }

  _getStorageLocation() {
    return this.ingredientStoragePath;
  }
}

module.exports = IngredientDao;
