import React, { useState } from "react";
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
function RecipeForm(props) {
  // const [crop, setCrop] = useState({
  //   unit: "px", // Can be 'px' or '%'
  //   x: 0,
  //   y: 0,
  //   width: 400,
  //   height: 300,
  // });

  const onUpload = () => {
    alert("uploaded");
  };
  return (
    <Formik
      initialValues={{
        id: props.recipe.id,
        author: props.recipe.author,
        category: props.recipe.category,
        description: props.recipe.description,
        image: props.recipe.image,
        procedure: props.recipe.procedure,
        title: props.recipe.title,
      }}
      validationSchema={Yup.object({
        author: Yup.string()
          .min(3, "Musí obsahovat alespoň 3 znaky")
          .max(64, "Musí obsahovat maximálně 64 znaků")
          .required("Povinné pole"),
        category: Yup.string()
          .oneOf(
            ["drink", "starter", "snack", "soup", "dessert", "main course"],
            "Neznámá kategorie pokrmu"
          )
          .required("Povinné pole"),
        description: Yup.string().max(
          160,
          "Musí obsahovat maximálně 160 znaků"
        ),
        // image: Yup.object().shape({
        //   file: Yup.mixed()
        //     .nullable()
        //     .test("fileSize", "Obrázek je moc velký", isFileTooBig)
        //     .test(
        //       "fileType",
        //       "Obrázek musí být ve formátu .png, .jpeg, .jpg",
        //       isFileCorrectType
        //     ),
        // }),
        procedure: Yup.string()
          .min(3, "Musí obsahovat alespoň 3 znaky")
          .required("Povinné pole"),
        title: Yup.string()
          .min(3, "Musí obsahovat alespoň 3 znaky")
          .max(64, "Musí obsahovat maximálně 64 znaků")
          .required("Povinné pole"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 500);
      }}
    >
      {(formik) => (
        <div className="flex justify-content-center">
          <Form className="flex-column gap-2">
            <CookImgCrop label="Obr8zek" id="crop" name="crop" />
            <CookInput id="title" name="title" label="Název" />
            <CategorySelect id="category" name="category" label="Kategorie" />
            <CookInput id="author" name="author" label="Autor" />
            <CookInput id="description" name="description" label="Popisek" />
            <CookTextArea id="procedure" name="procedure" label="Postup" />
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
export default RecipeForm;
