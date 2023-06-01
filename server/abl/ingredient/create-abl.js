const path = require("path");
const Ajv = require("ajv").default;
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

async function CreateAbl(req, res) {
    try {
        const ajv = new Ajv();
        const valid = ajv.validate(schema, req.body);
        if (valid) {
            let ingredient = req.body;
            ingredient = await dao.createIngredient(ingredient);
            res.json(ingredient);
        } else {
            res.status(400).send({
                errorMessage: "validation of input failed",
                params: req.body,
                reason: ajv.errors,
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = CreateAbl;