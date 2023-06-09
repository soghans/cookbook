const path = require("path");
const Ajv = require("ajv").default;
const uuidValidator = require("../../util/uuid-validator")
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(
    path.join(__dirname, "..", "..", "storage", "recipes.json")
);

let schema = {
    type: "object",
    properties: {
        status: { type: "string" },
    },
    required: ["status"],
};

async function ApproveAbl(req, res) {
    try {
        const recipeId = req.params.id;
        var valid = uuidValidator(recipeId);
        if (!valid) {
            res.status(400).send({
                errorMessage: "validation of input failed",
                params: req.body,
                reason: "requested id is not valid UUID",
            });
        }
        const ajv = new Ajv();
        let recipe = req.body;
        recipe.id = recipeId
        valid = ajv.validate(schema, recipe);
        if (valid) {
            recipe = await dao.approveRecipe(recipe);
            res.json(recipe);
        } else {
            res.status(400).send({
                errorMessage: "validation of input failed",
                params: recipe,
                reason: ajv.errors,
            });
        }
    } catch (e) {
        if (e.message.startsWith("recipe with given id")) {
            res.status(404).json({ error: e.message });
        }
        res.status(500).send(e);
    }
}

module.exports = UpdateAbl;