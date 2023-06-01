import React, { useState, useEffect, useRef } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCirclePlus,
  faFileArrowDown,
  faPencil,
  faSave,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { CookService } from "../Service";
import CategoryChip from "./CategoryChip";
import { Dialog } from "primereact/dialog";
import RecipeForm from "./RecipeForm";
import IngredienceForm from "./IngredientForm";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import CookInput from "./CookInput";

function IngredientTable() {
  let emptyIngredient = {
    id: "",
    name: "",
    created_at: "",
  };

  const [ingredients, setIngredients] = useState(null);
  const [ingredientDialog, setIngredientDialog] = useState(false);
  const [deleteIngredientDialog, setDeleteIngredientDialog] = useState(false);
  const [ingredient, setIngredient] = useState(emptyIngredient);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    CookService.getIngredients().then((data) => setIngredients(data));
  }, []);

  const deleteIngredient = () => {
    CookService.deleteIngredient(ingredient.id).then((status) => {
      if (status !== 200) {
        toast.current.show({
          severity: "danger",
          summary: "Chyba",
          detail: `Nepovedlo se smazat ${ingredient.name} ingredienci`,
          life: 3000,
        });
      } else {
        let _ingredients = ingredients.filter(
          (val) => val.id !== ingredient.id
        );
        setIngredients(_ingredients);
        setDeleteIngredientDialog(false);
        setIngredient(emptyIngredient);
        toast.current.show({
          severity: "success",
          summary: "Úspěch",
          detail: `Ingredience ${ingredient.name} byla smazána`,
          life: 3000,
        });
      }
    });
  };

  const saveIngredient = (values) => {
    setSubmitted(true);
    if (values.name.trim()) {
      let _ingredients = [...ingredients];
      let _ingredient = { id: values.id, name: values.name };

      if (_ingredient.id) {
        CookService.putIngredient(_ingredient).then(
          (res) => {
            if (res.ok) {
              const index = findIndexById(_ingredient.id);
              _ingredients[index] = _ingredient;
              toast.current.show({
                severity: "success",
                summary: "Úspěch",
                detail: `Ingredience ${values.name} byla aktualizována`,
                life: 3000,
              });
            } else {
              console.log(res);
              toast.current.show({
                severity: "warning",
                summary: "Chyba",
                detail: `Ingredience ${values.name} se nepovedla aktualizovat`,
                life: 3000,
              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        CookService.postIngredient(_ingredient).then(
          (res) => {
            if (res.ok) {
              _ingredient.id = res.json().then((json) => {
                json.id;
              });
              console.log(_ingredients);
              _ingredients.push(_ingredient);
              console.log(_ingredients);
              toast.current.show({
                severity: "success",
                summary: "Úspěch",
                detail: `Ingredience ${values.name} byla vytvořena`,
                life: 3000,
              });
            } else {
              console.log(res);
              toast.current.show({
                severity: "warning",
                summary: "Chyba",
                detail: `Ingredience ${values.name} se nepovedla aktualizovat`,
                life: 3000,
              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
      setIngredients(_ingredients);
      setIngredientDialog(false);
      setIngredient(emptyIngredient);
    }
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const openNew = () => {
    setIngredient(emptyIngredient);
    setSubmitted(false);
    setIngredientDialog(true);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const mapValues = (values) => {
    let _ingredient = {
      id: values.id,
      name: values.name,
      created_at: "",
    };
    setIngredient(_ingredient);
  };
  const editIngredient = (recipe) => {
    setIngredient({ ...recipe });
    setIngredientDialog(true);
  };
  const confirmDeleteIngredient = (product) => {
    setIngredient(product);
    setDeleteIngredientDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setIngredientDialog(false);
  };
  const hideDeleteIngredientDialog = () => {
    setDeleteIngredientDialog(false);
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nová ingredience"
          icon={<FontAwesomeIcon className="mr-1" icon={faCirclePlus} />}
          severity="success"
          onClick={openNew}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Exportovat"
        icon={<FontAwesomeIcon icon={faFileArrowDown} className="mr-1" />}
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon={<FontAwesomeIcon icon={faPencil} />}
          rounded
          outlined
          className="mr-2"
          severity="info"
          onClick={() => editIngredient(rowData)}
        />
        <Button
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteIngredient(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Správa Ingrediencí</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Hledat..."
        />
      </span>
    </div>
  );

  function dialogHeader() {
    if (ingredient.id) {
      return "Editace ingredience";
    }
    return "Nová ingredience";
  }

  const deleteRecipeDialogFooter = (
    <React.Fragment>
      <Button
        label="Ne"
        icon={<FontAwesomeIcon icon={faXmark} className="mr-1" />}
        outlined
        onClick={hideDeleteIngredientDialog}
      />
      <Button
        label="Ano"
        icon={<FontAwesomeIcon icon={faCheck} className="mr-1" />}
        severity="danger"
        onClick={deleteIngredient}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <br />
      <div className="card">
        <Toolbar
          className="mb-4"
          start={leftToolbarTemplate}
          end={rightToolbarTemplate}
        />
        <DataTable
          ref={dt}
          value={ingredients}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Ukázka od {first} do {last} z celkem {totalRecords} ingrediencí"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="id"
            header="ID"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="name"
            header="Název"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="created_at"
            header="Datum"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={ingredientDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={dialogHeader}
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <Formik
          initialValues={{
            id: ingredient.id,
            name: ingredient.name,
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(3, "Musí obsahovat alespoň 3 znaky")
              .required("Povinné pole"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              saveIngredient(values);
              setSubmitted(false);
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
      </Dialog>

      <Dialog
        visible={deleteIngredientDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Potvrzení"
        modal
        footer={deleteRecipeDialogFooter}
        onHide={hideDeleteIngredientDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {ingredient && (
            <span>
              Opravdu chcete smazat ingredienci <b>{ingredient.title}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default IngredientTable;
