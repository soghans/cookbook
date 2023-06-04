import { classNames } from "primereact/utils";
import React from "react";
import { useField } from "formik";
import { InputNumber } from "primereact/inputnumber";

const CookInputNumber = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <span className="p-float-label">
        <InputNumber
          id={props.id}
          name={props.name}
          min={0}
          max={9999}
          minFractionDigits={0}
          maxFractionDigits={2}
          {...field}
          {...props}
          className={classNames({
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

export default CookInputNumber;
