const path = require("path");
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(
    path.join(__dirname, "..", "..", "storage", "ingredients.json")
);

async function ListAbl(req, res) {
    try {
        const ingredientList = await dao.listIngredients();
        res.json(ingredientList);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = ListAbl;