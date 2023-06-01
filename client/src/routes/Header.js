import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookSkull,
  faLemon,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { Menubar } from "primereact/menubar";
import { Link, Outlet } from "react-router-dom";
import "primereact/resources/themes/saga-orange/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

function Header() {
  const items = [
    {
      label: "Recepty",
      icon: <FontAwesomeIcon className={"mr-3"} icon={faUtensils} />,
      url: "/recipes",
    },
    {
      label: "Ingredience",
      icon: <FontAwesomeIcon className={"mr-3"} icon={faLemon} />,
      url: "/ingredients",
    },
  ];
  const start = (
    <Link className="mr-8" to="/">
      <FontAwesomeIcon size={"3x"} icon={faBookSkull} />
    </Link>
  );

  return (
    <div className="App">
      <Menubar title="CookBook" model={items} start={start} />
      <Outlet />
    </div>
  );
}
export default Header;
