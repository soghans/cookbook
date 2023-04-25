const path = require("path");
const RecipeDao = require("../../dao/recipe-dao");
const uuidValidator = require("../../util/uuid-validator")

let dao = new RecipeDao(
    path.join(__dirname, "..", "..", "storage", "recipes.json")
);

async function DeleteAbl(req, res) {
    const recipeId = req.params.id;
    const valid = uuidValidator(recipeId)
    try {
        if (valid) {
            await dao.deleteRecipe(recipeId);
            res.json({});
        } else {
            res.status(400).send({
                errorMessage: "validation of input failed",
                params: req.body,
                reason: "requested id is not valid UUID",
            });
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
}

module.exports = DeleteAbl;