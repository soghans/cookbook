import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { isFileCorrectType, isFileTooBig } from "../helpers/validation";
import "react-image-crop/dist/ReactCrop.css";
import CookInput from "./CookInput";
import CookTextArea from "./CookTextArea";
import CategorySelect from "./CategorySelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { CookService } from "../Service";
import UnitSelect from "./UnitSelect";
import IngredientSelect from "./IngredientSelect";

function RecipeForm(props) {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsInputs, setIngredientsInputs] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState(["1", "2", "3"]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    CookService.getIngredients().then((data) => setIngredients(data));
    if (props.recipe.id) {
      CookService.getRecipe(props.recipe.id).then((data) => {
        setRecipe(data);
        setRecipeIngredients(recipe.ingredients);
      });
    }
  }, []);

  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

    reader.readAsDataURL(blob);

    reader.onloadend = function () {
      const base64data = reader.result;
    };
  };

  const ingredientPanel = (i) => {
    return (
      <>
        <div className="col-4">
          <IngredientSelect
            id={"ingredients[" + i + "].id"}
            name={"ingredients[" + i + "].id"}
            options={ingredients}
            label="Ingredience"
          />
        </div>
        <div className="col-4">
          <CookInput
            id={"ingredients[" + i + "].amount"}
            name={"ingredients[" + i + "].amount"}
            keyfilter="num"
            label="Množství"
          />
        </div>
        <div className="col-4">
          <UnitSelect
            id={"ingredients[" + i + "].unit"}
            name={"ingredients[" + i + "].unit"}
            label="Jednotka"
          />
        </div>
      </>
    );
  };

  return (
    <Formik
      initialValues={{
        id: props.recipe.id,
        author: props.recipe.author,
        category: props.recipe.category,
        description: props.recipe.description,
        image: props.recipe.image,
        procedure: props.recipe.procedure,
        title: props.recipe.title,
        ingredients: props.recipe.ingredients,
      }}
      validationSchema={Yup.object({
        author: Yup.string()
          .min(3, "Musí obsahovat alespoň 3 znaky")
          .max(64, "Musí obsahovat maximálně 64 znaků")
          .required("Povinné pole"),
        category: Yup.string()
          .oneOf(
            ["drink", "starter", "snack", "soup", "dessert", "main course"],
            "Neznámá kategorie pokrmu"
          )
          .required("Povinné pole"),
        description: Yup.string().max(
          160,
          "Musí obsahovat maximálně 160 znaků"
        ),
        person: Yup.number()
          .max(99, "Maximum je 99")
          .min(1, "Minimum je 1")
          .required("Povinné pole"),
        // image: Yup.object().shape({
        //   file: Yup.mixed()
        //     .nullable()
        //     .test("fileSize", "Obrázek je moc velký", isFileTooBig)
        //     .test(
        //       "fileType",
        //       "Obrázek musí být ve formátu .png, .jpeg, .jpg",
        //       isFileCorrectType
        //     ),
        // }),
        procedure: Yup.string()
          .min(3, "Musí obsahovat alespoň 3 znaky")
          .required("Povinné pole"),
        title: Yup.string()
          .min(3, "Musí obsahovat alespoň 3 znaky")
          .max(64, "Musí obsahovat maximálně 64 znaků")
          .required("Povinné pole"),
        // ingredients: Yup.array({
        //   id: Yup.string().required("Povinné pole"),
        //   amount: Yup.number()
        //     .max(9999, "Maximum je 9999")
        //     .min(1, "Minimum je 1")
        //     .required("Povinné pole"),
        //   unit: Yup.string()
        //     .oneOf(
        //       [
        //         "g",
        //         "ml",
        //         "kg",
        //         "l",
        //         "pinch",
        //         "tablespoon",
        //         "teaspoon",
        //         "piece",
        //       ],
        //       "Neznámá jednotka"
        //     )
        //     .required("Povinné pole"),
        // })
        //   .required("Povinné pole")
        //   .min(1, "Musí obsahovat alespoň jednu ingredienci"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          for (let i = 0; i < values.ingredients.length; i++) {
            values.ingredients[i].amount =
              values.ingredients[i].amount / values.person;
          }
          CookService.postRecipe(values).then((res) => {
            if (res.status >= 400) {
              console.log(res.json());
            } else {
              document.getElementById("new-recipe-dialog").close();
            }
          });
          setSubmitting(false);
        }, 500);
      }}
    >
      {(formik) => (
        <div className="flex justify-content-center">
          <Form className="flex-column gap-2">
            <div className="grid">
              <div className="col-12 mb-3">
                <FileUpload
                  mode="basic"
                  name="image"
                  accept="image/*"
                  url="api/upload/"
                  customUpload
                  chooseLabel="Nahrát obrázek"
                  uploadHandler={(event) => customBase64Uploader(event)}
                />
              </div>
              <div className="col-6">
                <CookInput id="title" name="title" label="Název" />
              </div>
              <div className="col-6">
                <CategorySelect
                  id="category"
                  name="category"
                  label="Kategorie"
                />
              </div>
              <div className="col-6">
                <CookInput id="author" name="author" label="Autor" />
              </div>
              <div className="col-6">
                <CookInput
                  id="description"
                  name="description"
                  label="Popisek"
                />
              </div>
              <div className="col-12">
                <CookTextArea id="procedure" name="procedure" label="Postup" />
              </div>
              <div className="col-2">
                <CookInput
                  id="person"
                  name="person"
                  keyfilter="num"
                  label="Počet osob"
                />
              </div>
              <div className="col-4"></div>
              <div className="col-6">
                <Button
                  type="button"
                  severity="success"
                  icon={<FontAwesomeIcon icon={faPlus} className="mr-1" />}
                  label="Přidat ingredienci"
                  onClick={(e) =>
                    recipeIngredients.push(recipeIngredients.length + 1)
                  }
                  className="mb-3"
                />
              </div>

              {recipeIngredients.map((v, i) => ingredientPanel(i))}
              <Button
                type="submit"
                severity="secondary"
                icon={<FontAwesomeIcon icon={faSave} className="mr-1" />}
                label="Uložit"
              />
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
export default RecipeForm;
