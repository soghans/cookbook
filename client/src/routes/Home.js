import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCirclePlus,
  faFileArrowDown,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import RecipeCard from "../bricks/RecipeCard";
import { CookService } from "../Service";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import CategorySelect from "../bricks/CategorySelect";
import { Dropdown } from "primereact/dropdown";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState(null);
  const [listRecipesCall, setListRecipesCall] = useState({
    state: "pending",
  });

  const categories = [
    { name: "Dezert", code: "dessert" },
    { name: "Hlavní chod", code: "main course" },
    { name: "Koktejl", code: "drink" },
    { name: "Polévka", code: "soup" },
    { name: "Předkrm", code: "starter" },
    { name: "Svačina", code: "snack" },
  ];

  useEffect(() => {
    fetch(`http://localhost:8000/recipe`, {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setListRecipesCall({ state: "error", error: responseJson });
      } else {
        setRecipes(responseJson);
        setListRecipesCall({ state: "success", data: responseJson });
      }
    });
  }, []);

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon={<FontAwesomeIcon className="mr-1" icon={faFilter} />}
          severity="secondary"
          onClick={(event) => {
            let _recipes = recipes.filter((val) => val.category === category);
            setRecipes(_recipes);
          }}
        />
        <Dropdown
          placeholder="Dle kategorie"
          name="filter"
          inputId="filter"
          options={categories}
          optionLabel="name"
          optionValue="code"
          value={category}
          onChange={(e) => setCategory(e.value)}
        />
      </div>
    );
  };

  function getCookBook() {
    switch (listRecipesCall.state) {
      case "pending":
        return <ProgressSpinner />;
      case "success":
        return listRecipesCall.data.map((recipe) => {
          return <RecipeCard key={recipe.id} recipe={recipe} />;
        });
      case "error":
        return (
          <div>
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className={"mt-3"}
              size={"4x"}
            />
            <h2>Error</h2>
          </div>
        );
      default:
        return null;
    }
  }

  const getRecipe = (recipe) => {
    return <RecipeCard key={recipe.id} recipe={recipe} />;
  };
  return (
    <div className="flex grid m-5 justify-content-center grid">
      <div className="col-12">
        <Toolbar className="mb-4" end={rightToolbarTemplate} />
      </div>
      <DataView value={recipes} layout="grid" itemTemplate={getRecipe} />{" "}
    </div>
  );
}

export default Home;
