import { Chip } from "primereact/chip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlRice,
  faBurger,
  faCarrot,
  faHotdog,
  faIceCream,
  faMartiniGlass,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

function CategoryChip(props) {
  switch (props.category) {
    case "starter":
      return (
        <Chip
          color={"#8ff0a4"}
          icon={
            <FontAwesomeIcon size={"xs"} className={"mr-1"} icon={faCarrot} />
          }
          pt={{
            root: { style: { background: "#8ff0a4", borderRadius: "24px" } },
            label: { className: "text-black" },
          }}
          label="předkrm"
        />
      );
    case "snack":
      return (
        <Chip
          icon={
            <FontAwesomeIcon size={"xs"} className={"mr-1"} icon={faHotdog} />
          }
          pt={{
            root: { style: { background: "#f66151", borderRadius: "24px" } },
            label: { className: "text-black" },
          }}
          label="svačina"
        />
      );
    case "drink":
      return (
        <Chip
          icon={
            <FontAwesomeIcon
              size={"xs"}
              className={"mr-1"}
              icon={faMartiniGlass}
            />
          }
          pt={{
            root: { style: { background: "#dc8add", borderRadius: "24px" } },
            label: { className: "text-black" },
          }}
          label="koktejl"
        />
      );
    case "soup":
      return (
        <Chip
          icon={
            <FontAwesomeIcon size={"xs"} className={"mr-1"} icon={faBowlRice} />
          }
          pt={{
            root: { style: { background: "#f9f06b", borderRadius: "24px" } },
            label: { className: "text-black" },
          }}
          label="polévka"
        />
      );
    case "dessert":
      return (
        <Chip
          icon={
            <FontAwesomeIcon size={"xs"} className={"mr-1"} icon={faIceCream} />
          }
          pt={{
            root: { style: { background: "#cdae8f", borderRadius: "24px" } },
            label: { className: "text-black" },
          }}
          label="dezert"
        />
      );
    default:
      return (
        <Chip
          icon={
            <FontAwesomeIcon size={"xs"} className={"mr-1"} icon={faBurger} />
          }
          pt={{
            root: { style: { background: "#99c1f1", borderRadius: "24px" } },
            label: { className: "text-black" },
          }}
          label="hlavní chod"
        />
      );
  }
}

export default CategoryChip;
