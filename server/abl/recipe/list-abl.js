const path = require("path");
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(
    path.join(__dirname, "..", "..", "storage", "recipes.json")
);

async function ListAbl(req, res) {
    const withIngredient = req.query.ingredients
    try {
        let recipeList = []
        if (withIngredient && withIngredient !== 'false') {
            recipeList = await dao.listRecipesWithIngredient();
        } else {
            recipeList = await dao.listRecipes();
        }
        res.json(recipeList);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = ListAbl;