const path = require("path");
const IngredientDao = require("../../dao/ingredient-dao");
const uuidValidator = require("../../util/uuid-validator")

let dao = new IngredientDao(
    path.join(__dirname, "..", "..", "storage", "ingredients.json")
);

async function DeleteAbl(req, res) {
    const ingredientId = req.params.id;
    const valid = uuidValidator(ingredientId)
    try {
        if (valid) {
            await dao.deleteIngredient(ingredientId);
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