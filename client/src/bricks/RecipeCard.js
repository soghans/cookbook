import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faIceCream,
  faMartiniGlass,
  faCarrot,
  faHotdog,
  faBowlRice,
  faBurger,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import CategoryChip from "./CategoryChip";
import RecipeForm from "./RecipeForm";
import { Dialog } from "primereact/dialog";
import RecipeDetail from "./RecipeDetail";

function RecipeCard(props) {
  const [recipeDetailDialog, setRecipeDetailDialog] = useState(false);

  const hideDialog = () => {
    setRecipeDetailDialog(false);
  };
  const header = (
    <div className="flex flex-wrap justify-content-center gap-2">
      <img alt="card" src={props.recipe.image} />
    </div>
  );

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button
        label="Detail"
        icon={<FontAwesomeIcon className={"mr-1"} icon={faMagnifyingGlass} />}
        onClick={(event) => setRecipeDetailDialog(true)}
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center m-5">
      <Card
        title={props.recipe.title}
        subTitle={<CategoryChip category={props.recipe.category} />}
        footer={footer}
        header={header}
        className="md:w-20rem"
      >
        <p className="m-0">{props.recipe.description}</p>
      </Card>

      <Dialog
        visible={recipeDetailDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={props.recipe.title}
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <RecipeDetail recipeId={props.recipe.id} />
      </Dialog>
    </div>
  );
}

export default RecipeCard;
