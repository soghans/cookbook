import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React from "react";
import { useField } from "formik";

const CookInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const units = [
    { name: "gram", code: "g" },
    { name: "mililitr", code: "ml" },
    { name: "kilogram", code: "kg" },
    { name: "litr", code: "l" },
    { name: "kus", code: "ks" },
    { name: "lžíce", code: "lžíce" },
    { name: "lžička", code: "lžička" },
    { name: "hrnek", code: "hrnek" },
    { name: "špetka", code: "špetka" },
  ];

  return (
    <>
      <span className="p-float-label">
        <Dropdown
          inputId={props.id}
          name={props.name}
          options={units}
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
