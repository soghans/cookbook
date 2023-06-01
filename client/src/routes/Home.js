import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import RecipeCard from "../bricks/RecipeCard";

function Home() {
  const [listRecipesCall, setListRecipesCall] = useState({
    state: "pending",
  });

  useEffect(() => {
    fetch(`http://localhost:8000/recipe`, {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setListRecipesCall({ state: "error", error: responseJson });
      } else {
        setListRecipesCall({ state: "success", data: responseJson });
      }
    });
  }, []);
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
  return (
    <div className="flex grid m-5 justify-content-center">{getCookBook()}</div>
  );
}

export default Home;
