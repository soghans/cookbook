const path = require("path");
const Ajv = require("ajv").default;
const uuidValidator = require("../../util/uuid-validator")
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(
    path.join(__dirname, "..", "..", "storage", "ingredients.json")
);

let schema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
    required: ["name"],
};

async function UpdateAbl(req, res) {
    try {
        const ingredientId = req.params.id;
        var valid = uuidValidator(ingredientId);
        if (!valid) {
            res.status(400).send({
                errorMessage: "validation of input failed",
                params: req.body,
                reason: "requested id is not valid UUID",
            });
        }
        const ajv = new Ajv();
        let ingredient = req.body;
        ingredient.id = ingredientId
        valid = ajv.validate(schema, ingredient);
        if (valid) {
            ingredient = await dao.updateIngredient(ingredient);
            res.json(ingredient);
        } else {
            res.status(400).send({
                errorMessage: "validation of input failed",
                params: ingredient,
                reason: ajv.errors,
            });
        }
    } catch (e) {
        if (e.message.startsWith("ingredient with given id")) {
            res.status(404).json({ error: e.message });
        }
        res.status(500).send(e);
    }
}

module.exports = UpdateAbl;