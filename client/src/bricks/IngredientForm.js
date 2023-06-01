import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { isFileCorrectType, isFileTooBig } from "../helpers/validation";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CookInput from "./CookInput";
import CookTextArea from "./CookTextArea";
import CategorySelect from "./CategorySelect";
import CookImgCrop from "./CookImgCrop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { CookService } from "../Service";
function IngredientForm(props) {
  return (
    <Formik
      initialValues={{
        id: props.ingredient.id,
        name: props.ingredient.name,
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .min(3, "Musí obsahovat alespoň 3 znaky")
          .required("Povinné pole"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          if (values.id) {
            CookService.putIngredient(values).then(
              (json) => {
                console.log(json);
                alert(json);
              },
              (error) => {
                console.log(error);
              }
            );
          } else {
            CookService.postIngredient(values).then(
              (json) => {
                console.log(json);
                alert(json);
              },
              (error) => {
                console.log(error);
              }
            );
          }
          setSubmitting(false);
        }, 500);
      }}
    >
      {(formik) => (
        <div className="flex card justify-content-center">
          <Form className="flex flex-column gap-2">
            <CookInput id="name" name="name" label="Název" />
            <Button
              type="submit"
              severity="secondary"
              icon={<FontAwesomeIcon icon={faSave} className="mr-1" />}
              label="Uložit"
            />
          </Form>
        </div>
      )}
    </Formik>
  );
}
export default IngredientForm;
