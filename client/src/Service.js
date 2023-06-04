const url = "http://localhost:8000";

export class CookService {
  static getRecipe(id) {
    return fetch(`${url}/recipe/${id}`).then((res) => res.json());
  }

  static getRecipes() {
    return fetch(`${url}/recipe`).then((res) => res.json());
  }

  static deleteRecipe(id) {
    return fetch(`${url}/recipe/${id}`, { method: "DELETE" }).then(
      (res) => res.status
    );
  }

  static getIngredients() {
    return fetch(`${url}/ingredient`).then((res) => res.json());
  }

  static deleteIngredient(id) {
    return fetch(`${url}/ingredient/${id}`, { method: "DELETE" }).then(
      (res) => res.status
    );
  }

  static postIngredient(values) {
    return fetch(`${url}/ingredient`, {
      method: "POST",
      body: JSON.stringify(values, null, 2),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res);
  }

  static postRecipe(values) {
    return fetch(`${url}/recipe`, {
      method: "POST",
      body: JSON.stringify(values, null, 2),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res);
  }

  static putIngredient(values) {
    return fetch(`${url}/ingredient/${values.id}`, {
      method: "PUT",
      body: JSON.stringify(values, null, 2),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res);
  }
}
