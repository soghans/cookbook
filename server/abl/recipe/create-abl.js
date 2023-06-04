const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(
    path.join(__dirname, "..", "..", "storage", "recipes.json")
);

let schema = {
    type: "object",
    properties: {
        author: { type: "string", minLength: 3, maxLength: 64 },
        category: { type: "string" },
        description: { type: "string", maxLength: 160 },
        image: { type: "string" },
        ingredients: {type: "array", items: { type: "object" }, uniqueItems: true, minItems: 1 },
        procedure: { type: "string", minLength: 3 },
        title: { type: "string", minLength:3, maxLength: 64 },
    },
    required: ["author", "ingredients", "category", "procedure", "title"],
};

async function CreateAbl(req, res) {
    try {
        const ajv = new Ajv();
        const valid = ajv.validate(schema, req.body);
        if (valid) {
            let recipe = req.body;
            recipe = await dao.createRecipe(recipe);
            res.json(recipe);
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