const path = require("path");
const uuidValidator = require("../../util/uuid-validator")
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(
    path.join(__dirname, "..", "..", "storage", "recipes.json")
);

async function GetAbl(req, res) {
    try {
        const recipeId = req.params.id;
        const valid = uuidValidator(recipeId)
        if (valid) {
            const recipe = await dao.getRecipe(recipeId);
            if (!recipe) {
                res
                    .status(404)
                    .send({ error: `ingredient with id '${recipeId}' not found` });
            }
            res.json(recipe);
        } else {
            res.status(400).send({
                errorMessage: "validation of input failed",
                params: req.body,
                reason: "requested id is not valid UUID",
            });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = GetAbl;