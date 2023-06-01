import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React from "react";
import { useField } from "formik";

const CookInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const categories = [
    { name: "gram", code: "g" },
    { name: "mililitr", code: "main course" },
    { name: "Koktejl", code: "drink" },
    { name: "Polévka", code: "soup" },
    { name: "Předkrm", code: "starter" },
    { name: "Svačina", code: "snack" },
  ];
  return (
    <>
      <span className="p-float-label mt-3">
        <Dropdown
          inputId={props.id}
          name={props.name}
          options={categories}
          optionLabel="name"
          optionValue="code"
          {...field}
          {...props}
          className={classNames("w-full md:w-14rem", {
            "p-invalid": !!(meta.touched && meta.error),
          })}
        />
        <label htmlFor={props.id || props.name}>{label}</label>
      </span>
      {!!(meta.touched && meta.error) ? (
        <small className="p-error">{meta.error}</small>
      ) : (
        <small className="p-error">&nbsp;</small>
      )}
    </>
  );
};

export default CookInput;
