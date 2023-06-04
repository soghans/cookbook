import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import CookInput from "./CookInput";
import CookTextArea from "./CookTextArea";
import CategorySelect from "./CategorySelect";
import CookImgCrop from "./CookImgCrop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import RecipeForm from "./RecipeForm";
import { Dialog } from "primereact/dialog";
import { CookService } from "../Service";
import { InputNumber } from "primereact/inputnumber";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";

function RecipeDetail(props) {
  const [recipe, setRecipe] = useState();
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [persons, setPersons] = useState(4);

  useEffect(() => {
    CookService.getRecipe(props.recipeId).then((data) => {
      setRecipe(data);
      for (let i = 0; i < data.ingredients.length; i++) {
        console.log(data.ingredients[i]);
        data.ingredients[i].amount = data.ingredients[i].amount * 4;
      }
      setIngredients(data.ingredients);
      setLoading(false);
    });
  }, []);

  const changeIngredients = (value) => {
    for (let i = 0; i < ingredients.length; i++) {
      ingredients[i].amount = (ingredients[i].amount / persons) * value;
    }
    setPersons(value);
    setIngredients(ingredients);
  };

  if (loading) {
    return <ProgressSpinner />;
  } else {
    return (
      <div className="flex card flex-wrap justify-content-center">
        <div className="grid">
          <div className="col-12">
            <Image src={recipe.image} alt={recipe.title} />
          </div>
          <div className="col-2">
            <span className="p-label">
              <label className="mt-1" htmlFor="persons">
                Porce na počet osob
              </label>
              <InputNumber
                value={persons}
                onValueChange={(e) => changeIngredients(e.value)}
                showButtons
                buttonLayout="horizontal"
                step={1.0}
                mode="decimal"
                decrementButtonClassName="p-button-danger"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                max={99}
                min={1}
                name="persons"
              />
            </span>
          </div>
          <div className="col-10"></div>
          <div className="col-12">
            <DataTable
              className="flex-wrap"
              value={ingredients}
              header="Ingredience"
              size="small"
            >
              <Column field="name"></Column>
              <Column field="amount"></Column>
              <Column field="unit"></Column>
            </DataTable>
          </div>
          <div className="col-12">
            <Accordion activeIndex={0}>
              <AccordionTab header="Postup">
                <p className="m-0">{recipe.procedure}</p>
              </AccordionTab>
            </Accordion>
          </div>
          <small>{recipe.author}</small>
        </div>
      </div>
    );
  }
}
export default RecipeDetail;
