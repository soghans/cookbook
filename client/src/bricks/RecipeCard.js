import React from "react";
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

function RecipeCard(props) {
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
    </div>
  );
}

export default RecipeCard;
