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
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { CookService } from "../Service";
import CategoryChip from "./CategoryChip";
import { Dialog } from "primereact/dialog";
import RecipeForm from "./RecipeForm";

function RecipeTable() {
  let emptyRecipe = {
    id: "",
    title: "",
    image: "",
    description: "",
    category: "",
    author: "",
    created_at: "",
    procedure: "",
  };

  const [recipes, setRecipes] = useState(null);
  const [recipeDialog, setRecipeDialog] = useState(false);
  const [deleteRecipeDialog, setDeleteRecipeDialog] = useState(false);
  const [recipe, setRecipe] = useState(emptyRecipe);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    CookService.getRecipes().then((data) => setRecipes(data));
  }, []);

  const deleteRecipe = () => {
    CookService.deleteRecipe(recipe.id).then((status) => {
      if (status !== 200) {
        toast.current.show({
          severity: "danger",
          summary: "Error",
          detail: "Nepovedlo se smazat daný recept",
          life: 3000,
        });
      } else {
        let _recipes = recipes.filter((val) => val.id !== recipe.id);
        setRecipes(_recipes);
        setDeleteRecipeDialog(false);
        setRecipe(emptyRecipe);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Recipe Deleted",
          life: 3000,
        });
      }
    });
  };

  const saveRecipe = () => {
    setSubmitted(true);

    if (recipe.title.trim()) {
      let _recipes = [...recipes];
      let _recipe = { ...recipe };

      if (recipe.id) {
        const index = findIndexById(recipe.id);

        _recipes[index] = _recipe;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _recipe.image = "product-placeholder.svg";
        _recipes.push(_recipe);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setRecipes(_recipes);
      setRecipeDialog(false);
      setRecipe(emptyRecipe);
    }
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const openNew = () => {
    setRecipe(emptyRecipe);
    setSubmitted(false);
    setRecipeDialog(true);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const editRecipe = (recipe) => {
    setRecipe({ ...recipe });
    setRecipeDialog(true);
  };
  const confirmDeleteRecipe = (product) => {
    setRecipe(product);
    setDeleteRecipeDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setRecipeDialog(false);
  };
  const hideDeleteRecipeDialog = () => {
    setDeleteRecipeDialog(false);
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nový recept"
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

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`}
        alt={rowData.image}
        className="shadow-2 border-round"
        style={{ width: "64px" }}
      />
    );
  };

  const categoryBodyTemplate = (rowData) => {
    return <CategoryChip category={rowData.category} />;
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
          onClick={() => editRecipe(rowData)}
        />
        <Button
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteRecipe(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Správa Receptů</h4>
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
    if (recipe.id) {
      return "Editace receptu";
    }
    return "Nový recept";
  }

  const deleteRecipeDialogFooter = (
    <React.Fragment>
      <Button
        label="Ne"
        icon={<FontAwesomeIcon icon={faXmark} className="mr-1" />}
        outlined
        onClick={hideDeleteRecipeDialog}
      />
      <Button
        label="Ano"
        icon={<FontAwesomeIcon icon={faCheck} className="mr-1" />}
        severity="danger"
        onClick={deleteRecipe}
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
          value={recipes}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Ukázka od {first} do {last} z celkem {totalRecords} receptů"
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
            field="title"
            header="Název"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="author"
            header="Autor"
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
            field="image"
            header="Obrázek"
            body={imageBodyTemplate}
          ></Column>
          <Column
            field="category"
            header="Kategorie"
            body={categoryBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={recipeDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={dialogHeader}
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        <RecipeForm recipe={recipe} />
      </Dialog>

      <Dialog
        visible={deleteRecipeDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Potvrzení"
        modal
        footer={deleteRecipeDialogFooter}
        onHide={hideDeleteRecipeDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {recipe && (
            <span>
              Opravdu chcete smazat recept <b>{recipe.title}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default RecipeTable;
